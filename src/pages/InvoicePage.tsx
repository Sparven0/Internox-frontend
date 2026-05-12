import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  FluentProvider,
  Spinner,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Building20Regular,
  SignOut20Regular,
  DocumentTable20Regular,
  History20Regular,
  Receipt20Regular,
  ChevronDown20Regular,
  ChevronUp20Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Search20Regular,
  Checkmark20Regular,
  ArrowSync20Regular,
  LinkAdd20Regular,
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  LogoutDocument,
  GetInvoicesDocument,
  GetInvoiceDetailDocument,
  GetFortnoxAuthUrlDocument,
  GetAllCustomersDocument,
  type GetInvoicesQuery,
  type GetInvoicesQueryVariables,
  type GetInvoiceDetailQuery,
  type GetInvoiceDetailQueryVariables,
} from "../__generated__/graphql";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import "../DashboardPage.css";
import "../InvoicePage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

function fmtDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("sv-SE");
}

function fmtCurrency(v: number | null | undefined, currency: string): string {
  if (v == null) return "—";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: currency || "SEK",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

const STATUS_LABELS: Record<string, string> = {
  unpaid: "Obetald",
  paid: "Betald",
  overdue: "Förfallen",
  cancelled: "Makulerad",
};

function StatusBadge({ status }: { status: string }) {
  const cls = `inv-badge inv-badge--${status}`;
  return <span className={cls}>{STATUS_LABELS[status] ?? status}</span>;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles({
  spinner: { color: tokens.colorBrandForeground1 },
});

// ── Skeleton rows ─────────────────────────────────────────────────────────────

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="inv-skeleton-row">
          <div className="inv-skel" style={{ width: "70%" }} />
          <div className="inv-skel" style={{ width: "60%" }} />
          <div className="inv-skel" style={{ width: "55%" }} />
          <div className="inv-skel" style={{ width: "65%" }} />
          <div className="inv-skel" style={{ width: "75%" }} />
          <div className="inv-skel" style={{ width: "40%" }} />
          <div className="inv-skel" style={{ width: "80%" }} />
          <div className="inv-skel" style={{ width: "90px" }} />
          <div className="inv-skel" style={{ width: "24px" }} />
        </div>
      ))}
    </>
  );
}

function BookedCell({ bookedAt }: { bookedAt?: string | null }) {
  if (!bookedAt) return <span className="inv-booked-empty">—</span>;
  return (
    <span className="inv-booked">
      <Checkmark20Regular className="inv-booked__icon" />
      {fmtDate(bookedAt)}
    </span>
  );
}

// ── Fortnox reconnect banner ─────────────────────────────────────────────────

function FortnoxReconnectBanner() {
  const { data, loading } = useQuery(GetFortnoxAuthUrlDocument, {
    fetchPolicy: "network-only",
  });

  const handleReconnect = () => {
    const url = data?.getFortnoxAuthUrl;
    if (url) window.location.href = url;
  };

  return (
    <div className="inv-reconnect-banner">
      <span className="inv-reconnect-banner__text">
        Fortnox-anslutningen har löpt ut.
      </span>
      <button
        className="inv-reconnect-banner__btn"
        onClick={handleReconnect}
        disabled={loading || !data?.getFortnoxAuthUrl}
      >
        {loading ? "Hämtar länk…" : "Återanslut Fortnox"}
      </button>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────

function InvoiceDetailPanel({
  invoiceNumber,
  customerNameMap,
}: {
  invoiceNumber: string;
  customerNameMap: Map<string, string>;
}) {
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery<
    GetInvoiceDetailQuery,
    GetInvoiceDetailQueryVariables
  >(GetInvoiceDetailDocument, {
    variables: { invoiceNumber },
    fetchPolicy: "network-only",
  });
  const [resyncing, setResyncing] = useState(false);
  const handleResync = async () => {
    setResyncing(true);
    try {
      await refetch();
    } finally {
      setResyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="inv-detail-panel">
        <div className="inv-detail-loading">
          <Spinner size="tiny" className={classes.spinner} />
          Laddar faktura…
        </div>
      </div>
    );
  }

  if (error || !data?.getInvoiceDetail) {
    return (
      <div className="inv-detail-panel">
        <FortnoxReconnectBanner />
      </div>
    );
  }

  const inv = data.getInvoiceDetail;
  const rows = inv.rows ?? [];

  return (
    <div className="inv-detail-panel">
      {/* Toolbar */}
      <div className="inv-detail-toolbar">
        <button
          className="inv-detail-resync-btn"
          onClick={handleResync}
          disabled={resyncing}
        >
          <ArrowSync20Regular
            className={
              resyncing ? "inv-detail-resync-btn__icon--spinning" : undefined
            }
          />
          {resyncing ? "Uppdaterar…" : "Uppdatera"}
        </button>
      </div>

      {/* Header meta grid */}
      <div className="inv-detail-meta">
        <div className="inv-detail-field">
          <span className="inv-detail-field__label">Fakturanummer</span>
          <span className="inv-detail-field__value">{inv.invoiceNumber}</span>
        </div>
        <div className="inv-detail-field">
          <span className="inv-detail-field__label">Kundnummer</span>
          <span className="inv-detail-field__value">{inv.customerNumber}</span>
        </div>
        {customerNameMap.get(String(inv.customerNumber).trim()) && (
          <div className="inv-detail-field">
            <span className="inv-detail-field__label">Kundnamn</span>
            <span className="inv-detail-field__value">
              {customerNameMap.get(String(inv.customerNumber).trim())}
            </span>
          </div>
        )}
        <div className="inv-detail-field">
          <span className="inv-detail-field__label">Status</span>
          <span className="inv-detail-field__value">
            <StatusBadge status={inv.status} />
          </span>
        </div>
        <div className="inv-detail-field">
          <span className="inv-detail-field__label">Fakturadatum</span>
          <span className="inv-detail-field__value">
            {fmtDate(inv.invoiceDate)}
          </span>
        </div>
        <div className="inv-detail-field">
          <span className="inv-detail-field__label">Förfallodatum</span>
          <span className="inv-detail-field__value">
            {fmtDate(inv.dueDate)}
          </span>
        </div>
        <div className="inv-detail-field">
          <span className="inv-detail-field__label">Valuta</span>
          <span className="inv-detail-field__value">{inv.currency}</span>
        </div>
        {inv.ourReference && (
          <div className="inv-detail-field">
            <span className="inv-detail-field__label">Vår referens</span>
            <span className="inv-detail-field__value">{inv.ourReference}</span>
          </div>
        )}
        {inv.yourReference && (
          <div className="inv-detail-field">
            <span className="inv-detail-field__label">Er referens</span>
            <span className="inv-detail-field__value">{inv.yourReference}</span>
          </div>
        )}
        {inv.bookedAt && (
          <div className="inv-detail-field">
            <span className="inv-detail-field__label">Bokförd</span>
            <span className="inv-detail-field__value">
              <BookedCell bookedAt={inv.bookedAt} />
            </span>
          </div>
        )}
        {inv.syncedAt && (
          <div className="inv-detail-field">
            <span className="inv-detail-field__label">Senast synkad</span>
            <span className="inv-detail-field__value">
              {fmtDate(inv.syncedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="inv-detail-total-row">
        <div className="inv-detail-total-item">
          <span className="inv-detail-total-item__label">Exkl. moms</span>
          <span className="inv-detail-total-item__value">
            {fmtCurrency(inv.totalExclVat, inv.currency)}
          </span>
        </div>
        <div className="inv-detail-total-item">
          <span className="inv-detail-total-item__label">Moms</span>
          <span className="inv-detail-total-item__value">
            {fmtCurrency(inv.vat, inv.currency)}
          </span>
        </div>
        <div className="inv-detail-total-item">
          <span className="inv-detail-total-item__label">Inkl. moms</span>
          <span className="inv-detail-total-item__value">
            {fmtCurrency(inv.totalInclVat, inv.currency)}
          </span>
        </div>
      </div>

      {/* Line items */}
      <p className="inv-detail-rows-label" style={{ marginTop: 24 }}>
        Fakturarader
      </p>
      <div className="inv-detail-rows-wrap">
        <div className="inv-detail-rows-head">
          <span>Artikelnr</span>
          <span>Beskrivning</span>
          <span>Antal</span>
          <span>À-pris</span>
          <span>Moms %</span>
          <span style={{ textAlign: "right" }}>Summa</span>
        </div>
        {rows.length === 0 ? (
          <div className="inv-detail-rows-empty">Inga rader.</div>
        ) : (
          rows.map((row, idx) => (
            <div key={idx} className="inv-detail-rows-row">
              <span className="inv-cell-num">{row.articleNumber ?? "—"}</span>
              <span>{row.description ?? "—"}</span>
              <span>{row.quantity ?? "—"}</span>
              <span>{fmtCurrency(row.price, inv.currency)}</span>
              <span>{row.vatPercent != null ? `${row.vatPercent}%` : "—"}</span>
              <span
                className="inv-cell-amount"
                style={{ textAlign: "right", justifySelf: "end" }}
              >
                {fmtCurrency(row.total, inv.currency)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function InvoicePage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [logout] = useMutation(LogoutDocument);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [expandedInvoiceNumber, setExpandedInvoiceNumber] = useState<
    string | null
  >(null);

  const { data, loading, error } = useQuery<
    GetInvoicesQuery,
    GetInvoicesQueryVariables
  >(GetInvoicesDocument, {
    variables: {
      page,
      limit: PAGE_SIZE,
      status: statusFilter || undefined,
      customerNumber: customerFilter || undefined,
    },
  });

  const { data: customersData } = useQuery(GetAllCustomersDocument);
  const customerNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of customersData?.getAllCustomers ?? []) {
      if (c.fortnoxCustomerNumber && c.name) {
        map.set(String(c.fortnoxCustomerNumber).trim(), c.name);
      }
    }
    return map;
  }, [customersData]);

  const invoices = data?.getInvoices ?? [];
  const hasPrevPage = page > 1;
  const hasNextPage = invoices.length === PAGE_SIZE;

  const toggleInvoice = (num: string) => {
    setExpandedInvoiceNumber((prev) => (prev === num ? null : num));
  };

  const handleStatusChange = (s: string) => {
    setStatusFilter(s);
    setPage(1);
    setExpandedInvoiceNumber(null);
  };

  const handleCustomerChange = (c: string) => {
    setCustomerFilter(c);
    setPage(1);
    setExpandedInvoiceNumber(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore */
    }
    setToken(null);
    setAuthToken(null);
    navigate({ to: "/" });
  };

  return (
    <FluentProvider theme={internoxTheme}>
      <div className="dashboard invoice-layout">
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
              <Link
                to="/invoices"
                className="dashboard-nav__item dashboard-nav__item--active"
              >
                <Receipt20Regular /> Fakturor
              </Link>
              <Link to="/aliases" className="dashboard-nav__item">
                <LinkAdd20Regular /> Faktura-alias
              </Link>
            </nav>
          </div>

          <div className="dashboard-sidebar__bottom">
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
              <p className="dashboard-topbar__label">Fakturor</p>
              <h1 className="dashboard-topbar__title">Fakturalista</h1>
            </div>
          </div>

          {/* Filter bar */}
          <div className="inv-filter-bar">
            <span className="inv-filter-label">Filter</span>
            <select
              className="inv-status-select"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="">Alla statusar</option>
              <option value="unpaid">Obetald</option>
              <option value="paid">Betald</option>
              <option value="overdue">Förfallen</option>
              <option value="cancelled">Makulerad</option>
            </select>
            <div className="inv-customer-input-wrap">
              <Search20Regular />
              <input
                type="text"
                className="inv-customer-input"
                placeholder="Filtrera kundnummer…"
                value={customerFilter}
                onChange={(e) => handleCustomerChange(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <section className="dashboard-section">
            <div className="inv-table-head">
              <span>Faktura #</span>
              <span>Kund</span>
              <span>Datum</span>
              <span>Förfaller</span>
              <span style={{ textAlign: "right" }}>Totalt inkl. moms</span>
              <span>Valuta</span>
              <span>Status</span>
              <span>Bokförd</span>
              <span />
            </div>

            {loading ? (
              <SkeletonRows count={8} />
            ) : error ? (
              <p className="inv-error">
                Kunde inte hämta fakturor. Försök igen.
              </p>
            ) : invoices.length === 0 ? (
              <div className="inv-empty">Inga fakturor hittades.</div>
            ) : (
              invoices.map((inv) => {
                const isExpanded = expandedInvoiceNumber === inv.invoiceNumber;
                return (
                  <div
                    key={inv.invoiceNumber}
                    className={`inv-table-row${isExpanded ? " inv-table-row--expanded" : ""}`}
                  >
                    <div
                      className="inv-table-row-main"
                      onClick={() => toggleInvoice(inv.invoiceNumber)}
                    >
                      <span className="inv-cell-num">{inv.invoiceNumber}</span>
                      <span>
                        {customerNameMap.get(String(inv.customerNumber).trim())
                          ? `${customerNameMap.get(String(inv.customerNumber).trim())} (#${inv.customerNumber})`
                          : inv.customerNumber}
                      </span>
                      <span>{fmtDate(inv.invoiceDate)}</span>
                      <span>{fmtDate(inv.dueDate)}</span>
                      <span className="inv-cell-amount">
                        {fmtCurrency(inv.totalInclVat, inv.currency)}
                      </span>
                      <span>{inv.currency}</span>
                      <span>
                        <StatusBadge status={inv.status} />
                      </span>
                      <span>
                        <BookedCell bookedAt={inv.bookedAt} />
                      </span>
                      <button
                        className="inv-expand-btn"
                        aria-label={
                          isExpanded ? "Dölj detaljer" : "Visa detaljer"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInvoice(inv.invoiceNumber);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp20Regular />
                        ) : (
                          <ChevronDown20Regular />
                        )}
                      </button>
                    </div>
                    {isExpanded && (
                      <InvoiceDetailPanel
                        invoiceNumber={inv.invoiceNumber}
                        customerNameMap={customerNameMap}
                      />
                    )}
                  </div>
                );
              })
            )}
          </section>

          {/* Pagination */}
          {!loading && !error && invoices.length > 0 && (
            <div className="inv-pagination">
              <span className="inv-pagination__info">
                Sida {page}
                {hasNextPage ? "" : " (sista)"}
              </span>
              <button
                className="inv-pagination__btn"
                disabled={!hasPrevPage}
                onClick={() => {
                  setPage((p) => p - 1);
                  setExpandedInvoiceNumber(null);
                }}
                aria-label="Föregående sida"
              >
                <ChevronLeft20Regular />
              </button>
              <button
                className="inv-pagination__btn"
                disabled={!hasNextPage}
                onClick={() => {
                  setPage((p) => p + 1);
                  setExpandedInvoiceNumber(null);
                }}
                aria-label="Nästa sida"
              >
                <ChevronRight20Regular />
              </button>
            </div>
          )}
        </main>
      </div>
    </FluentProvider>
  );
}
