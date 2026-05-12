import { normalizedEmailsFromAddressField } from "./emailAddressNormalize";

/**
 * Fortnox kan lägga tomma vinkelparenteser efter alias (t.ex. "CGL <>").
 * Tas bort från slutet innan matchning.
 */
export function stripTrailingEmptyAngleBrackets(s: string): string {
  return s.replace(/\s*(?:<\s*>)+$/g, "").trim();
}

/** Trim — alias matchas mot Fortnox; tomma <> i slutet ignoreras. */
export function normalizeAliasLookupKey(alias: string): string {
  return stripTrailingEmptyAngleBrackets(alias.trim());
}

export type AliasCustomerRow = {
  alias: string;
  customerId: string;
};

/**
 * Senaste alias-vinsten vid dubbletter (backend bör hålla alias unika).
 */
export function buildAliasCustomerIdMap(
  rows: AliasCustomerRow[],
): Map<string, string> {
  const m = new Map<string, string>();
  for (const r of rows) {
    const key = normalizeAliasLookupKey(r.alias);
    if (!key) continue;
    m.set(key, r.customerId);
  }
  return m;
}

/**
 * Delar på ; och ,, plockar ut innehåll i vinkelparenteser om det finns,
 * annars hela segmentet (alias utan @, e-post, etc.).
 */
export function recipientTokens(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[;,]+/)) {
    const s = part.replace(/^mailto:/i, "").trim();
    if (!s) continue;
    const angle = s.match(/<([^>]+)>/);
    let candidate = (angle?.[1] ?? s).trim();
    candidate = stripTrailingEmptyAngleBrackets(candidate);
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    out.push(candidate);
  }
  return out;
}

/**
 * Per token: först alias-map (exact trimmed key), sedan alla normaliserade e-postträffar.
 */
export function resolveRecipientTokensToCustomerIds(
  tokens: string[],
  aliasMap: Map<string, string>,
  customersByEmail: Map<string, string[]>,
): string[] {
  const ids = new Set<string>();
  for (const token of tokens) {
    const trimmed = token.trim();
    const aliasHit = aliasMap.get(trimmed);
    if (aliasHit) ids.add(aliasHit);
    for (const norm of normalizedEmailsFromAddressField(token)) {
      for (const cid of customersByEmail.get(norm) ?? []) ids.add(cid);
    }
  }
  return [...ids];
}

export function resolveRecipientRawToCustomerIds(
  raw: string,
  aliasMap: Map<string, string>,
  customersByEmail: Map<string, string[]>,
): string[] {
  return resolveRecipientTokensToCustomerIds(
    recipientTokens(raw),
    aliasMap,
    customersByEmail,
  );
}
