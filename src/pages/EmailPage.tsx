import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  FluentProvider,
  Input,
  Spinner,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Building20Regular,
  ChevronDown20Regular,
  ChevronUp20Regular,
  History20Regular,
  LinkAdd20Regular,
  Mail20Regular,
  Receipt20Regular,
  Search20Regular,
  SignOut20Regular,
  DocumentTable20Regular,
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  GetEmailsByUserDocument,
  LogoutDocument,
  MeDocument,
} from "../__generated__/graphql";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import "../DashboardPage.css";
import "../EmailPage.css";

const EMAIL_PAGE_SIZE = 25;

const useStyles = makeStyles({
  spinner: { color: tokens.colorBrandForeground1 },
});

function fmtDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseAddresses(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.join(", ") || "—";
      return String(parsed);
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return (value as string[]).join(", ") || "—";
  return String(value);
}

type DirectionFilter = "all" | "inbound" | "outbound";

export default function EmailPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [directionFilter, setDirectionFilter] =
    useState<DirectionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [logout] = useMutation(LogoutDocument, {
    onCompleted: () => {
      setAuthToken(null);
      setToken(null);
      navigate({ to: "/" });
    },
  });

  const { data: meData } = useQuery(MeDocument);
  const userId = meData?.me?.id;

  const { data, loading, error } = useQuery(GetEmailsByUserDocument, {
    variables: { userId: userId! },
    skip: !userId,
  });

  const filtered = useMemo(() => {
    const emailList = data?.getEmailsByUser ?? [];
    const q = searchQuery.trim().toLowerCase();
    return emailList.filter((e) => {
      if (directionFilter !== "all" && e.direction !== directionFilter)
        return false;
      if (q) {
        const subject = (e.subject ?? "").toLowerCase();
        const from = `${e.fromAddress} ${e.fromName ?? ""}`.toLowerCase();
        if (!subject.includes(q) && !from.includes(q)) return false;
      }
      return true;
    });
  }, [data, directionFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / EMAIL_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageEmails = filtered.slice(
    (safePage - 1) * EMAIL_PAGE_SIZE,
    safePage * EMAIL_PAGE_SIZE,
  );

  function handleDirectionFilter(dir: DirectionFilter) {
    setDirectionFilter(dir);
    setCurrentPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

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

            <nav className="dashboard-nav">
              <Link to="/dashboard" className="dashboard-nav__item">
                <Building20Regular /> Översikt
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
              <Link
                to="/emails"
                className="dashboard-nav__item dashboard-nav__item--active"
              >
                <Mail20Regular /> E-post
              </Link>
            </nav>
          </div>

          <div className="dashboard-sidebar__bottom">
            <button className="dashboard-logout" onClick={() => logout()}>
              <SignOut20Regular />
              Logga ut
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1 className="dashboard-title">E-post</h1>
          </header>

          {/* ── Filters ── */}
          <div className="eml-filters">
            <div className="eml-direction-tabs">
              {(["all", "inbound", "outbound"] as DirectionFilter[]).map(
                (dir) => (
                  <button
                    key={dir}
                    type="button"
                    className={`eml-tab${directionFilter === dir ? " eml-tab--active" : ""}`}
                    onClick={() => handleDirectionFilter(dir)}
                  >
                    {dir === "all"
                      ? "Alla"
                      : dir === "inbound"
                        ? "Inkommande"
                        : "Utgående"}
                  </button>
                ),
              )}
            </div>
            <div className="eml-search">
              <Input
                contentBefore={<Search20Regular />}
                placeholder="Sök ämne eller avsändare…"
                value={searchQuery}
                onChange={handleSearch}
                style={{ width: "280px" }}
              />
            </div>
          </div>

          {/* ── Content ── */}
          {loading && !data ? (
            <div className="dashboard-spinner-wrap">
              <Spinner className={styles.spinner} label="Laddar e-post…" />
            </div>
          ) : error ? (
            <div className="eml-error">
              Kunde inte ladda e-post: {error.message}
            </div>
          ) : (
            <>
              <div className="eml-count">
                {filtered.length} e-post
                {searchQuery || directionFilter !== "all" ? " (filtrerat)" : ""}
              </div>

              <div className="eml-list">
                {pageEmails.length === 0 ? (
                  <div className="eml-empty">
                    Inga e-postmeddelanden hittades.
                  </div>
                ) : (
                  pageEmails.map((email) => {
                    const isExpanded = expandedId === email.id;
                    const date = fmtDate(email.sentAt ?? email.createdAt);

                    return (
                      <div
                        key={email.id}
                        className={`eml-row${isExpanded ? " eml-row--expanded" : ""}`}
                      >
                        <button
                          type="button"
                          className="eml-row__header"
                          onClick={() => toggleExpand(email.id)}
                        >
                          <span
                            className={`eml-badge eml-badge--${email.direction}`}
                          >
                            {email.direction === "inbound" ? "In" : "Ut"}
                          </span>
                          <span className="eml-row__subject">
                            {email.subject ?? "(inget ämne)"}
                          </span>
                          <span className="eml-row__from">
                            {email.fromName
                              ? `${email.fromName} <${email.fromAddress}>`
                              : email.fromAddress}
                          </span>
                          <span className="eml-row__date">{date}</span>
                          <span className="eml-row__expand-icon">
                            {isExpanded ? (
                              <ChevronUp20Regular />
                            ) : (
                              <ChevronDown20Regular />
                            )}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="eml-row__detail">
                            <div className="eml-meta">
                              <div className="eml-meta__row">
                                <span className="eml-meta__label">Från</span>
                                <span className="eml-meta__value">
                                  {email.fromName
                                    ? `${email.fromName} <${email.fromAddress}>`
                                    : email.fromAddress}
                                </span>
                              </div>
                              <div className="eml-meta__row">
                                <span className="eml-meta__label">Till</span>
                                <span className="eml-meta__value">
                                  {parseAddresses(email.toAddresses)}
                                </span>
                              </div>
                              {parseAddresses(email.ccAddresses) !== "—" && (
                                <div className="eml-meta__row">
                                  <span className="eml-meta__label">CC</span>
                                  <span className="eml-meta__value">
                                    {parseAddresses(email.ccAddresses)}
                                  </span>
                                </div>
                              )}
                              <div className="eml-meta__row">
                                <span className="eml-meta__label">Datum</span>
                                <span className="eml-meta__value">{date}</span>
                              </div>
                              {email.mailbox && (
                                <div className="eml-meta__row">
                                  <span className="eml-meta__label">
                                    Brevlåda
                                  </span>
                                  <span className="eml-meta__value">
                                    {email.mailbox}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="eml-body">
                              {email.bodyHtml ? (
                                <iframe
                                  className="eml-body__iframe"
                                  srcDoc={email.bodyHtml}
                                  sandbox=""
                                  title={`E-post: ${email.subject ?? email.id}`}
                                />
                              ) : email.bodyText ? (
                                <pre className="eml-body__text">
                                  {email.bodyText}
                                </pre>
                              ) : (
                                <p className="eml-body__empty">
                                  Inget innehåll.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="eml-pagination">
                  <button
                    type="button"
                    className="eml-pagination__btn"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Föregående
                  </button>
                  <span className="eml-pagination__info">
                    Sida {safePage} av {totalPages}
                  </span>
                  <button
                    type="button"
                    className="eml-pagination__btn"
                    disabled={safePage >= totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Nästa
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </FluentProvider>
  );
}
