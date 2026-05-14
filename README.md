# Internox Frontend

A Swedish business management web application for companies that use [Fortnox](https://www.fortnox.se/) as their accounting system. Internox lets company employees and administrators manage invoices, bookkeeping, email integrations, customer assignments, and activity timelines — all in one place.

## Features

- **Dashboard** — Overview of employees, Fortnox customers, email integrations, and event log with customer assignment management
- **Invoices** — Paginated invoice list with status filtering (unpaid, paid, overdue, cancelled) and customer search
- **Bookkeeping** — Browse financial years, chart of accounts, and journal entries (vouchers) synced from Fortnox
- **Email** — Per-user inbox view with direction filtering (inbound/outbound) and full message detail
- **Activity Timeline** — User activity log with date range filtering
- **Alias Manager** — Create and manage invoice recipient email aliases mapped to Fortnox customers
- **Onboarding** — First-time setup wizard for IMAP credentials, user creation, and Fortnox OAuth connection
- **Super Admin** — Separate login and dashboard for platform-level administration

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Routing | TanStack React Router |
| UI | Fluent UI Components v9 |
| API | Apollo Client 4 (GraphQL) |
| Code Generation | GraphQL Code Generator |
| Testing | Playwright 1.60 (E2E) |

## Getting Started

### Prerequisites

- Node.js 24+
- A running [Internox backend](https://github.com/Sparven0)

### Environment variables

Create a `.env` file in the project root:

```env
# Required for E2E tests only
TEST_EMAIL=your-test-user@example.com
TEST_PASSWORD=your-password
TEST_DOMAIN=your-company-domain
```

### Install & run

```bash
npm install
npm run dev        # Start dev server at http://localhost:5173
```

### Build

```bash
npm run build      # Type-check + Vite production build
```

### Lint

```bash
npm run lint
```

### Regenerate GraphQL types

```bash
npx graphql-codegen
```


## Testing

End-to-end tests are written with [Playwright](https://playwright.dev/).

```bash
npx playwright install --with-deps chromium   # First time only
npx playwright test                           # Run all tests
npx playwright test --ui                      # Interactive UI mode
```

Tests use a shared authenticated session stored in `e2e/.auth/user.json` (git-ignored). The `auth.setup.ts` fixture logs in once using the `TEST_*` env vars before the rest of the suite runs.

### Test coverage

| File | What it covers |
|---|---|
| `auth.setup.ts` | Login and session state setup |
| `login.spec.ts` | Login form rendering, valid/invalid credentials, unauthenticated redirect |
| `dashboard.spec.ts` | Sidebar nav, page title, stats, employee section, logout |
| `invoices.spec.ts` | Table columns, filter bar, status dropdown options |

## CI/CD

A GitHub Actions workflow (`.github/workflows/e2e.yml`) runs the full Playwright suite on every pull request. Test credentials are stored as repository secrets:

| Secret | Description |
|---|---|
| `TEST_EMAIL` | Test account email |
| `TEST_PASSWORD` | Test account password |
| `TEST_DOMAIN` | Test company domain |

The Playwright HTML report is uploaded as a build artifact (retained 14 days) on every run.

## Project Structure

```
src/
├── pages/          # One file per route
├── components/     # Shared UI components
├── context/        # Auth context and hook
├── GraphQL/        # Query and mutation definitions
├── lib/            # Pure utility functions
├── __generated__/  # Auto-generated GraphQL types (do not edit)
└── *.css           # Per-page styles
e2e/                # Playwright tests
.github/workflows/  # CI pipeline
```
