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
  Person20Regular,
  Receipt20Regular,
  Search20Regular,
  SignOut20Regular,
  DocumentTable20Regular,
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  GetEmailsByUserDocument,
  GetUsersByCompanyIdDocument,
  LogoutDocument,
  MeDocument,
} from "../__generated__/graphql";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import "../DashboardPage.css";
import "../EmailPage.css";

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

/* ── Single email row ── */
interface EmailRowProps {
  email: {
    id: string;
    subject?: string | null;
    fromAddress: string;
    fromName?: string | null;
    toAddresses: unknown;
    ccAddresses: unknown;
    direction: string;
    createdAt: string;
    sentAt?: string | null;
    mailbox?: string | null;
    bodyHtml?: string | null;
    bodyText?: string | null;
  };
  expanded: boolean;
  onToggle: (id: string) => void;
}

function EmailRow({ email, expanded, onToggle }: EmailRowProps) {
  const date = fmtDate(email.sentAt ?? email.createdAt);
  return (
    <div className={`eml-row${expanded ? " eml-row--expanded" : ""}`}>
      <button
        type="button"
        className="eml-row__header"
        onClick={() => onToggle(email.id)}
      >
        <span className={`eml-badge eml-badge--${email.direction}`}>
          {email.direction === "inbound" ? "In" : "Ut"}
        </span>
        <span className="eml-row__subject">{email.subject ?? "(inget ämne)"}</span>
        <span className="eml-row__from">
          {email.fromName ? `${email.fromName} <${email.fromAddress}>` : email.fromAddress}
        </span>
        <span className="eml-row__date">{date}</span>
        <span className="eml-row__expand-icon">
          {expanded ? <ChevronUp20Regular /> : <ChevronDown20Regular />}
        </span>
      </button>

      {expanded && (
        <div className="eml-row__detail">
          <div className="eml-meta">
            <div className="eml-meta__row">
              <span className="eml-meta__label">Från</span>
              <span className="eml-meta__value">
                {email.fromName ? `${email.fromName} <${email.fromAddress}>` : email.fromAddress}
              </span>
            </div>
            <div className="eml-meta__row">
              <span className="eml-meta__label">Till</span>
              <span className="eml-meta__value">{parseAddresses(email.toAddresses)}</span>
            </div>
            {parseAddresses(email.ccAddresses) !== "—" && (
              <div className="eml-meta__row">
                <span className="eml-meta__label">CC</span>
                <span className="eml-meta__value">{parseAddresses(email.ccAddresses)}</span>
              </div>
            )}
            <div className="eml-meta__row">
              <span className="eml-meta__label">Datum</span>
              <span className="eml-meta__value">{date}</span>
            </div>
            {email.mailbox && (
              <div className="eml-meta__row">
                <span className="eml-meta__label">Brevlåda</span>
                <span className="eml-meta__value">{email.mailbox}</span>
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
              <pre className="eml-body__text">{email.bodyText}</pre>
            ) : (
              <p className="eml-body__empty">Inget innehåll.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Per-user collapsible section ── */
interface UserEmailSectionProps {
  userId: string;
  userEmail: string;
  directionFilter: DirectionFilter;
  searchQuery: string;
}

function UserEmailSection({
  userId,
  userEmail,
  directionFilter,
  searchQuery,
}: UserEmailSectionProps) {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GetEmailsByUserDocument, {
    variables: { userId },
    skip: !isOpen,
  });

  const filtered = useMemo(() => {
    const emailList = data?.getEmailsByUser ?? [];
    const q = searchQuery.trim().toLowerCase();
    return emailList.filter((e) => {
      if (directionFilter !== "all" && e.direction !== directionFilter) return false;
      if (q) {
        const subject = (e.subject ?? "").toLowerCase();
        const from = `${e.fromAddress} ${e.fromName ?? ""}`.toLowerCase();
        if (!subject.includes(q) && !from.includes(q)) return false;
      }
      return true;
    });
  }, [data, directionFilter, searchQuery]);

  return (
    <div className={`eml-user-section${isOpen ? " eml-user-section--open" : ""}`}>
      <button
        type="button"
        className="eml-user-section__header"
        onClick={() => setIsOpen((v) => !v)}
      >
        <Person20Regular />
        <span className="eml-user-section__email">{userEmail}</span>
        {isOpen && data && (
          <span className="eml-user-section__count">{filtered.length} e-post</span>
        )}
        <span className="eml-user-section__chevron">
          {isOpen ? <ChevronUp20Regular /> : <ChevronDown20Regular />}
        </span>
      </button>

      {isOpen && (
        <div className="eml-user-section__body">
          {loading ? (
            <div className="eml-user-section__spinner">
              <Spinner className={styles.spinner} size="tiny" label="Laddar…" />
            </div>
          ) : error ? (
            <div className="eml-error">Kunde inte ladda e-post: {error.message}</div>
          ) : filtered.length === 0 ? (
            <div className="eml-empty">Inga e-postmeddelanden hittades.</div>
          ) : (
            <div className="eml-list">
              {filtered.map((email) => (
                <EmailRow
                  key={email.id}
                  email={email}
                  expanded={expandedEmailId === email.id}
                  onToggle={(id) => setExpandedEmailId((prev) => (prev === id ? null : id))}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EmailPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [logout] = useMutation(LogoutDocument, {
    onCompleted: () => {
      setAuthToken(null);
      setToken(null);
      navigate({ to: "/" });
    },
  });

  const { data: meData } = useQuery(MeDocument);
  const companyId = meData?.me?.companyId;

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GetUsersByCompanyIdDocument, {
    variables: { companyId: companyId! },
    skip: !companyId,
  });

  const users = usersData?.getUsersByCompanyId ?? [];

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
              {(["all", "inbound", "outbound"] as DirectionFilter[]).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  className={`eml-tab${directionFilter === dir ? " eml-tab--active" : ""}`}
                  onClick={() => setDirectionFilter(dir)}
                >
                  {dir === "all" ? "Alla" : dir === "inbound" ? "Inkommande" : "Utgående"}
                </button>
              ))}
            </div>
            <div className="eml-search">
              <Input
                contentBefore={<Search20Regular />}
                placeholder="Sök ämne eller avsändare…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "280px" }}
              />
            </div>
          </div>

          {/* ── User sections ── */}
          {usersLoading && !usersData ? (
            <div className="dashboard-spinner-wrap">
              <Spinner className={styles.spinner} label="Laddar användare…" />
            </div>
          ) : usersError ? (
            <div className="eml-error">
              Kunde inte ladda användare: {usersError.message}
            </div>
          ) : users.length === 0 ? (
            <div className="eml-empty">Inga användare hittades.</div>
          ) : (
            <div className="eml-user-list">
              {users.map((user) =>
                user ? (
                  <UserEmailSection
                    key={user.id}
                    userId={user.id}
                    userEmail={user.email}
                    directionFilter={directionFilter}
                    searchQuery={searchQuery}
                  />
                ) : null,
              )}
            </div>
          )}
        </main>
      </div>
    </FluentProvider>
  );
}
