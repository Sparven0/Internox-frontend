import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useNavigate, Link } from "@tanstack/react-router";
import { FluentProvider, Spinner, makeStyles, tokens } from "@fluentui/react-components";
import {
  Building20Regular,
  SignOut20Regular,
  DocumentTable20Regular,
  PlugConnected20Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  ChevronDown20Regular,
  ChevronUp20Regular,
  Search20Regular,
  TableSimple20Regular,
  BookNumber20Regular,
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  GetFinancialYearsDocument,
  GetAccountsDocument,
  GetVouchersDocument,
  GetVoucherDetailDocument,
  GetOnboardingStatusDocument,
} from "../__generated__/graphql";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import { fortnoxAuthUrl } from "../backendOrigin";
import "../DashboardPage.css";
import "../BookkeepingPage.css";

const VOUCHER_PAGE_SIZE = 50;

const useStyles = makeStyles({
  spinner: { color: tokens.colorBrandForeground1 },
});

function fmtDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("sv-SE");
}

function fmtSEK(v: number | null | undefined): string {
  if (v == null) return "—";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

function SkeletonRows({
  count,
  variant,
}: {
  count: number;
  variant: "accounts" | "vouchers";
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bk-skeleton-row bk-skeleton-row--${variant}`}>
          <div className="bk-skel" style={{ width: "60%" }} />
          <div className="bk-skel" style={{ width: "80%" }} />
          <div className="bk-skel" style={{ width: "50%" }} />
          <div className="bk-skel" style={{ width: "50%" }} />
          <div className="bk-skel" style={{ width: "40%" }} />
          {variant === "accounts" && (
            <div className="bk-skel" style={{ width: "30%" }} />
          )}
        </div>
      ))}
    </>
  );
}

function VoucherDetailPanel({ voucherId }: { voucherId: string }) {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GetVoucherDetailDocument, {
    variables: { voucherId },
  });

  if (loading) {
    return (
      <div className="bk-detail-panel">
        <div className="bk-detail-loading">
          <Spinner size="tiny" className={classes.spinner} />
          Laddar verifikation…
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bk-detail-panel">
        <p className="bk-error">Kunde inte hämta verifikationsdetaljer.</p>
      </div>
    );
  }

  const detail = data?.getVoucherDetail;
  if (!detail) return null;

  const rows = detail.rows ?? [];
  const totalDebit = rows.reduce((s, r) => s + (r.debit ?? 0), 0);
  const totalCredit = rows.reduce((s, r) => s + (r.credit ?? 0), 0);

  return (
    <div className="bk-detail-panel">
      {rows.length === 0 ? (
        <p className="bk-detail-empty">Inga rader.</p>
      ) : (
        <>
          <div className="bk-detail-head">
            <span>Konto</span>
            <span>Beskrivning</span>
            <span style={{ textAlign: "right" }}>Debet</span>
            <span style={{ textAlign: "right" }}>Kredit</span>
          </div>
          {rows.map((row, idx) => (
            <div key={idx} className="bk-detail-row">
              <span className="bk-cell-num">{row.accountNumber}</span>
              <span>{row.description ?? "—"}</span>
              <span className="bk-detail-amount">{fmtSEK(row.debit)}</span>
              <span className="bk-detail-amount">{fmtSEK(row.credit)}</span>
            </div>
          ))}
          <div className="bk-detail-totals">
            <span />
            <span>Summa</span>
            <span className="bk-detail-amount">{fmtSEK(totalDebit)}</span>
            <span className="bk-detail-amount">{fmtSEK(totalCredit)}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function BookkeepingPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"accounts" | "vouchers">(
    "accounts",
  );
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(1);
  const [expandedVoucherId, setExpandedVoucherId] = useState<string | null>(
    null,
  );

  const handleYearChange = (id: string) => {
    setSelectedYearId(id);
    setPage(1);
    setExpandedVoucherId(null);
  };

  const handleTabChange = (tab: "accounts" | "vouchers") => {
    setActiveTab(tab);
    setPage(1);
    setExpandedVoucherId(null);
  };

  /* ── Queries ── */
  const {
    data: yearsData,
    loading: yearsLoading,
    error: yearsError,
  } = useQuery(GetFinancialYearsDocument);
  const { data: onboardingData } = useQuery(GetOnboardingStatusDocument);

  /* ── Derived data ── */
  const years = yearsData?.getFinancialYears ?? [];
  // Auto-select the first year if none is chosen yet
  const effectiveYearId = selectedYearId || years[0]?.id || "";

  const {
    data: accountsData,
    loading: accountsLoading,
    error: accountsError,
  } = useQuery(GetAccountsDocument, {
    variables: { financialYearId: effectiveYearId },
    skip: !effectiveYearId || activeTab !== "accounts",
  });

  const {
    data: vouchersData,
    loading: vouchersLoading,
    error: vouchersError,
  } = useQuery(GetVouchersDocument, {
    variables: {
      financialYearId: effectiveYearId,
      page,
      limit: VOUCHER_PAGE_SIZE,
    },
    skip: !effectiveYearId || activeTab !== "vouchers",
  });
  const allAccounts = accountsData?.getAccounts ?? [];
  const vouchers = vouchersData?.getVouchers ?? [];

  const filteredAccounts = allAccounts.filter((a) => {
    if (showOnlyActive && !a.active) return false;
    if (filterText) {
      const q = filterText.toLowerCase();
      return (
        String(a.accountNumber).includes(q) ||
        (a.description ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const hasPrevPage = page > 1;
  const hasNextPage = vouchers.length === VOUCHER_PAGE_SIZE;

  const handleLogout = () => {
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("jwt_token");
    navigate({ to: "/" });
  };

  const handleOpenFortnoxConnect = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;
    window.open(fortnoxAuthUrl(token), "_blank", "noopener,noreferrer");
  };

  const showFortnoxConnect =
    onboardingData?.getOnboardingStatus?.hasFortnox === false;
  const hasFortnox = onboardingData?.getOnboardingStatus?.hasFortnox;

  useEffect(() => {
    console.log("hasFortnox", hasFortnox);
  }, [hasFortnox]);

  const toggleVoucher = (id: string) => {
    setExpandedVoucherId((prev) => (prev === id ? null : id));
  };

  /* ── Render ── */
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
              <Link
                to="/bookkeeping"
                className="dashboard-nav__item dashboard-nav__item--active"
              >
                <DocumentTable20Regular /> Bokföring
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
              <p className="dashboard-topbar__label">Bokföring</p>
              <h1 className="dashboard-topbar__title">
                Räkenskapsår &amp; Verifikationer
              </h1>
            </div>
          </div>

          {/* Financial year selector */}
          <div className="bk-year-bar">
            <span className="bk-year-label">Räkenskapsår</span>
            {yearsLoading ? (
              <Spinner size="tiny" className={classes.spinner} />
            ) : yearsError ? (
              <span className="bk-error" style={{ margin: 0, padding: "6px 12px" }}>
                Kunde inte hämta räkenskapsår.
              </span>
            ) : years.length === 0 ? (
              <span style={{ fontSize: 13, color: "#aaa" }}>
                Inga räkenskapsår hittades.
              </span>
            ) : (
              <select
                className="bk-year-select"
                value={effectiveYearId}
                onChange={(e) => handleYearChange(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {fmtDate(y.fromDate)} – {fmtDate(y.toDate)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tabs */}
          <div className="bk-tabs">
            <button
              className={`bk-tab${activeTab === "accounts" ? " bk-tab--active" : ""}`}
              onClick={() => handleTabChange("accounts")}
            >
              <TableSimple20Regular />
              Kontoplan
            </button>
            <button
              className={`bk-tab${activeTab === "vouchers" ? " bk-tab--active" : ""}`}
              onClick={() => handleTabChange("vouchers")}
            >
              <BookNumber20Regular />
              Verifikationer
            </button>
          </div>

          {/* ── Chart of Accounts ── */}
          {activeTab === "accounts" && (
            <section className="dashboard-section" style={{ animation: "fadeUp 0.3s ease both" }}>
              {/* Filter bar */}
              <div className="bk-filter-bar">
                <div className="bk-filter-input-wrap">
                  <Search20Regular />
                  <input
                    type="text"
                    className="bk-filter-input"
                    placeholder="Sök konto eller beskrivning…"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>
                <label className="bk-toggle">
                  <input
                    type="checkbox"
                    checked={showOnlyActive}
                    onChange={(e) => setShowOnlyActive(e.target.checked)}
                  />
                  Visa endast aktiva
                </label>
              </div>

              {!effectiveYearId ? (
                <div className="dashboard-empty">
                  Välj ett räkenskapsår för att visa kontoplanen.
                </div>
              ) : accountsLoading ? (
                <>
                  <div className="bk-accounts-head">
                    <span>Konto</span>
                    <span>Beskrivning</span>
                    <span style={{ textAlign: "right" }}>IB</span>
                    <span style={{ textAlign: "right" }}>UB</span>
                    <span style={{ textAlign: "right" }}>Moms</span>
                    <span style={{ textAlign: "right" }}>Aktiv</span>
                  </div>
                  <SkeletonRows count={8} variant="accounts" />
                </>
              ) : accountsError ? (
                <p className="bk-error">
                  Kunde inte hämta kontoplanen. Försök igen.
                </p>
              ) : filteredAccounts.length === 0 ? (
                <div className="dashboard-empty">
                  {allAccounts.length === 0
                    ? "Inga konton hittades för detta räkenskapsår."
                    : "Inga konton matchar filtret."}
                </div>
              ) : (
                <>
                  <div className="bk-accounts-head">
                    <span>Konto</span>
                    <span>Beskrivning</span>
                    <span style={{ textAlign: "right" }}>IB</span>
                    <span style={{ textAlign: "right" }}>UB</span>
                    <span style={{ textAlign: "right" }}>Moms</span>
                    <span style={{ textAlign: "right" }}>Aktiv</span>
                  </div>
                  {filteredAccounts.map((a) => {
                    const bbf = a.balanceBroughtForward;
                    const bcf = a.balanceCarriedForward;
                    return (
                      <div
                        key={a.accountNumber}
                        className={`bk-accounts-row${!a.active ? " bk-accounts-row--inactive" : ""}`}
                      >
                        <span className="bk-cell-num">{a.accountNumber}</span>
                        <span>{a.description ?? "—"}</span>
                        <span
                          className={`bk-cell-amount${bbf != null && bbf < 0 ? " bk-cell-amount--negative" : ""}`}
                        >
                          {fmtSEK(bbf)}
                        </span>
                        <span
                          className={`bk-cell-amount${bcf != null && bcf < 0 ? " bk-cell-amount--negative" : ""}`}
                        >
                          {fmtSEK(bcf)}
                        </span>
                        <span className="bk-cell-right">
                          {a.vatCode ?? "—"}
                        </span>
                        <span className="bk-cell-right">
                          <span
                            className={`bk-active-dot bk-active-dot--${a.active ? "on" : "off"}`}
                            title={a.active ? "Aktiv" : "Inaktiv"}
                          />
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </section>
          )}

          {/* ── Vouchers ── */}
          {activeTab === "vouchers" && (
            <section className="dashboard-section" style={{ animation: "fadeUp 0.3s ease both" }}>
              {!effectiveYearId ? (
                <div className="dashboard-empty">
                  Välj ett räkenskapsår för att visa verifikationer.
                </div>
              ) : vouchersLoading ? (
                <>
                  <div className="bk-vouchers-head">
                    <span>Datum</span>
                    <span>Serie/Nr</span>
                    <span>Beskrivning</span>
                    <span>Referens</span>
                    <span />
                  </div>
                  <SkeletonRows count={8} variant="vouchers" />
                </>
              ) : vouchersError ? (
                <p className="bk-error">
                  Kunde inte hämta verifikationer. Försök igen.
                </p>
              ) : vouchers.length === 0 ? (
                <div className="dashboard-empty">
                  Inga verifikationer hittades för detta räkenskapsår.
                </div>
              ) : (
                <>
                  <div className="bk-vouchers-head">
                    <span>Datum</span>
                    <span>Serie/Nr</span>
                    <span>Beskrivning</span>
                    <span>Referens</span>
                    <span />
                  </div>
                  {vouchers.map((v) => {
                    const isExpanded = expandedVoucherId === v.id;
                    const ref =
                      v.referenceType && v.referenceNumber
                        ? `${v.referenceType} ${v.referenceNumber}`
                        : v.referenceType ?? v.referenceNumber ?? "—";
                    return (
                      <div
                        key={v.id}
                        className={`bk-voucher-row${isExpanded ? " bk-voucher-row--expanded" : ""}`}
                      >
                        <div
                          className="bk-voucher-row-main"
                          onClick={() => toggleVoucher(v.id)}
                        >
                          <span>{fmtDate(v.transactionDate)}</span>
                          <span>
                            <span className="bk-series-badge">
                              {v.voucherSeries} {v.voucherNumber}
                            </span>
                          </span>
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {v.description ?? "—"}
                          </span>
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: "#888888",
                              fontSize: 12,
                            }}
                          >
                            {ref}
                          </span>
                          <button
                            className="bk-expand-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVoucher(v.id);
                            }}
                            aria-label={isExpanded ? "Dölj detaljer" : "Visa detaljer"}
                          >
                            {isExpanded ? (
                              <ChevronUp20Regular />
                            ) : (
                              <ChevronDown20Regular />
                            )}
                          </button>
                        </div>
                        {isExpanded && (
                          <VoucherDetailPanel voucherId={v.id} />
                        )}
                      </div>
                    );
                  })}
                  {/* Pagination */}
                  <div className="bk-pagination">
                    <span className="bk-pagination__info">
                      Sida {page}
                    </span>
                    <button
                      className="bk-pagination__btn"
                      disabled={!hasPrevPage}
                      onClick={() => setPage((p) => p - 1)}
                      aria-label="Föregående sida"
                    >
                      <ChevronLeft20Regular />
                    </button>
                    <button
                      className="bk-pagination__btn"
                      disabled={!hasNextPage}
                      onClick={() => setPage((p) => p + 1)}
                      aria-label="Nästa sida"
                    >
                      <ChevronRight20Regular />
                    </button>
                  </div>
                </>
              )}
            </section>
          )}
        </main>
      </div>
    </FluentProvider>
  );
}
