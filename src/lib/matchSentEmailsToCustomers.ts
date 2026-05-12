import {
  normalizeEmailAddress,
  normalizedEmailsFromAddressField,
} from "./emailAddressNormalize";
import { resolveRecipientRawToCustomerIds } from "./resolveRecipientToCustomers";

export {
  normalizeEmailAddress,
  normalizedEmailsFromAddressField,
} from "./emailAddressNormalize";

export type IntegrationEmailEntry = {
  userId: string | number;
  emails?: string[];
  error?: string;
};

type InitUserRow = { id: string; email?: string | null };

function collectRecipientStrings(raw: unknown): string[] {
  if (raw === undefined || raw === null) return [];
  if (typeof raw === "string") return raw.trim() ? [raw] : [];
  if (!Array.isArray(raw)) return [];

  const out: string[] = [];
  for (const el of raw) {
    if (typeof el === "string") {
      if (el.trim()) out.push(el);
      continue;
    }
    if (el && typeof el === "object") {
      const ob = el as Record<string, unknown>;
      const addr = ob.email ?? ob.address ?? ob.to ?? ob.mail ?? ob.EmailAddress;
      if (typeof addr === "string" && addr.trim()) out.push(addr);
      if (Array.isArray(addr)) {
        for (const x of addr) {
          if (typeof x === "string" && x.trim()) out.push(x);
        }
      }
    }
  }
  return out;
}

function pickIntegrationUserId(
  o: Record<string, unknown>,
  emailToUserId: Map<string, string>,
): string | number | null {
  const idCandidates = [o.userId, o.user_id];
  for (const c of idCandidates) {
    if (c === undefined || c === null) continue;
    const s = String(c).trim();
    if (s !== "") return c as string | number;
  }

  const uMail =
    o.email ??
    o.email_address ??
    o.userEmail ??
    o.user_email ??
    o.mail ??
    o.employeeEmail;
  if (typeof uMail === "string") {
    const n = normalizeEmailAddress(uMail);
    if (n && emailToUserId.has(n)) return emailToUserId.get(n)!;
  }
  return null;
}

/**
 * Backend returns `emails` as loose JSON — normalises shape for matching.
 */
export function parseIntegrationEmailPayload(
  raw: unknown,
  users: InitUserRow[],
): IntegrationEmailEntry[] {
  if (!Array.isArray(raw)) return [];

  const emailToUserId = new Map<string, string>();
  for (const u of users) {
    if (!u.email) continue;
    const n = normalizeEmailAddress(u.email);
    if (n) emailToUserId.set(n, u.id);
  }

  const out: IntegrationEmailEntry[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;

    const userId = pickIntegrationUserId(o, emailToUserId);
    if (userId === null) continue;

    const rawRecipients =
      o.emails ??
      o.recipients ??
      o.to ??
      o.sentTo ??
      o.sent_to ??
      o.recipientEmails;

    const recipients = collectRecipientStrings(rawRecipients);

    const errRaw = o.error ?? o.err;
    const error =
      typeof errRaw === "string" && errRaw.trim() !== "" ? errRaw : undefined;

    out.push({
      userId,
      emails: recipients,
      error,
    });
  }

  return out;
}

export type CustomerEmailRow = {
  id: string;
  email?: string | null;
};

/** Normalized email → Fortnox customer row ids (several rows can share an email). */
export function customerIdsByNormalizedEmail(
  customers: CustomerEmailRow[],
): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const c of customers) {
    if (!c.email) continue;
    const keys = normalizedEmailsFromAddressField(c.email);
    for (const key of keys) {
      const list = m.get(key);
      if (list) list.push(c.id);
      else m.set(key, [c.id]);
    }
  }
  return m;
}

export type AssignPair = { userId: string; customerId: string };

/** Pairs to assign: mottagare matchas via faktura-alias och/eller kund-e-post. */
export function pairsToAssignFromSentEmails(
  entries: IntegrationEmailEntry[],
  customersByEmail: Map<string, string[]>,
  validUserIds: Set<string>,
  alreadyLinked: Map<string, Set<string>>,
  aliasToCustomerId: Map<string, string>,
): AssignPair[] {
  const out: AssignPair[] = [];
  const pendingKeys = new Set<string>();

  for (const entry of entries) {
    if (entry.error) continue;
    const uid = String(entry.userId);
    if (!validUserIds.has(uid)) continue;
    const sentList = entry.emails ?? [];
    const linked = alreadyLinked.get(uid) ?? new Set();

    for (const raw of sentList) {
      if (typeof raw !== "string" || !raw.trim()) continue;
      const customerIds = resolveRecipientRawToCustomerIds(
        raw,
        aliasToCustomerId,
        customersByEmail,
      );
      if (customerIds.length === 0) continue;
      for (const customerId of customerIds) {
        if (linked.has(customerId)) continue;
        const dedupe = `${uid}:${customerId}`;
        if (pendingKeys.has(dedupe)) continue;
        pendingKeys.add(dedupe);
        linked.add(customerId);
        out.push({ userId: uid, customerId });
      }
    }
  }

  return out;
}
