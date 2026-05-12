/** Lowercases and trims; parses "Name <x@y.z>", mailto:, and bare addresses. */

export function normalizeEmailAddress(raw: string): string | null {
  const s = raw.replace(/^mailto:/i, "").trim();
  if (!s) return null;
  const angle = s.match(/<([^>]+@[^>]+)>/);
  const candidate = (angle?.[1] ?? s).trim();
  const bare = candidate.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  return bare ? bare[0].toLowerCase() : null;
}

/** One header field may contain several addresses separated by ; or ,. */
export function normalizedEmailsFromAddressField(raw: string): string[] {
  const normSet = new Set<string>();
  for (const token of raw.split(/[;,]+/)) {
    const n = normalizeEmailAddress(token);
    if (n) normSet.add(n);
  }
  return [...normSet];
}
