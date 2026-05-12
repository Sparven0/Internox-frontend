/**
 * Summary shape returned when querying only kind + occurredAt on timeline events.
 * Run graphql-codegen against schema for full TimelineEvent typings when backend is available.
 */

export type TimelineEventKind =
  | "MAIL"
  | "EMAIL_ACTIVITY"
  | "FORTNOX_VOUCHER";

export type TimelineEventSummary = {
  kind: TimelineEventKind;
  occurredAt: string;
};

export type GetUserActivityTimelineQuery = {
  getUserActivityTimeline: TimelineEventSummary[];
};

export type GetUserActivityTimelineQueryVariables = {
  userId: string;
  fromDate: string;
  toDate: string;
  limit?: number | null;
};
