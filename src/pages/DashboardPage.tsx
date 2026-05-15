import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  FluentProvider,
  makeStyles,
  tokens,
  Spinner,
} from "@fluentui/react-components";
import {
  PeopleCommunity20Regular,
  Building20Regular,
  Mail20Regular,
  Person20Regular,
  SignOut20Regular,
  ArrowClockwise20Regular,
  DocumentTable20Regular,
  PlugConnected20Regular,
  Receipt20Regular,
  LinkAdd20Regular,
  History20Regular,
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  GetInitPageDataDocument,
  GetInitPageIntegrationDataDocument,
  GetAllCustomersDocument,
  GetOnboardingStatusDocument,
  LogoutDocument,
  AssignCustomerToEmployeeDocument,
  GetCustomersByEmployeeDocument,
  GetInvoiceRecipientAliasesDocument,
  GetFortnoxAuthUrlDocument,
} from "../__generated__/graphql";
import {
  customerIdsByNormalizedEmail,
  pairsToAssignFromSentEmails,
  parseIntegrationEmailPayload,
} from "../lib/matchSentEmailsToCustomers";
import { buildAliasCustomerIdMap } from "../lib/resolveRecipientToCustomers";
import { buildDashboardEventRows, type DashboardEventRow } from "../lib/buildDashboardEventLog";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import EmployeeCustomerPanel from "../components/EmployeeCustomerPanel";
import DashboardEventLog from "../components/DashboardEventLog";
import "../DashboardPage.css";

const useStyles = makeStyles({
  spinner: {
    color: tokens.colorBrandForeground1,
  },
});

export default function DashboardPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const client = useApolloClient();
  const [logout] = useMutation(LogoutDocument);
  const [assignCustomerToEmployee] = useMutation(
    AssignCustomerToEmployeeDocument,
  );
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(
    null,
  );
  const [eventRows, setEventRows] = useState<DashboardEventRow[]>([]);
  const [eventLogLoading, setEventLogLoading] = useState(false);

  const { data: pageData, loading: pageLoading } = useQuery(
    GetInitPageDataDocument,
  );
  const {
    data: integrationData,
    loading: integrationLoading,
    refetch,
  } = useQuery(GetInitPageIntegrationDataDocument);
  const { data: customersData, loading: customersLoading } = useQuery(
    GetAllCustomersDocument,
  );
  const { data: onboardingData } = useQuery(GetOnboardingStatusDocument);
  const { data: fortnoxAuthData } = useQuery(GetFortnoxAuthUrlDocument);

  const company = pageData?.getInitPageData?.company;
  const users = useMemo(
    () => pageData?.getInitPageData?.users ?? [],
    [pageData],
  );
  const emails = integrationData?.getInitPageIntegrationData?.emails;

  const customerList = useMemo(
    () => customersData?.getAllCustomers ?? [],
    [customersData],
  );
  const emailList: Array<{
    userId: string | number;
    emails?: string[];
    error?: string;
  }> = Array.isArray(emails) ? emails : [];

  const { integrationEmailsKey, parsedIntegrationEmails } = useMemo(() => {
    const parsed = parseIntegrationEmailPayload(emails, users);
    return {
      parsedIntegrationEmails: parsed,
      integrationEmailsKey: JSON.stringify(
        parsed.map((e) => ({
          userId: e.userId,
          error: e.error ?? null,
          emails: [...(e.emails ?? [])].sort(),
        })),
      ),
    };
  }, [emails, users]);

  const customersKey = useMemo(
    () =>
      [...customerList]
        .map((c) => `${c.id}\0${c.email ?? ""}`)
        .sort()
        .join("|"),
    [customerList],
  );

  const validUserIds = useMemo(
    () => new Set(users.map((u) => u.id)),
    [users],
  );

  const rebuildEventLog = useCallback(async () => {
    setEventLogLoading(true);
    try {
      const [intRes, initRes, custRes, aliasRes] = await Promise.all([
        client.query({
          query: GetInitPageIntegrationDataDocument,
          fetchPolicy: "network-only",
        }),
        client.query({
          query: GetInitPageDataDocument,
          fetchPolicy: "network-only",
        }),
        client.query({
          query: GetAllCustomersDocument,
          fetchPolicy: "network-only",
        }),
        client.query({
          query: GetInvoiceRecipientAliasesDocument,
          fetchPolicy: "network-only",
        }),
      ]);
      const usersList = initRes.data?.getInitPageData?.users ?? [];
      if (usersList.length === 0) {
        setEventRows([]);
        return;
      }
      const userToCustomerIds = new Map<string, string[]>();
      await Promise.all(
        usersList.map(async (u) => {
          const { data } = await client.query({
            query: GetCustomersByEmployeeDocument,
            variables: { userId: u.id },
            fetchPolicy: "network-only",
          });
          userToCustomerIds.set(
            u.id,
            data?.getCustomersByEmployee?.map((c) => c.id) ?? [],
          );
        }),
      );
      const emailsRaw = intRes.data?.getInitPageIntegrationData?.emails;
      const customersRaw =
        intRes.data?.getInitPageIntegrationData?.customers;
      const custList = custRes.data?.getAllCustomers ?? [];
      const invoiceRecipientAliases =
        aliasRes.data?.invoiceRecipientAliases?.map((r) => ({
          alias: r.alias,
          customerId: r.customerId,
        })) ?? [];
      setEventRows(
        buildDashboardEventRows({
          emailsRaw,
          customersIntegrationRaw: customersRaw,
          customerList: custList,
          users: usersList,
          userToCustomerIds,
          invoiceRecipientAliases,
        }),
      );
    } finally {
      setEventLogLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (pageLoading) return;
    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      await rebuildEventLog();
    })();
    return () => {
      cancelled = true;
    };
  }, [pageLoading, rebuildEventLog]);

  useEffect(() => {
    if (integrationLoading || customersLoading) return;
    if (!integrationEmailsKey || customerList.length === 0) return;
    if (parsedIntegrationEmails.length === 0) return;
    if (validUserIds.size === 0) return;

    let cancelled = false;

    void (async () => {
      const userIdsInPayload = [
        ...new Set(
          parsedIntegrationEmails
            .map((e) => String(e.userId))
            .filter((id) => validUserIds.has(id)),
        ),
      ];

      const linked = new Map<string, Set<string>>();
      let aliasMap = new Map<string, string>();
      try {
        const { data: aliasData } = await client.query({
          query: GetInvoiceRecipientAliasesDocument,
          fetchPolicy: "network-only",
        });
        if (cancelled) return;
        aliasMap = buildAliasCustomerIdMap(
          aliasData?.invoiceRecipientAliases?.map((r) => ({
            alias: r.alias,
            customerId: r.customerId,
          })) ?? [],
        );

        await Promise.all(
          userIdsInPayload.map(async (userId) => {
            const { data } = await client.query({
              query: GetCustomersByEmployeeDocument,
              variables: { userId },
              fetchPolicy: "network-only",
            });
            if (cancelled) return;
            linked.set(
              userId,
              new Set(data?.getCustomersByEmployee?.map((c) => c.id) ?? []),
            );
          }),
        );
      } catch {
        return;
      }

      if (cancelled) return;

      const customersByEmail = customerIdsByNormalizedEmail(customerList);
      const toAssign = pairsToAssignFromSentEmails(
        parsedIntegrationEmails,
        customersByEmail,
        validUserIds,
        linked,
        aliasMap,
      );

      for (const { userId, customerId } of toAssign) {
        if (cancelled) return;
        try {
          await assignCustomerToEmployee({ variables: { userId, customerId } });
        } catch (e) {
          if (import.meta.env.DEV) {
            console.warn("[auto-link customer]", { userId, customerId, e });
          }
        }
      }

      if (!cancelled && toAssign.length > 0) {
        await client.refetchQueries({
          include: [GetCustomersByEmployeeDocument],
        });
        void rebuildEventLog();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    assignCustomerToEmployee,
    client,
    customerList,
    customersKey,
    integrationEmailsKey,
    integrationLoading,
    customersLoading,
    parsedIntegrationEmails,
    rebuildEventLog,
    validUserIds,
  ]);

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    setToken(null);
    setAuthToken(null);
    navigate({ to: "/" });
  };

  const handleOpenFortnoxConnect = () => {
    const url = fortnoxAuthData?.getFortnoxAuthUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const showFortnoxConnect =
    onboardingData?.getOnboardingStatus?.hasFortnox === false;

  return (
    <FluentProvider theme={internoxTheme}>
      <div className="dashboard">
        {/* ── Sidebar ── */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__top">
            <div className="dashboard-logo">
              <img src="/logo.svg" alt="internox" />
            </div>

            {company && (
              <div className="dashboard-company">
                <Building20Regular className="dashboard-company__icon" />
                <span className="dashboard-company__name">{company.name}</span>
              </div>
            )}

            <nav className="dashboard-nav">
              <a
                href="#users"
                className="dashboard-nav__item dashboard-nav__item--active"
              >
                <PeopleCommunity20Regular /> Anställda
              </a>
              <Link to="/emails" className="dashboard-nav__item">
                <Mail20Regular /> E-post
              </Link>
              <Link to="/activity" className="dashboard-nav__item">
                <History20Regular /> Tidslinje
              </Link>
              <Link to="/bookkeeping" className="dashboard-nav__item">
                <DocumentTable20Regular /> Bokföring
              </Link>
              <Link to="/invoices" className="dashboard-nav__item">
                <Receipt20Regular /> Fakturor
              </Link>
              <Link to="/aliases" className="dashboard-nav__item">
                <LinkAdd20Regular /> Faktura-alias
              </Link>
            </nav>
          </div>

          <div className="dashboard-sidebar__bottom">
            {showFortnoxConnect && (
              <button
                type="button"
                className="dashboard-fortnox"
                onClick={handleOpenFortnoxConnect}
              >
                <PlugConnected20Regular />
                Koppla Fortnox
              </button>
            )}
            <button className="dashboard-logout" onClick={handleLogout}>
              <SignOut20Regular />
              Logga ut
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="dashboard-main">
          {/* Header */}
          <div className="dashboard-topbar">
            <div>
              <p className="dashboard-topbar__label">Översikt</p>
              <h1 className="dashboard-topbar__title">
                {company ? company.name : "Dashboard"}
              </h1>
            </div>
            <button
              className="dashboard-refresh"
              onClick={() => refetch()}
              title="Uppdatera"
            >
              <ArrowClockwise20Regular />
            </button>
          </div>

          {/* Stats row */}
          <div className="dashboard-stats">
            <div className="dashboard-stat">
              <span className="dashboard-stat__value">{users.length}</span>
              <span className="dashboard-stat__label">Anställda</span>
            </div>
            <div className="dashboard-stat">
              <span className="dashboard-stat__value">
                {customerList.length > 0 ? customerList.length : "—"}
              </span>
              <span className="dashboard-stat__label">Fortnox-kunder</span>
            </div>
            <div className="dashboard-stat">
              <span className="dashboard-stat__value">
                {emailList.length > 0 ? emailList.length : "—"}
              </span>
              <span className="dashboard-stat__label">E-postkopplingar</span>
            </div>
          </div>

          {/* ── Users section ── */}
          <section className="dashboard-section" id="users">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">
                <PeopleCommunity20Regular />
                Anställda
              </h2>
            </div>

            {pageLoading ? (
              <div className="dashboard-loading">
                <Spinner size="small" className={classes.spinner} />
              </div>
            ) : users.length === 0 ? (
              <div className="dashboard-empty">Inga anställda hittades.</div>
            ) : (
              <div className="dashboard-table">
                <div className="ec-table__head">
                  <span>E-post</span>
                  <span>Roll</span>
                  <span>Kunder</span>
                </div>
                {users.map((u) => (
                  <div
                    key={u.id}
                    className={`ec-employee-block${
                      expandedEmployeeId === u.id
                        ? " ec-employee-block--expanded"
                        : ""
                    }`}
                  >
                    <div className="ec-employee-row">
                      <div className="dashboard-table__cell dashboard-table__cell--user">
                        <div className="dashboard-avatar">
                          <Person20Regular />
                        </div>
                        <span>{u.email}</span>
                      </div>
                      <div className="dashboard-table__cell">
                        <span
                          className={`dashboard-badge dashboard-badge--${u.role}`}
                        >
                          {u.role}
                        </span>
                      </div>
                      <div className="dashboard-table__cell">
                        <button
                          className={`ec-customers-btn${
                            expandedEmployeeId === u.id
                              ? " ec-customers-btn--active"
                              : ""
                          }`}
                          onClick={() =>
                            setExpandedEmployeeId(
                              expandedEmployeeId === u.id ? null : u.id,
                            )
                          }
                        >
                          <Building20Regular />
                          Kunder
                        </button>
                      </div>
                    </div>
                    {expandedEmployeeId === u.id && (
                      <EmployeeCustomerPanel userId={u.id} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Customers section ── */}
          <section className="dashboard-section" id="customers">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">
                <Building20Regular />
                Fortnox-kunder
              </h2>
            </div>

            {customersLoading ? (
              <div className="dashboard-loading">
                <Spinner size="small" className={classes.spinner} />
              </div>
            ) : customerList.length === 0 ? (
              <div className="dashboard-empty">
                Inga kunder hittades.
              </div>
            ) : (
              <div className="dashboard-table">
                <div className="dashboard-table__head dashboard-table__head--3col">
                  <span>Namn</span>
                  <span>ID</span>
                  <span>E-post</span>
                </div>
                {customerList.map((c, i) => (
                  <div
                    key={i}
                    className="dashboard-table__row dashboard-table__row--3col"
                  >
                    <div className="dashboard-table__cell dashboard-table__cell--user">
                      <div className="dashboard-avatar dashboard-avatar--green">
                        <Building20Regular />
                      </div>
                      <span>{c.name ?? "—"}</span>
                    </div>
                    <div className="dashboard-table__cell dashboard-table__cell--muted">
                      {c.id ?? "—"}
                    </div>
                    <div className="dashboard-table__cell dashboard-table__cell--muted">
                      {c.email ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Email activity section ── */}
          <section className="dashboard-section" id="emails">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">
                <Mail20Regular />
                E-postaktivitet igår
              </h2>
            </div>

            {integrationLoading ? (
              <div className="dashboard-loading">
                <Spinner size="small" className={classes.spinner} />
              </div>
            ) : typeof emails === "string" ? (
              <div className="dashboard-empty dashboard-empty--warning">
                {emails}
              </div>
            ) : emailList.length === 0 ? (
              <div className="dashboard-empty">
                Ingen e-postaktivitet hittades.
              </div>
            ) : (
              <div className="dashboard-email-list">
                {emailList.map((entry, i) => (
                  <div key={i} className="dashboard-email-entry">
                    <div className="dashboard-email-entry__header">
                      <Person20Regular />
                      <span className="dashboard-email-entry__user">
                        Användare {entry.userId}
                      </span>
                      <span className="dashboard-email-entry__count">
                        {Array.isArray(entry.emails) ? entry.emails.length : 0}{" "}
                        mejl
                      </span>
                    </div>
                    {entry.error && (
                      <p className="dashboard-email-entry__error">
                        {entry.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <DashboardEventLog
          events={eventRows}
          loading={eventLogLoading}
          onRefresh={() => void rebuildEventLog()}
          employees={users.map((u) => ({ id: u.id, email: u.email }))}
        />
      </div>
    </FluentProvider>
  );
}
