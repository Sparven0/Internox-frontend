import { Spinner } from "@fluentui/react-components";
import { ArrowClockwise20Regular } from "@fluentui/react-icons";
import type { DashboardEventRow } from "../lib/buildDashboardEventLog";
import "../DashboardPage.css";

export interface DashboardEventLogProps {
  events: DashboardEventRow[];
  loading: boolean;
  onRefresh: () => void;
}

export default function DashboardEventLog({
  events,
  loading,
  onRefresh,
}: DashboardEventLogProps) {
  return (
    <aside className="dashboard-event-log" aria-label="Händelselogg">
      <div className="dashboard-event-log__header">
        <h2 className="dashboard-event-log__title">Händelselogg</h2>
        <button
          type="button"
          className="dashboard-event-log__refresh"
          onClick={onRefresh}
          disabled={loading}
          title="Uppdatera händelser"
        >
          <ArrowClockwise20Regular className={loading ? "dashboard-event-log__spin" : undefined} />
        </button>
      </div>
      <div className="dashboard-event-log__body">
        {loading && events.length === 0 ? (
          <div className="dashboard-event-log__state">
            <Spinner size="small" />
            <span>Hämtar händelser…</span>
          </div>
        ) : events.length === 0 ? (
          <p className="dashboard-event-log__empty">
            Inga händelser att visa. Klicka på uppdatera eller vänta tills
            e-post och Fortnox-data har hämtats.
          </p>
        ) : (
          <ul className="dashboard-event-log__list">
            {events.map((ev) => (
              <li key={ev.id} className="dashboard-event-log__item">
                <div className="dashboard-event-log__item-top">
                  <span
                    className={`dashboard-event-log__badge dashboard-event-log__badge--${ev.source}`}
                  >
                    {ev.source === "email" ? "E-post" : "Fortnox"}
                  </span>
                </div>
                <p className="dashboard-event-log__summary">{ev.summary}</p>
                {ev.detail ? (
                  <p className="dashboard-event-log__detail">{ev.detail}</p>
                ) : null}
                <dl className="dashboard-event-log__meta">
                  <div>
                    <dt>Kund</dt>
                    <dd>{ev.customerLabel}</dd>
                  </div>
                  <div>
                    <dt>Kopplade anställda</dt>
                    <dd>{ev.linkedEmployeesLabel}</dd>
                  </div>
                  {ev.actorLabel ? (
                    <div>
                      <dt>Avsändare / aktör</dt>
                      <dd>{ev.actorLabel}</dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
