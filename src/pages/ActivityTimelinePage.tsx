import { useMemo, useState } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Button,
  FluentProvider,
  Input,
  makeStyles,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import {
  Building20Regular,
  DocumentTable20Regular,
  History20Regular,
  LinkAdd20Regular,
  PlugConnected20Regular,
  Receipt20Regular,
  SignOut20Regular,
  Mail20Regular,
} from "@fluentui/react-icons";
import { internoxTheme } from "../theme";
import {
  GetInitPageDataDocument,
  GetOnboardingStatusDocument,
  LogoutDocument,
} from "../__generated__/graphql";
import { GET_USER_ACTIVITY_TIMELINE } from "../GraphQL/queries";
import type {
  GetUserActivityTimelineQuery,
  GetUserActivityTimelineQueryVariables,
  TimelineEventKind,
} from "../types/activityTimeline";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import { fortnoxAuthUrl } from "../backendOrigin";
import "../DashboardPage.css";
import "../ActivityTimelinePage.css";

const useStyles = makeStyles({
  spinner: { color: tokens.colorBrandForeground1 },
});

function utcYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function initialDateRange(): { from: string; to: string } {
  const to = Date.now();
  const from = new Date(to - 6 * 864e5);
  return { from: utcYmd(from), to: utcYmd(new Date(to)) };
}

function fmtOccurredAt(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** UI buckets per product copy: mail-like vs Fortnox. */
function timelineKindBucket(
  kind: TimelineEventKind,
): "mail" | "fortnox" {
  if (kind === "FORTNOX_VOUCHER") return "fortnox";
  return "mail";
}

function timelineTypeLabel(kind: TimelineEventKind): string {
  if (kind === "FORTNOX_VOUCHER") return "Fortnox";
  if (kind === "MAIL") return "Mejl";
  return "E-post";
}

export default function ActivityTimelinePage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [logout] = useMutation(LogoutDocument);

  const defaultRange = useMemo(() => initialDateRange(), []);
  const { data: pageData, loading: pageLoading } = useQuery(
    GetInitPageDataDocument,
  );
  const { data: onboardingData } = useQuery(GetOnboardingStatusDocument);

  const company = pageData?.getInitPageData?.company;
  const sortedEmployees = useMemo(() => {
    const list = [...(pageData?.getInitPageData?.users ?? [])];
    list.sort((a, b) =>
      a.email.localeCompare(b.email, "sv", { sensitivity: "base" }),
    );
    return list;
  }, [pageData]);

  const [pickedUserId, setPickedUserId] = useState("");
  const userId = useMemo(() => {
    if (pickedUserId && sortedEmployees.some((u) => u.id === pickedUserId)) {
      return pickedUserId;
    }
    return sortedEmployees[0]?.id ?? "";
  }, [pickedUserId, sortedEmployees]);

  const [fromDate, setFromDate] = useState(defaultRange.from);
  const [toDate, setToDate] = useState(defaultRange.to);
  const [limitStr, setLimitStr] = useState("");

  const [fetchTimeline, { data, loading, error, called }] = useLazyQuery<
    GetUserActivityTimelineQuery,
    GetUserActivityTimelineQueryVariables
  >(GET_USER_ACTIVITY_TIMELINE, { fetchPolicy: "network-only" });

  const events = data?.getUserActivityTimeline ?? [];

  const limitParsed = /^[0-9]+$/.test(limitStr.trim())
    ? Math.min(Number(limitStr.trim()), 500)
    : undefined;

  const handleFetch = () => {
    if (!userId) return;
    void fetchTimeline({
      variables: {
        userId,
        fromDate,
        toDate,
        limit: typeof limitParsed === "number" ? limitParsed : undefined,
      },
    });
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

  const handleOpenFortnoxConnect = () => {
    window.open(fortnoxAuthUrl(), "_blank", "noopener,noreferrer");
  };

  const showFortnoxConnect =
    onboardingData?.getOnboardingStatus?.hasFortnox === false;

  const graphQLFieldMismatch = error
    ? /cannot query field|field.*not found|Unknown field/i.test(
        error.message ?? "",
      )
    : false;

  return (
    <FluentProvider theme={internoxTheme}>
      <div className="dashboard">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__top">
            <div className="dashboard-logo">
              <span className="dashboard-logo-dot" />
              internox
            </div>

            {company && (
              <div className="dashboard-company">
                <Building20Regular className="dashboard-company__icon" />
                <span className="dashboard-company__name">{company.name}</span>
              </div>
            )}

            <nav className="dashboard-nav">
              <Link to="/dashboard" className="dashboard-nav__item">
                <Building20Regular /> Översikt
              </Link>
              <Link
                to="/activity"
                className="dashboard-nav__item dashboard-nav__item--active"
              >
                <History20Regular /> Tidslinje
              </Link>
              <Link to="/bookkeeping" className="dashboard-nav__item">
                <DocumentTable20Regular /> Bokföring
              </Link>
              <Link to="/invoices" className="dashboard-nav__item">
                <Receipt20Regular /> Fakturor
              </Link>
              <Link to="/aliases" className="dashboard-nav__item">
                <LinkAdd20Regular /> Faktura-alias
              </Link>
              <Link to="/emails" className="dashboard-nav__item">
                <Mail20Regular /> E-post
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

        <main className="dashboard-main">
          <div className="dashboard-topbar">
            <div>
              <p className="dashboard-topbar__label">Tidslinje</p>
              <h1 className="dashboard-topbar__title">Aktivitet</h1>
            </div>
          </div>

          <p className="timeline-page__hint">
            Varje punkt är en händelse i kronologisk ordning som servern skickar
            (senaste först). Mejl kopplas till vald anställd; Fortnox-punkter är
            bolagsgemensamma i intervallet (UTC‑kalenderdagar).
          </p>

          <div className="timeline-page__controls">
            <label className="timeline-page__field">
              <span>Anställd</span>
              <select
                className="dashboard-event-log__filter-select timeline-page__select"
                id="activity-timeline-employee"
                value={userId}
                onChange={(e) => setPickedUserId(e.target.value)}
                disabled={sortedEmployees.length === 0 || pageLoading}
              >
                {sortedEmployees.length === 0 ? (
                  <option value="">—</option>
                ) : (
                  sortedEmployees.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label className="timeline-page__field">
              <span>Från</span>
              <Input
                type="date"
                id="timeline-from"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value.slice(0, 10))}
              />
            </label>

            <label className="timeline-page__field">
              <span>Till</span>
              <Input
                type="date"
                id="timeline-to"
                value={toDate}
                onChange={(e) => setToDate(e.target.value.slice(0, 10))}
              />
            </label>

            <label className="timeline-page__field timeline-page__field--limit">
              <span title="Tom = backend-standard (ofta 100)">Limit</span>
              <Input
                type="text"
                placeholder="standard"
                value={limitStr}
                aria-label="Max antal punkter"
                inputMode="numeric"
                onChange={(e) =>
                  setLimitStr(e.target.value.replace(/[^\d]/g, ""))
                }
              />
            </label>

            <Button
              appearance="primary"
              disabled={!userId || loading || pageLoading}
              onClick={handleFetch}
            >
              {loading ? (
                <>
                  <Spinner size="tiny" className={classes.spinner} />
                  Hämtar…
                </>
              ) : (
                "Uppdatera"
              )}
            </Button>
          </div>

          {error && (
            <p className="timeline-page__error" role="alert">
              {graphQLFieldMismatch
                ? "Servern saknar eller har ändrat getUserActivityTimeline — kontrollera att backend är deployad och fältnamnen stämmer."
                : `Kunde inte hämta tidslinje: ${error.message ?? "okänt fel"}`}
            </p>
          )}

          <div className="timeline-page__legend" aria-hidden>
            <span className="timeline-page__legend-item">
              <span
                className="timeline-page__dot timeline-page__dot--mail"
                aria-hidden
              />{" "}
              Mejl &amp; e-post
            </span>
            <span className="timeline-page__legend-item">
              <span
                className="timeline-page__dot timeline-page__dot--fortnox"
                aria-hidden
              />{" "}
              Fortnox
            </span>
          </div>

          {!called && !loading && (
            <p className="timeline-page__empty">
              Välj anställd och datum, tryck sedan <strong>Uppdatera</strong> för
              att visa punkter.
            </p>
          )}

          {called && !loading && events.length === 0 && !error && (
            <p className="timeline-page__empty">
              Inga händelser i intervallet för denna vy.
            </p>
          )}

          {events.length > 0 && (
            <div
              className="timeline-page__rail"
              role="list"
              aria-label="Aktivitets­tids­linje"
            >
              {events.map((ev, idx) => {
                const bucket = timelineKindBucket(ev.kind);
                return (
                  <div
                    key={`${ev.kind}-${ev.occurredAt}-${idx}`}
                    className="timeline-page__step"
                    role="listitem"
                  >
                    <div className="timeline-page__dot-wrap">
                      <span
                        className={`timeline-page__dot timeline-page__dot--${bucket}`}
                        title={timelineTypeLabel(ev.kind)}
                      />
                    </div>
                    <div className="timeline-page__main">
                      <span className="timeline-page__time">
                        {fmtOccurredAt(ev.occurredAt)}
                      </span>
                      <span
                        className={`timeline-page__type timeline-page__type--${bucket}`}
                      >
                        {timelineTypeLabel(ev.kind)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </FluentProvider>
  );
}
