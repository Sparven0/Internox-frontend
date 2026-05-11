import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { BACKEND_ORIGIN } from "./backendOrigin";

const httpLink = new HttpLink({
  uri: `${BACKEND_ORIGIN}/graphql`,
  credentials: "include",
});

// Sentinel to track whether the user is authenticated this session.
// "cookie" means authenticated via httpOnly cookie; null means not authenticated.
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  // Reset cached user and verification when logging out
  if (!token) {
    sessionUser = null;
    sessionVerifyPromise = null;
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export type SessionUser = {
  id: string;
  role: string;
  email?: string | null;
  userName?: string | null;
  companyId?: string | null;
  companyName?: string | null;
};

// Cached user from the ME query — survives for the lifetime of the page.
let sessionUser: SessionUser | null = null;
let sessionVerifyPromise: Promise<SessionUser | null> | null = null;

/** Returns the cached session user without making a network request. */
export function getSessionUser(): SessionUser | null {
  return sessionUser;
}

/**
 * Verify the session cookie via the ME query.
 * Returns the session user on success, or null if not authenticated.
 * The result is cached — only one network call per page load.
 */
export function verifySession(): Promise<SessionUser | null> {
  if (sessionUser) return Promise.resolve(sessionUser);
  if (sessionVerifyPromise) return sessionVerifyPromise;

  sessionVerifyPromise = fetch(`${BACKEND_ORIGIN}/graphql`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "{ me { id role email userName companyId companyName } }",
    }),
  })
    .then((res) => {
      if (!res.ok) return null;
      return res.json().then((json) => {
        const user: SessionUser | null = json?.data?.me ?? null;
        if (user) {
          authToken = "cookie";
          sessionUser = user;
        }
        return user;
      });
    })
    .catch(() => null);

  return sessionVerifyPromise;
}

let superAdminToken: string | null = null;
let superAdminVerifyPromise: Promise<boolean> | null = null;

export function setSuperAdminToken(token: string | null) {
  superAdminToken = token;
  if (!token) {
    superAdminVerifyPromise = null;
  }
}

export function getSuperAdminToken(): string | null {
  return superAdminToken;
}

/**
 * Verify the super admin session cookie via the ME query.
 * Sets the superAdminToken sentinel if the session is valid.
 * Returns true if authenticated as super admin, false otherwise.
 * The result is cached — only one network call per page load.
 */
export function verifySuperAdminSession(): Promise<boolean> {
  if (superAdminToken) return Promise.resolve(true);
  if (superAdminVerifyPromise) return superAdminVerifyPromise;

  superAdminVerifyPromise = verifySession().then((user) => {
    if (user?.role === "super_admin") {
      superAdminToken = "authenticated";
      return true;
    }
    return false;
  });

  return superAdminVerifyPromise;
}

const authLink = new SetContextLink(({ headers }) => {
  // Only add Authorization header for super admin requests (regular users rely on httpOnly cookie)
  const contextAuth =
    (headers as Record<string, string> | undefined)?.Authorization ||
    (headers as Record<string, string> | undefined)?.authorization;
  const allHeaders = (headers ?? {}) as Record<string, string>;
  const { Authorization: omit, ...restHeaders } = allHeaders;
  void omit;
  return {
    headers: {
      ...restHeaders,
      ...(contextAuth ? { authorization: contextAuth } : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  devtools: { enabled: true },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getInitPageData: { keyArgs: false },
          getUsers: { keyArgs: ["company"] },
          getUsersByCompanyId: { keyArgs: ["companyId"] },
        },
      },
      Company: { keyFields: ["id"] },
      User: { keyFields: ["id"] },
      ImapCredential: { keyFields: ["id"] },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});

export default client;
