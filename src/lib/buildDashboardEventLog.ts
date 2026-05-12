import {
  customerIdsByNormalizedEmail,
  parseIntegrationEmailPayload,
  type IntegrationEmailEntry,
} from "./matchSentEmailsToCustomers";
import {
  buildAliasCustomerIdMap,
  recipientTokens,
  resolveRecipientTokensToCustomerIds,
  stripTrailingEmptyAngleBrackets,
  type AliasCustomerRow,
} from "./resolveRecipientToCustomers";

export type DashboardEventRow = {
  id: string;
  source: "email" | "fortnox";
  /** Kort klassning, t.ex. Utgående e-post eller Fortnox eventType */
  eventTypeLabel: string;
  summary: string;
  detail?: string;
  customerLabel: string;
  /** Anställda som är kopplade till kunden i Internox. */
  linkedEmployeesLabel: string;
  /** Vem som utförde händelsen (t.ex. avsändare vid e-post). */
  actorLabel?: string;
};

type UserRow = { id: string; email: string };

type CustomerRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  fortnoxCustomerNumber?: string | null;
};

function invertUserToCustomers(
  users: { id: string }[],
  userToCustomerIds: Map<string, string[]>,
): Map<string, string[]> {
  const customerToUsers = new Map<string, string[]>();
  for (const u of users) {
    for (const cid of userToCustomerIds.get(u.id) ?? []) {
      const arr = customerToUsers.get(cid) ?? [];
      if (!arr.includes(u.id)) arr.push(u.id);
      customerToUsers.set(cid, arr);
    }
  }
  return customerToUsers;
}

export function formatLinkedEmployees(
  customerId: string | undefined,
  users: UserRow[],
  customerToUserIds: Map<string, string[]>,
): string {
  if (!customerId) return "—";
  const uids = customerToUserIds.get(customerId) ?? [];
  if (uids.length === 0) return "Ingen kopplad anställd";
  return uids
    .map((id) => users.find((u) => u.id === id)?.email ?? id)
    .join(", ");
}

function customerById(
  id: string,
  list: CustomerRow[],
): CustomerRow | undefined {
  return list.find((c) => c.id === id);
}

function normalizeFortnoxCustomerNumberKey(
  raw: string | number | undefined | null,
): string {
  if (raw === undefined || raw === null) return "";
  return String(raw).trim();
}

function customerByFortnoxNumber(
  num: string | number | undefined | null,
  list: CustomerRow[],
): CustomerRow | undefined {
  const key = normalizeFortnoxCustomerNumberKey(num);
  if (!key) return undefined;
  return list.find((c) => {
    const n = c.fortnoxCustomerNumber;
    return n != null && normalizeFortnoxCustomerNumberKey(n) === key;
  });
}

type FortnoxCustomerResolution = {
  customer?: CustomerRow;
  /** Kundnummer fanns i payload men ingen rad i listan hade samma #nr */
  unmatchedFortnoxNumber?: string;
  /** Namn direkt från Fortnox-payloaden (fallback när ingen intern match) */
  fortnoxName?: string;
};

/**
 * Mappar Fortnox-händelse-json till lokal kundrad via intern id eller kundnummer (#nr).
 */
function resolveFortnoxEventCustomer(
  o: Record<string, unknown>,
  list: CustomerRow[],
  nestedDepth = 0,
): FortnoxCustomerResolution {
  if (nestedDepth > 3) return {};

  const tryInternalThenNr = (val: string): CustomerRow | undefined => {
    if (!val) return undefined;
    const byId = customerById(val, list);
    if (byId) return byId;
    return customerByFortnoxNumber(val, list);
  };

  for (const key of ["customerId", "customer_id"] as const) {
    const v = o[key];
    if (typeof v !== "string" && typeof v !== "number") continue;
    const s = String(v).trim();
    if (!s) continue;
    const hit = tryInternalThenNr(s);
    if (hit) return { customer: hit };
  }

  const nrFieldKeys = [
    "customerNumber",
    "customer_number",
    "CustomerNumber",
    "fortnoxCustomerNumber",
    "kundnummer",
    "customerNo",
    "customer_no",
    "CustomerNr",
  ];

  let unmatchedNr: string | undefined;

  for (const key of nrFieldKeys) {
    const v = o[key];
    if (typeof v !== "string" && typeof v !== "number") continue;
    const raw = normalizeFortnoxCustomerNumberKey(v);
    if (!raw) continue;
    unmatchedNr = unmatchedNr ?? raw;
    const hit = customerByFortnoxNumber(raw, list);
    if (hit) return { customer: hit };
  }

  const cust = o.customer;
  if (cust && typeof cust === "object") {
    const nested = resolveFortnoxEventCustomer(
      cust as Record<string, unknown>,
      list,
      nestedDepth + 1,
    );
    if (nested.customer) return nested;
    if (nested.unmatchedFortnoxNumber)
      return {
        unmatchedFortnoxNumber: nested.unmatchedFortnoxNumber,
        fortnoxName: nested.fortnoxName,
      };
  }

  // Extract the name directly from the Fortnox payload as a fallback.
  const extractedName = (() => {
    for (const key of ["Name", "name", "CustomerName", "customer_name", "customerName"]) {
      const v = o[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return undefined;
  })();

  if (unmatchedNr) return { unmatchedFortnoxNumber: unmatchedNr, fortnoxName: extractedName };

  return extractedName ? { fortnoxName: extractedName } : {};
}

const EMAIL_EVENT_TYPE_OUTBOUND = "Utgående e-post";
const EMAIL_EVENT_TYPE_FETCH_ERROR = "E-postfel";

function fortnoxEventTypeLabel(o: Record<string, unknown> | undefined): string {
  if (!o) return "Fortnox-händelse";
  const candidates = [
    o.eventType,
    o.event_type,
    o.category,
    o.kind,
    o.resourceType,
    o.resource_type,
    o.entityType,
    o.entity_type,
    o.changeType,
    o.change_type,
    o.operation,
    o.action,
    o.type,
  ];
  for (const v of candidates) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "Fortnox-händelse";
}

function formatCustomerLine(c: CustomerRow): string {
  const nr = c.fortnoxCustomerNumber ? ` · #${c.fortnoxCustomerNumber}` : "";
  return `${c.name ?? "—"}${nr}`;
}

export function buildEmailEvents(
  parsed: IntegrationEmailEntry[],
  customerList: CustomerRow[],
  users: UserRow[],
  customerToUserIds: Map<string, string[]>,
  invoiceRecipientAliases: AliasCustomerRow[],
): DashboardEventRow[] {
  const rows: DashboardEventRow[] = [];
  let seq = 0;
  const aliasMap = buildAliasCustomerIdMap(invoiceRecipientAliases);
  const customersByEmail = customerIdsByNormalizedEmail(customerList);

  for (const entry of parsed) {
    const emp =
      users.find((u) => String(u.id) === String(entry.userId)) ?? null;
    const actor = emp?.email ?? `Användare ${entry.userId}`;

    if (entry.error) {
      rows.push({
        id: `email-err-${seq++}`,
        source: "email",
        eventTypeLabel: EMAIL_EVENT_TYPE_FETCH_ERROR,
        summary: "E-post kunde inte hämtas",
        detail: entry.error,
        customerLabel: "—",
        linkedEmployeesLabel: "—",
        actorLabel: actor,
      });
      continue;
    }

    for (const recipient of entry.emails ?? []) {
      if (typeof recipient !== "string" || !recipient.trim()) continue;

      const displayRecipient =
        stripTrailingEmptyAngleBrackets(recipient.trim()) ||
        recipient.trim();

      const tokens = recipientTokens(recipient);
      if (tokens.length === 0) {
        rows.push({
          id: `email-${seq++}`,
          source: "email",
          eventTypeLabel: EMAIL_EVENT_TYPE_OUTBOUND,
          summary: "Skickat mejl (mottagare kunde inte tolkas)",
          detail: displayRecipient,
          customerLabel: "—",
          linkedEmployeesLabel: "—",
          actorLabel: actor,
        });
        continue;
      }

      const ids = resolveRecipientTokensToCustomerIds(
        tokens,
        aliasMap,
        customersByEmail,
      );

      if (ids.length === 0) {
        rows.push({
          id: `email-${seq++}`,
          source: "email",
          eventTypeLabel: EMAIL_EVENT_TYPE_OUTBOUND,
          summary: `Skickat mejl till ${displayRecipient}`,
          detail:
            "Ingen träff via faktura-alias eller kundens e-post i Fortnox-listan.",
          customerLabel: "Ingen matchande kund",
          linkedEmployeesLabel: "—",
          actorLabel: actor,
        });
        continue;
      }

      for (const cid of ids) {
        const c = customerById(cid, customerList);
        if (!c) {
          rows.push({
            id: `email-${seq++}-${cid}`,
            source: "email",
            eventTypeLabel: EMAIL_EVENT_TYPE_OUTBOUND,
            summary: `Skickat mejl till ${displayRecipient}`,
            detail:
              "Träff via alias men kunden saknas i den lokala kundlistan (synka eller kontrollera id).",
            customerLabel: `ID ${cid}`,
            linkedEmployeesLabel: formatLinkedEmployees(
              cid,
              users,
              customerToUserIds,
            ),
            actorLabel: actor,
          });
          continue;
        }

        rows.push({
          id: `email-${seq++}-${c.id}`,
          source: "email",
          eventTypeLabel: EMAIL_EVENT_TYPE_OUTBOUND,
          summary: `Skickat mejl till ${displayRecipient}`,
          detail: `Matchad kund: ${c.name ?? c.id}.`,
          customerLabel: formatCustomerLine(c),
          linkedEmployeesLabel: formatLinkedEmployees(
            c.id,
            users,
            customerToUserIds,
          ),
          actorLabel: actor,
        });
      }
    }
  }
  return rows;
}

function buildFortnoxEvents(
  raw: unknown,
  customerList: CustomerRow[],
  users: UserRow[],
  customerToUserIds: Map<string, string[]>,
): DashboardEventRow[] {
  const rows: DashboardEventRow[] = [];
  let seq = 0;

  const pushResolvedRow = (
    title: string,
    detail: string | undefined,
    resolution: FortnoxCustomerResolution,
    eventTypeLabel: string,
  ) => {
    const { customer, unmatchedFortnoxNumber, fortnoxName } = resolution;
    let custLabel: string;
    let cid: string | undefined;
    if (customer) {
      custLabel = formatCustomerLine(customer);
      cid = customer.id;
    } else if (fortnoxName && unmatchedFortnoxNumber) {
      custLabel = `${fortnoxName} (#${unmatchedFortnoxNumber})`;
      cid = undefined;
    } else if (fortnoxName) {
      custLabel = fortnoxName;
      cid = undefined;
    } else if (unmatchedFortnoxNumber) {
      custLabel = `#${unmatchedFortnoxNumber} (ej i kundlistan)`;
      cid = undefined;
    } else {
      custLabel = "—";
      cid = undefined;
    }
    rows.push({
      id: `fn-${seq++}`,
      source: "fortnox",
      eventTypeLabel,
      summary: title,
      detail,
      customerLabel: custLabel,
      linkedEmployeesLabel: formatLinkedEmployees(
        cid,
        users,
        customerToUserIds,
      ),
    });
  };

  if (raw == null) return rows;

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (item == null || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const title =
        (typeof o.message === "string" && o.message) ||
        (typeof o.description === "string" && o.description) ||
        (typeof o.action === "string" && o.action) ||
        (typeof o.type === "string" && o.type) ||
        "Fortnox-händelse";
      const detail =
        typeof o.detail === "string"
          ? o.detail
          : typeof o.text === "string"
            ? o.text
            : undefined;
      const resolution = resolveFortnoxEventCustomer(o, customerList);
      pushResolvedRow(title, detail, resolution, fortnoxEventTypeLabel(o));
    }
    if (rows.length === 0 && raw.length > 0) {
      pushResolvedRow(
        `Fortnox-data (${raw.length} poster)`,
        "Strukturen kändes inte igen. Öppna nätverksfliken och inspektera JSON om du felsöker.",
        {},
        "Fortnox — okänd struktur",
      );
    }
    return rows;
  }

  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.events)) {
      return buildFortnoxEvents(
        o.events,
        customerList,
        users,
        customerToUserIds,
      );
    }
    if (typeof o.message === "string") {
      pushResolvedRow(
        o.message,
        typeof o.summary === "string" ? o.summary : undefined,
        resolveFortnoxEventCustomer(o, customerList),
        fortnoxEventTypeLabel(o),
      );
      return rows;
    }
    const keys = Object.keys(o);
    if (keys.length > 0) {
      pushResolvedRow(
        "Fortnox-integration uppdaterad",
        `Fält: ${keys.slice(0, 8).join(", ")}${keys.length > 8 ? "…" : ""}`,
        resolveFortnoxEventCustomer(o, customerList),
        fortnoxEventTypeLabel(o),
      );
    }
  }

  return rows;
}

export function buildDashboardEventRows(args: {
  emailsRaw: unknown;
  customersIntegrationRaw: unknown;
  customerList: CustomerRow[];
  users: UserRow[];
  userToCustomerIds: Map<string, string[]>;
  invoiceRecipientAliases?: AliasCustomerRow[];
}): DashboardEventRow[] {
  const parsed = parseIntegrationEmailPayload(args.emailsRaw, args.users);
  const customerToUserIds = invertUserToCustomers(
    args.users,
    args.userToCustomerIds,
  );
  const aliases = args.invoiceRecipientAliases ?? [];
  const emailRows = buildEmailEvents(
    parsed,
    args.customerList,
    args.users,
    customerToUserIds,
    aliases,
  );
  const fnRows = buildFortnoxEvents(
    args.customersIntegrationRaw,
    args.customerList,
    args.users,
    customerToUserIds,
  );
  return [...fnRows, ...emailRows];
}
