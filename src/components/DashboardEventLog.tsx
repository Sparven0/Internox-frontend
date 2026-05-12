import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@fluentui/react-components";
import { ArrowClockwise20Regular } from "@fluentui/react-icons";
import type { DashboardEventRow } from "../lib/buildDashboardEventLog";
import {
  filterEventsForEmployee,
  formatEventCountSv,
  type EventLogEmployeeOption,
} from "../lib/dashboardEventLogFilter";
import "../DashboardPage.css";

export interface DashboardEventLogProps {
  events: DashboardEventRow[];
  loading: boolean;
  onRefresh: () => void;
  employees: EventLogEmployeeOption[];
}

export default function DashboardEventLog({
  events,
  loading,
  onRefresh,
  employees,
}: DashboardEventLogProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    if (!selectedEmployeeId) return;
    if (!employees.some((e) => e.id === selectedEmployeeId)) {
      setSelectedEmployeeId("");
    }
  }, [employees, selectedEmployeeId]);

  const sortedEmployees = useMemo(
    () =>
      [...employees].sort((a, b) => a.email.localeCompare(b.email, "sv")),
    [employees],
  );

  const filteredEvents = useMemo(
    () =>
      filterEventsForEmployee(events, selectedEmployeeId, employees),
    [events, employees, selectedEmployeeId],
  );

  const selectedEmployee = selectedEmployeeId
    ? employees.find((e) => e.id === selectedEmployeeId)
    : undefined;

  const countSummary =
    selectedEmployeeId === ""
      ? formatEventCountSv(events.length)
      : selectedEmployee
        ? `${formatEventCountSv(filteredEvents.length)} för ${selectedEmployee.email}`
        : formatEventCountSv(filteredEvents.length);

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
        <div className="dashboard-event-log__toolbar">
          <label
            className="dashboard-event-log__filter-label"
            htmlFor="dashboard-event-log-employee-filter"
          >
            Filtrera på anställd
          </label>
          <select
            id="dashboard-event-log-employee-filter"
            className="dashboard-event-log__filter-select"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">Alla anställda</option>
            {sortedEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.email}
              </option>
            ))}
          </select>
          <div
            className="dashboard-event-log__count-box"
            aria-live="polite"
          >
            {countSummary}
          </div>
        </div>

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
        ) : filteredEvents.length === 0 ? (
          <p className="dashboard-event-log__empty">
            Inga händelser för den valda anställda.
          </p>
        ) : (
          <ul className="dashboard-event-log__list">
            {filteredEvents.map((ev) => (
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
                    <dt>Typ</dt>
                    <dd>{ev.eventTypeLabel}</dd>
                  </div>
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
