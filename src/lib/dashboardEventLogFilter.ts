import type { DashboardEventRow } from "./buildDashboardEventLog";

export type EventLogEmployeeOption = {
  id: string;
  email: string;
};

/** True om anställden är avsändare eller ingår bland kopplade anställda. */
export function eventMatchesEmployee(
  ev: DashboardEventRow,
  employee: EventLogEmployeeOption,
): boolean {
  const emailNorm = employee.email.trim().toLowerCase();
  const idStr = String(employee.id).trim();

  if (ev.actorLabel) {
    const al = ev.actorLabel.trim().toLowerCase();
    if (al === emailNorm) return true;
    if (al === `användare ${idStr.toLowerCase()}`) return true;
  }

  const linked = ev.linkedEmployeesLabel;
  if (
    linked &&
    linked !== "—" &&
    linked !== "Ingen kopplad anställd"
  ) {
    const parts = linked.split(",").map((s) => s.trim().toLowerCase());
    if (parts.includes(emailNorm)) return true;
    if (parts.includes(idStr.toLowerCase())) return true;
  }

  return false;
}

export function filterEventsForEmployee(
  events: DashboardEventRow[],
  employeeId: string,
  employees: EventLogEmployeeOption[],
): DashboardEventRow[] {
  if (!employeeId.trim()) return events;
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) return [];
  return events.filter((ev) => eventMatchesEmployee(ev, emp));
}

export function formatEventCountSv(n: number): string {
  return n === 1 ? "1 händelse" : `${n} händelser`;
}
