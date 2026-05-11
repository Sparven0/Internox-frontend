import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
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
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  GetInitPageDataDocument,
  GetInitPageIntegrationDataDocument,
  GetAllCustomersDocument,
  GetOnboardingStatusDocument,
  LogoutDocument,
} from "../__generated__/graphql";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import { fortnoxAuthUrl } from "../backendOrigin";
import EmployeeCustomerPanel from "../components/EmployeeCustomerPanel";
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
  const [logout] = useMutation(LogoutDocument);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(
    null,
  );

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

  const company = pageData?.getInitPageData?.company;
  const users = pageData?.getInitPageData?.users ?? [];
  const emails = integrationData?.getInitPageIntegrationData?.emails;

  const customerList = customersData?.getAllCustomers ?? [];
  const emailList: Array<{
    userId: string | number;
    emails?: string[];
    error?: string;
  }> = Array.isArray(emails) ? emails : [];

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    setToken(null);
    setAuthToken(null);
    navigate({ to: "/" });
  };

  const handleOpenFortnoxConnect = () => {
    window.open(fortnoxAuthUrl(), "_blank", "noopener,noreferrer");
  };

  const showFortnoxConnect =
    onboardingData?.getOnboardingStatus?.hasFortnox === false;
  const hasFortnox = onboardingData?.getOnboardingStatus?.hasFortnox;

  useEffect(() => {
    console.log("hasFortnox", hasFortnox);
  }, [hasFortnox]);

  return (
    <FluentProvider theme={internoxTheme}>
      <div className="dashboard">
        {/* ── Sidebar ── */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__top">
            <div className="dashboard-logo">
              <span className="dashboard-logo-dot" />
              internox
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
              <a href="#customers" className="dashboard-nav__item">
                <Building20Regular /> Kunder
              </a>
              <a href="#emails" className="dashboard-nav__item">
                <Mail20Regular /> E-post
              </a>
              <Link to="/bookkeeping" className="dashboard-nav__item">
                <DocumentTable20Regular /> Bokföring
              </Link>
              <Link to="/invoices" className="dashboard-nav__item">
                <Receipt20Regular /> Fakturor
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
      </div>
    </FluentProvider>
  );
}
