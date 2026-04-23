// src/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:1222/graphql",
});

// Token is kept in memory (set via setAuthToken). Never stored in localStorage.
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
  cache: new InMemoryCache(),
});

export default client;
