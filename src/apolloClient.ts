import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { BACKEND_ORIGIN } from "./backendOrigin";

const httpLink = new HttpLink({
  uri: `${BACKEND_ORIGIN}/graphql`,
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

let superAdminToken: string | null = null;

export function setSuperAdminToken(token: string | null) {
  superAdminToken = token;
}

export function getSuperAdminToken(): string | null {
  return superAdminToken;
}

const authLink = new SetContextLink(({ headers }) => {
  // Prefer an Authorization header already set in context (e.g. super admin token)
  const contextAuth =
    (headers as Record<string, string> | undefined)?.Authorization ||
    (headers as Record<string, string> | undefined)?.authorization;
  // Normalise to a single lowercase key so duplicate headers aren't sent
  const allHeaders = (headers ?? {}) as Record<string, string>;
  const { Authorization: omit, ...restHeaders } = allHeaders;
  void omit;
  return {
    headers: {
      ...restHeaders,
      authorization: contextAuth || (authToken ? `Bearer ${authToken}` : ""),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
