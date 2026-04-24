// src/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:1222/graphql",
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

const authLink = new SetContextLink(({ headers }) => ({
  headers: {
    ...headers,
    authorization: authToken ? `Bearer ${authToken}` : "",
  },
}));

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
