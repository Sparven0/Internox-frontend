import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Spinner } from "@fluentui/react-components";
import { Add20Regular, Dismiss20Regular } from "@fluentui/react-icons";
import {
  GetCustomersByEmployeeDocument,
  AssignCustomerToEmployeeDocument,
  UnassignCustomerFromEmployeeDocument,
  GetInvoicesDocument,
  type GetInvoicesQuery,
  type GetInvoicesQueryVariables,
} from "../__generated__/graphql";
import "../DashboardPage.css";
import "../InvoicePage.css";

function InvoiceCount({ customerNumber }: { customerNumber: string | null | undefined }) {
  const { data, loading } = useQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(
    GetInvoicesDocument,
    {
      variables: { customerNumber: customerNumber ?? "", limit: 500 },
      skip: !customerNumber,
    },
  );
  if (!customerNumber) return <span className="ec-assigned__muted">—</span>;
  if (loading) return <span className="ec-invoice-count ec-invoice-count--loading">…</span>;
  const count = data?.getInvoices?.length ?? 0;
  return <span className="ec-invoice-count">{count}</span>;
}

interface Props {
  userId: string;
}

export default function EmployeeCustomerPanel({ userId }: Props) {
  const [customerId, setCustomerId] = useState("");
  const [assignError, setAssignError] = useState("");

  const { data, loading, error } = useQuery(GetCustomersByEmployeeDocument, {
    variables: { userId },
  });

  const [assignCustomer, { loading: assigning }] = useMutation(
    AssignCustomerToEmployeeDocument,
    {
      refetchQueries: [
        { query: GetCustomersByEmployeeDocument, variables: { userId } },
      ],
      onCompleted: () => {
        setCustomerId("");
        setAssignError("");
      },
      onError: (err) => setAssignError(err.message),
    },
  );

  const [unassignCustomer] = useMutation(UnassignCustomerFromEmployeeDocument, {
    refetchQueries: [
      { query: GetCustomersByEmployeeDocument, variables: { userId } },
    ],
  });

  const customers = data?.getCustomersByEmployee ?? [];

  return (
    <div className="ec-panel">
      <p className="ec-panel__label">Kopplade kunder</p>

      {loading ? (
        <div className="ec-panel__state">
          <Spinner size="extra-small" />
          Hämtar kunder…
        </div>
      ) : error ? (
        <div className="ec-panel__state ec-panel__state--error">
          Kunde inte hämta kunder.
        </div>
      ) : customers.length === 0 ? (
        <div className="ec-panel__state">Inga kunder kopplade ännu.</div>
      ) : (
        <div className="ec-assigned">
          <div className="ec-assigned__head">
            <span>ID</span>
            <span>Namn</span>
            <span>E-post</span>
            <span>Fortnox-nr</span>
            <span>Fakturor</span>
            <span />
          </div>
          {customers.map((c) => (
            <div key={c.id} className="ec-assigned__row">
              <span className="ec-assigned__muted">{c.id}</span>
              <span>{c.name ?? "—"}</span>
              <span className="ec-assigned__muted">{c.email ?? "—"}</span>
              <span className="ec-assigned__muted">
                {c.fortnoxCustomerNumber ?? "—"}
              </span>
              <InvoiceCount customerNumber={c.fortnoxCustomerNumber} />
              <button
                className="ec-action-btn ec-action-btn--unassign"
                title="Koppla bort"
                onClick={() =>
                  unassignCustomer({
                    variables: { userId, customerId: c.id },
                  })
                }
              >
                <Dismiss20Regular />
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        className="ec-assign-form"
        onSubmit={(e) => {
          e.preventDefault();
          const id = customerId.trim();
          if (!id) return;
          assignCustomer({ variables: { userId, customerId: id } });
        }}
      >
        <label className="ec-assign-form__label">Koppla kund</label>
        <div className="ec-assign-form__row">
          <input
            className="ec-assign-input"
            placeholder="Kund-ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <button
            type="submit"
            className="ec-assign-btn"
            disabled={assigning || !customerId.trim()}
          >
            <Add20Regular />
            Koppla
          </button>
        </div>
        {assignError && <p className="ec-assign-error">{assignError}</p>}
      </form>
    </div>
  );
}
