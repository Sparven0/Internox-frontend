import {
  normalizedEmailsFromAddressField,
  parseIntegrationEmailPayload,
  type IntegrationEmailEntry,
} from "./matchSentEmailsToCustomers";

export type DashboardEventRow = {
  id: string;
  source: "email" | "fortnox";
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

function formatCustomerLine(c: CustomerRow): string {
  const nr = c.fortnoxCustomerNumber ? ` · #${c.fortnoxCustomerNumber}` : "";
  return `${c.name ?? "—"}${nr}`;
}

function customersMatchingEmail(
  norm: string,
  customerList: CustomerRow[],
): CustomerRow[] {
  return customerList.filter((c) => {
    if (!c.email) return false;
    return normalizedEmailsFromAddressField(c.email).includes(norm);
  });
}

export function buildEmailEvents(
  parsed: IntegrationEmailEntry[],
  customerList: CustomerRow[],
  users: UserRow[],
  customerToUserIds: Map<string, string[]>,
): DashboardEventRow[] {
  const rows: DashboardEventRow[] = [];
  let seq = 0;
  for (const entry of parsed) {
    const emp =
      users.find((u) => String(u.id) === String(entry.userId)) ?? null;
    const actor = emp?.email ?? `Användare ${entry.userId}`;

    if (entry.error) {
      rows.push({
        id: `email-err-${seq++}`,
        source: "email",
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
      const normList = normalizedEmailsFromAddressField(recipient);
      if (normList.length === 0) {
        rows.push({
          id: `email-${seq++}`,
          source: "email",
          summary: "Skickat mejl (mottagare kunde inte tolkas)",
          detail: recipient,
          customerLabel: "—",
          linkedEmployeesLabel: "—",
          actorLabel: actor,
        });
        continue;
      }

      for (const norm of normList) {
        const matches = customersMatchingEmail(norm, customerList);
        if (matches.length === 0) {
          rows.push({
            id: `email-${seq++}-${norm}`,
            source: "email",
            summary: `Skickat mejl till ${norm}`,
            detail:
              "Ingen kund med denna e-post i Fortnox-listan.",
            customerLabel: "Ingen matchande kund",
            linkedEmployeesLabel: "—",
            actorLabel: actor,
          });
        } else {
          for (const c of matches) {
            rows.push({
              id: `email-${seq++}-${c.id}-${norm}`,
              source: "email",
              summary: `Skickat mejl till ${c.email ?? norm}`,
              detail: `Mottagare matchar kund ${c.name ?? c.id}.`,
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

  const pushRow = (
    title: string,
    detail: string | undefined,
    customerId?: string,
  ) => {
    const c =
      customerId != null ? customerById(customerId, customerList) : undefined;
    const custLabel =
      c != null
        ? formatCustomerLine(c)
        : customerId != null
          ? `ID ${customerId} (ej i lokal lista)`
          : "—";
    const cid = c?.id ?? customerId;
    rows.push({
      id: `fn-${seq++}`,
      source: "fortnox",
      summary: title,
      detail,
      customerLabel: custLabel,
      linkedEmployeesLabel: formatLinkedEmployees(cid, users, customerToUserIds),
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
      const rawCid = o.customerId ?? o.customer_id;
      const customerId =
        typeof rawCid === "string" || typeof rawCid === "number"
          ? String(rawCid)
          : undefined;
      pushRow(title, detail, customerId);
    }
    if (rows.length === 0 && raw.length > 0) {
      pushRow(
        `Fortnox-data (${raw.length} poster)`,
        "Strukturen kändes inte igen. Öppna nätverksfliken och inspektera JSON om du felsöker.",
        undefined,
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
      pushRow(
        o.message,
        typeof o.summary === "string" ? o.summary : undefined,
        undefined,
      );
      return rows;
    }
    const keys = Object.keys(o);
    if (keys.length > 0) {
      pushRow(
        "Fortnox-integration uppdaterad",
        `Fält: ${keys.slice(0, 8).join(", ")}${keys.length > 8 ? "…" : ""}`,
        undefined,
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
}): DashboardEventRow[] {
  const parsed = parseIntegrationEmailPayload(args.emailsRaw, args.users);
  const customerToUserIds = invertUserToCustomers(
    args.users,
    args.userToCustomerIds,
  );
  const emailRows = buildEmailEvents(
    parsed,
    args.customerList,
    args.users,
    customerToUserIds,
  );
  const fnRows = buildFortnoxEvents(
    args.customersIntegrationRaw,
    args.customerList,
    args.users,
    customerToUserIds,
  );
  return [...fnRows, ...emailRows];
}
