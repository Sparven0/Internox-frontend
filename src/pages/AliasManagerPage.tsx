import { useState, useRef, useEffect } from "react";

// ── Combobox outside-click hook ───────────────────────────────────────────────
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}
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
  LinkAdd20Regular,
  Delete20Regular,
  ArrowLeft20Regular,
  Mail20Regular,
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  LogoutDocument,
  MeDocument,
  GetAllCustomersDocument,
  GetInvoiceRecipientAliasesDocument,
  CreateInvoiceRecipientAliasDocument,
  DeleteInvoiceRecipientAliasDocument,
  type GetInvoiceRecipientAliasesQuery,
  type CreateInvoiceRecipientAliasMutation,
  type CreateInvoiceRecipientAliasMutationVariables,
  type DeleteInvoiceRecipientAliasMutation,
  type DeleteInvoiceRecipientAliasMutationVariables,
} from "../__generated__/graphql";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import "../DashboardPage.css";
import "../AliasManagerPage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("sv-SE");
}

type AliasRow = GetInvoiceRecipientAliasesQuery["invoiceRecipientAliases"][number];

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles({
  spinner: { color: tokens.colorBrandForeground1 },
});

// ── Add alias form ────────────────────────────────────────────────────────────

interface AddFormProps {
  customers: Array<{ id: string; name: string; fortnoxCustomerNumber?: string | null }>;
  onAdded: (row: AliasRow) => void;
}

function AddAliasForm({ customers, onAdded }: AddFormProps) {
  const [alias, setAlias] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedCustomer = customers.find((c) => c.id === customerId);

  const [createAlias, { loading }] = useMutation<
    CreateInvoiceRecipientAliasMutation,
    CreateInvoiceRecipientAliasMutationVariables
  >(CreateInvoiceRecipientAliasDocument);

  // Close dropdown on outside click
  useOutsideClick(dropdownRef, () => setOpen(false));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!alias.trim()) { setError("Alias får inte vara tomt."); return; }
    if (!customerId) { setError("Välj en kund."); return; }
    try {
      const result = await createAlias({ variables: { alias: alias.trim(), customerId } });
      const row = result.data?.createInvoiceRecipientAlias;
      if (row) {
        onAdded(row);
        setAlias("");
        setCustomerId("");
        setSearch("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Okänt fel";
      if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("already exists")) {
        setError(`Aliaset "${alias.trim()}" finns redan.`);
      } else {
        setError(msg);
      }
    }
  };

  return (
    <form className="am-add-form" onSubmit={handleSubmit} noValidate>
      <h2 className="am-add-form__title">
        <LinkAdd20Regular />
        Lägg till mappning
      </h2>

      <div className="am-add-form__row">
        {/* Alias input */}
        <div className="am-field">
          <label className="am-field__label" htmlFor="am-alias">
            Alias <span className="am-field__hint">(exakt som i Fortnox)</span>
          </label>
          <input
            id="am-alias"
            className="am-field__input am-field__input--mono"
            type="text"
            value={alias}
            onChange={(e) => { setAlias(e.target.value); setError(null); }}
            placeholder="t.ex. Kundens Fakturamejl"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Customer combobox */}
        <div className="am-field" ref={dropdownRef}>
          <label className="am-field__label" htmlFor="am-customer-search">
            Kund
          </label>
          <div className="am-combobox">
            <input
              id="am-customer-search"
              className="am-field__input"
              type="text"
              value={open ? search : (selectedCustomer?.name ?? "")}
              onChange={(e) => {
                setSearch(e.target.value);
                setCustomerId("");
                setOpen(true);
              }}
              onFocus={() => {
                setSearch("");
                setOpen(true);
              }}
              placeholder="Sök kund…"
              autoComplete="off"
            />
            {open && (
              <div className="am-combobox__dropdown">
                {filtered.length === 0 ? (
                  <div className="am-combobox__empty">Inga kunder hittades</div>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`am-combobox__option${c.id === customerId ? " am-combobox__option--selected" : ""}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setCustomerId(c.id);
                        setSearch("");
                        setOpen(false);
                        setError(null);
                      }}
                    >
                      <span className="am-combobox__option-name">{c.name}</span>
                      {c.fortnoxCustomerNumber && (
                        <span className="am-combobox__option-num">
                          #{c.fortnoxCustomerNumber}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="am-submit-btn"
          disabled={loading}
        >
          {loading ? "Sparar…" : "Lägg till"}
        </button>
      </div>

      {error && <p className="am-add-form__error">{error}</p>}
    </form>
  );
}

// ── Alias table ───────────────────────────────────────────────────────────────

interface AliasTableProps {
  rows: AliasRow[];
  onDelete: (id: string) => void;
  deletingId: string | null;
}

function AliasTable({ rows, onDelete, deletingId }: AliasTableProps) {
  if (rows.length === 0) {
    return (
      <div className="am-empty">
        <p className="am-empty__text">
          Inga alias konfigurerade. Lägg till ett för att automatiskt koppla
          Fortnox-fakturor till kunder.
        </p>
      </div>
    );
  }

  return (
    <div className="am-table-wrap">
      <div className="am-table-head">
        <span>Alias</span>
        <span>Kundnamn</span>
        <span>Kund #</span>
        <span>Skapad</span>
        <span />
      </div>
      {rows.map((row) => (
        <div key={row.id} className="am-table-row">
          <code className="am-alias-code">{row.alias}</code>
          <span>{row.customer.name}</span>
          <span className="am-customer-num">
            {/* fortnoxCustomerNumber not in alias fragment; show email fallback */}
            {row.customer.email ?? "—"}
          </span>
          <span className="am-date">{fmtDate(row.createdAt)}</span>
          <div className="am-actions">
            <button
              className="am-delete-btn"
              title="Ta bort mappning"
              disabled={deletingId === row.id}
              onClick={() => onDelete(row.id)}
            >
              {deletingId === row.id ? (
                <Spinner size="tiny" />
              ) : (
                <Delete20Regular />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AliasManagerPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [logout] = useMutation(LogoutDocument);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Optimistic state: track added/deleted locally without mirroring server data
  const [addedRows, setAddedRows] = useState<AliasRow[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // Auth + role check
  const { data: meData, loading: meLoading } = useQuery(MeDocument);
  const role = meData?.me?.role;

  // Data
  const { data: aliasData, loading: aliasLoading } = useQuery(
    GetInvoiceRecipientAliasesDocument,
    { fetchPolicy: "network-only" },
  );
  const { data: customersData, loading: customersLoading } = useQuery(
    GetAllCustomersDocument,
  );

  const [deleteAlias] = useMutation<
    DeleteInvoiceRecipientAliasMutation,
    DeleteInvoiceRecipientAliasMutationVariables
  >(DeleteInvoiceRecipientAliasDocument);

  const serverRows: AliasRow[] = aliasData?.invoiceRecipientAliases ?? [];
  const rows: AliasRow[] = [
    ...serverRows.filter((r) => !deletedIds.has(r.id)),
    ...addedRows.filter((r) => !deletedIds.has(r.id)),
  ];
  const customers = customersData?.getAllCustomers ?? [];

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    setToken(null);
    setAuthToken(null);
    navigate({ to: "/" });
  };

  const handleAdded = (row: AliasRow) => {
    setAddedRows((prev) => [...prev, row]);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeletedIds((prev) => new Set([...prev, id])); // optimistic remove
    try {
      await deleteAlias({ variables: { id } });
    } catch {
      // Revert on error
      setDeletedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    } finally {
      setDeletingId(null);
    }
  };

  const isLoading = meLoading || aliasLoading || customersLoading;

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
              <Link
                to="/aliases"
                className="dashboard-nav__item dashboard-nav__item--active"
              >
                <LinkAdd20Regular /> Faktura-alias
              </Link>
              <Link to="/emails" className="dashboard-nav__item">
                <Mail20Regular /> E-post
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
          <div className="dashboard-topbar">
            <div>
              <p className="dashboard-topbar__label">Inställningar</p>
              <h1 className="dashboard-topbar__title">Faktura-aliasmappningar</h1>
            </div>
            <Link to="/invoices" className="am-back-btn">
              <ArrowLeft20Regular />
              Tillbaka till fakturor
            </Link>
          </div>

          {isLoading ? (
            <div className="am-page-loading">
              <Spinner size="small" className={classes.spinner} />
            </div>
          ) : role !== "admin" ? (
            <div className="am-access-denied">
              <p>Du har inte behörighet att se den här sidan.</p>
            </div>
          ) : (
            <>
              <AddAliasForm customers={customers} onAdded={handleAdded} />

              <section className="am-section">
                <h2 className="am-section__title">Befintliga mappningar</h2>
                <AliasTable
                  rows={rows}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              </section>
            </>
          )}
        </main>
      </div>
    </FluentProvider>
  );
}
