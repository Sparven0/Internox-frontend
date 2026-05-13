export type TimelineEventKind =
  | "MAIL"
  | "EMAIL_ACTIVITY"
  | "FORTNOX_VOUCHER"
  | "FORTNOX_INVOICE";

export type TimelineMailSent = {
  id: string;
  subject?: string | null;
  messageId: string;
  fromAddress: string;
};

export type TimelineEmailActivity = {
  id: string;
  subject?: string | null;
  recipientEmail: string;
  messageId?: string | null;
};

export type TimelineFortnoxInvoice = {
  id: string;
  invoiceNumber: string;
  customerNumber: string;
  totalInclVat?: number | null;
  currency: string;
  status: string;
};

export type TimelineEventSummary = {
  kind: TimelineEventKind;
  occurredAt: string;
  mailSent?: TimelineMailSent | null;
  emailActivity?: TimelineEmailActivity | null;
  fortnoxInvoice?: TimelineFortnoxInvoice | null;
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
