import { useQuery } from "@apollo/client/react";
import { Spinner, makeStyles, tokens } from "@fluentui/react-components";
import { GetVoucherDetailDocument } from "../__generated__/graphql";

const useStyles = makeStyles({
  spinner: { color: tokens.colorBrandForeground1 },
});

function fmtSEK(v: number | null | undefined): string {
  if (v == null) return "—";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

export default function VoucherDetailPanel({ voucherId }: { voucherId: string }) {
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
