/**
 * API host (Apollo HttpLink targets `${BACKEND_ORIGIN}/graphql` — see apolloClient.ts).
 */
export const BACKEND_ORIGIN = "https://internox.duckdns.org";

export function fortnoxAuthUrl(): string {
  return `${BACKEND_ORIGIN}/auth`;
}
