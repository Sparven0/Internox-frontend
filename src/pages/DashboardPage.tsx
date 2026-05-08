import { useQuery } from "@apollo/client/react";
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
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  GetInitPageDataDocument,
  GetInitPageIntegrationDataDocument,
} from "../__generated__/graphql";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
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

  const { data: pageData, loading: pageLoading } = useQuery(
    GetInitPageDataDocument,
  );
  const {
    data: integrationData,
    loading: integrationLoading,
    refetch,
  } = useQuery(GetInitPageIntegrationDataDocument);

  const company = pageData?.getInitPageData?.company;
  const users = pageData?.getInitPageData?.users ?? [];
  const customers = integrationData?.getInitPageIntegrationData?.customers;
  const emails = integrationData?.getInitPageIntegrationData?.emails;

  const customerList: Array<{ name?: string; email?: string }> = Array.isArray(
    customers,
  )
    ? customers
    : [];
  const emailList: Array<{
    userId: string | number;
    emails?: string[];
    error?: string;
  }> = Array.isArray(emails) ? emails : [];

  const handleLogout = () => {
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("jwt_token");
    navigate({ to: "/" });
  };

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
            </nav>
          </div>

          <button className="dashboard-logout" onClick={handleLogout}>
            <SignOut20Regular />
            Logga ut
          </button>
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
                <div className="dashboard-table__head">
                  <span>E-post</span>
                  <span>Roll</span>
                </div>
                {users.map((u) => (
                  <div key={u.id} className="dashboard-table__row">
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

            {integrationLoading ? (
              <div className="dashboard-loading">
                <Spinner size="small" className={classes.spinner} />
              </div>
            ) : typeof customers === "string" ? (
              <div className="dashboard-empty dashboard-empty--warning">
                {customers}
              </div>
            ) : customerList.length === 0 ? (
              <div className="dashboard-empty">
                Inga kunder hittades i Fortnox.
              </div>
            ) : (
              <div className="dashboard-table">
                <div className="dashboard-table__head">
                  <span>Namn</span>
                  <span>E-post</span>
                </div>
                {customerList.map((c, i) => (
                  <div key={i} className="dashboard-table__row">
                    <div className="dashboard-table__cell dashboard-table__cell--user">
                      <div className="dashboard-avatar dashboard-avatar--green">
                        <Building20Regular />
                      </div>
                      <span>{c.name ?? "—"}</span>
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
