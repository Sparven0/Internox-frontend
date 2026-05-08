/**
 * API host (Apollo HttpLink targets `${BACKEND_ORIGIN}/graphql` — see apolloClient.ts).
 */
export const BACKEND_ORIGIN = "http://localhost:1222";

export function fortnoxAuthUrl(token: string): string {
  return `${BACKEND_ORIGIN}/auth?token=${encodeURIComponent(token)}`;
}
