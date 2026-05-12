import { test, expect, type Page, type Route } from "@playwright/test";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const makeInvoice = (overrides = {}) => ({
  invoiceNumber: "1001",
  customerNumber: "42",
  invoiceDate: "2026-01-15",
  dueDate: "2026-02-15",
  totalInclVat: 12500,
  currency: "SEK",
  status: "unpaid",
  bookedAt: null,
  ...overrides,
});

const makeDetail = (overrides = {}) => ({
  invoiceNumber: "1001",
  customerNumber: "42",
  status: "unpaid",
  invoiceDate: "2026-01-15",
  dueDate: "2026-02-15",
  currency: "SEK",
  totalExclVat: 10000,
  vat: 2500,
  totalInclVat: 12500,
  ourReference: "Anna Svensson",
  yourReference: null,
  bookedAt: null,
  syncedAt: "2026-05-10",
  rows: [
    {
      articleNumber: "ART-1",
      description: "Konsulttjänst",
      quantity: 10,
      price: 1000,
      vatPercent: 25,
      total: 10000,
    },
  ],
  ...overrides,
});

async function mockGraphQL(page: Page, handlers: Record<string, unknown>) {
  await page.route("**/graphql", async (route: Route) => {
    const { operationName } = route.request().postDataJSON();
    if (operationName in handlers) {
      const body = handlers[operationName];
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: body }),
      });
    }
    return route.continue();
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe("Invoice page", () => {
  test.beforeEach(async ({ page }) => {
    await mockGraphQL(page, {
      GetInvoices: {
        getInvoices: [
          makeInvoice({
            invoiceNumber: "1001",
            status: "unpaid",
            bookedAt: null,
          }),
          makeInvoice({
            invoiceNumber: "1002",
            status: "paid",
            bookedAt: "2026-02-20",
          }),
          makeInvoice({ invoiceNumber: "1003", status: "overdue" }),
        ],
      },
      GetAllCustomers: {
        getAllCustomers: [
          {
            id: "c1",
            fortnoxCustomerNumber: "42",
            name: "Acme AB",
            email: null,
          },
        ],
      },
    });
    await page.goto("/invoices");
  });

  // ── Layout ────────────────────────────────────────────────────────────────

  test("renders sidebar nav with active Fakturor link", async ({ page }) => {
    const nav = page.locator(".dashboard-nav");
    await expect(nav.getByRole("link", { name: "Fakturor" })).toHaveClass(
      /dashboard-nav__item--active/,
    );
    await expect(nav.getByRole("link", { name: "Översikt" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Bokföring" })).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Faktura-alias" }),
    ).toBeVisible();
  });

  test("shows page title", async ({ page }) => {
    await expect(page.getByText("Fakturalista")).toBeVisible();
  });

  // ── Invoice list ──────────────────────────────────────────────────────────

  test("renders all invoices with correct data", async ({ page }) => {
    // Customer name resolved from customers query
    await expect(page.getByText(/Acme AB.*#42/)).toBeVisible();
    // Dates formatted as sv-SE
    await expect(page.getByText("2026-01-15").first()).toBeVisible();
    // Currency
    await expect(page.getByText("SEK").first()).toBeVisible();
  });

  test("renders correct status badges", async ({ page }) => {
    await expect(page.getByText("Obetald")).toBeVisible();
    await expect(page.getByText("Betald")).toBeVisible();
    await expect(page.getByText("Förfallen")).toBeVisible();
  });

  test("BookedCell shows checkmark date for booked invoice and dash for unbooked", async ({
    page,
  }) => {
    // Invoice 1002 has bookedAt set — should show a date
    const row1002 = page.locator(".inv-table-row", { hasText: "1002" });
    await expect(row1002.locator(".inv-booked")).toBeVisible();

    // Invoice 1001 has no bookedAt
    const row1001 = page.locator(".inv-table-row", { hasText: "1001" });
    await expect(row1001.locator(".inv-booked-empty")).toBeVisible();
  });

  // ── Filtering ─────────────────────────────────────────────────────────────

  test("status filter refetches with correct variable", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("graphql")) {
        const body = req.postDataJSON();
        if (body?.operationName === "GetInvoices") {
          requests.push(JSON.stringify(body.variables));
        }
      }
    });

    await page.selectOption(".inv-status-select", "paid");

    // Should have fired a new query with status: "paid"
    await page.waitForTimeout(300);
    expect(requests.some((r) => r.includes('"status":"paid"'))).toBe(true);
  });

  test("customer number filter sends correct variable", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("graphql")) {
        const body = req.postDataJSON();
        if (body?.operationName === "GetInvoices") {
          requests.push(JSON.stringify(body.variables));
        }
      }
    });

    await page.fill(".inv-customer-input", "42");
    await page.waitForTimeout(400); // debounce / re-render

    expect(requests.some((r) => r.includes('"customerNumber":"42"'))).toBe(
      true,
    );
  });

  test("changing status filter resets to page 1", async ({ page }) => {
    // Navigate to page 2 first (mock 50 items to enable next button)
    await mockGraphQL(page, {
      GetInvoices: {
        getInvoices: Array.from({ length: 50 }, (_, i) =>
          makeInvoice({ invoiceNumber: String(1000 + i) }),
        ),
      },
      GetAllCustomers: { getAllCustomers: [] },
    });
    await page.goto("/invoices");
    await page.getByRole("button", { name: "Nästa sida" }).click();
    await expect(page.getByText("Sida 2")).toBeVisible();

    await page.selectOption(".inv-status-select", "paid");
    await expect(page.getByText("Sida 1")).toBeVisible();
  });

  // ── Expand / collapse detail panel ────────────────────────────────────────

  test("expands invoice detail on row click", async ({ page }) => {
    await mockGraphQL(page, {
      GetInvoices: { getInvoices: [makeInvoice()] },
      GetAllCustomers: {
        getAllCustomers: [
          {
            id: "c1",
            fortnoxCustomerNumber: "42",
            name: "Acme AB",
            email: null,
          },
        ],
      },
      GetInvoiceDetail: { getInvoiceDetail: makeDetail() },
    });
    await page.goto("/invoices");

    await page.locator(".inv-table-row-main").first().click();

    // Meta fields
    await expect(page.getByText("Fakturanummer")).toBeVisible();
    await expect(page.getByText("Förfallodatum")).toBeVisible();
    await expect(page.getByText("Vår referens")).toBeVisible();
    await expect(page.getByText("Anna Svensson")).toBeVisible();
  });

  test("detail panel shows invoice line items", async ({ page }) => {
    await mockGraphQL(page, {
      GetInvoices: { getInvoices: [makeInvoice()] },
      GetAllCustomers: { getAllCustomers: [] },
      GetInvoiceDetail: { getInvoiceDetail: makeDetail() },
    });
    await page.goto("/invoices");

    await page.locator(".inv-table-row-main").first().click();

    await expect(page.getByText("Fakturarader")).toBeVisible();
    await expect(page.getByText("Konsulttjänst")).toBeVisible();
    await expect(page.getByText("ART-1")).toBeVisible();
    await expect(page.getByText("25%")).toBeVisible();
  });

  test("detail panel shows totals (excl/incl VAT)", async ({ page }) => {
    await mockGraphQL(page, {
      GetInvoices: { getInvoices: [makeInvoice()] },
      GetAllCustomers: { getAllCustomers: [] },
      GetInvoiceDetail: { getInvoiceDetail: makeDetail() },
    });
    await page.goto("/invoices");

    await page.locator(".inv-table-row-main").first().click();

    await expect(page.getByText("Exkl. moms")).toBeVisible();
    await expect(page.getByText("Moms")).toBeVisible();
    await expect(page.getByText("Inkl. moms")).toBeVisible();
  });

  test("clicking the same row again collapses the detail panel", async ({
    page,
  }) => {
    await mockGraphQL(page, {
      GetInvoices: { getInvoices: [makeInvoice()] },
      GetAllCustomers: { getAllCustomers: [] },
      GetInvoiceDetail: { getInvoiceDetail: makeDetail() },
    });
    await page.goto("/invoices");

    const row = page.locator(".inv-table-row-main").first();
    await row.click();
    await expect(page.getByText("Fakturarader")).toBeVisible();

    await row.click();
    await expect(page.getByText("Fakturarader")).not.toBeVisible();
  });

  test("chevron button toggles detail independently of row click", async ({
    page,
  }) => {
    await mockGraphQL(page, {
      GetInvoices: { getInvoices: [makeInvoice()] },
      GetAllCustomers: { getAllCustomers: [] },
      GetInvoiceDetail: { getInvoiceDetail: makeDetail() },
    });
    await page.goto("/invoices");

    await page.getByRole("button", { name: "Visa detaljer" }).click();
    await expect(
      page.getByRole("button", { name: "Dölj detaljer" }),
    ).toBeVisible();
    await expect(page.getByText("Fakturarader")).toBeVisible();
  });

  test("shows Fortnox reconnect banner when detail fetch fails", async ({
    page,
  }) => {
    await mockGraphQL(page, {
      GetInvoices: { getInvoices: [makeInvoice()] },
      GetAllCustomers: { getAllCustomers: [] },
      // Omit GetInvoiceDetail entirely — route.continue() will likely fail
    });

    // Intercept and return a GraphQL error for detail
    await page.route("**/graphql", async (route) => {
      const { operationName } = route.request().postDataJSON();
      if (operationName === "GetInvoiceDetail") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [{ message: "Fortnox token expired" }],
          }),
        });
      }
      return route.continue();
    });

    await page.goto("/invoices");
    await page.locator(".inv-table-row-main").first().click();
    await expect(
      page.getByText("Fortnox-anslutningen har löpt ut."),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Återanslut Fortnox" }),
    ).toBeVisible();
  });

  test("resync button in detail panel refetches invoice", async ({ page }) => {
    let detailCallCount = 0;
    await page.route("**/graphql", async (route) => {
      const { operationName } = route.request().postDataJSON();
      if (operationName === "GetInvoices")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { getInvoices: [makeInvoice()] } }),
        });
      if (operationName === "GetAllCustomers")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { getAllCustomers: [] } }),
        });
      if (operationName === "GetInvoiceDetail") {
        detailCallCount++;
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { getInvoiceDetail: makeDetail() } }),
        });
      }
      return route.continue();
    });

    await page.goto("/invoices");
    await page.locator(".inv-table-row-main").first().click();
    await page.getByRole("button", { name: "Uppdatera" }).click();

    await page.waitForTimeout(300);
    expect(detailCallCount).toBeGreaterThanOrEqual(2);
  });

  // ── Pagination ────────────────────────────────────────────────────────────

  test("next/prev pagination buttons work correctly", async ({ page }) => {
    // First page: full 50 rows → hasNextPage = true
    await page.route("**/graphql", async (route) => {
      const body = route.request().postDataJSON();
      if (body?.operationName === "GetInvoices") {
        const { page: p = 1 } = body.variables;
        const invoices =
          p === 1
            ? Array.from({ length: 50 }, (_, i) =>
                makeInvoice({ invoiceNumber: String(1000 + i) }),
              )
            : [makeInvoice({ invoiceNumber: "2000" })];
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { getInvoices: invoices } }),
        });
      }
      if (body?.operationName === "GetAllCustomers")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { getAllCustomers: [] } }),
        });
      return route.continue();
    });

    await page.goto("/invoices");

    await expect(page.getByText("Sida 1")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Föregående sida" }),
    ).toBeDisabled();

    await page.getByRole("button", { name: "Nästa sida" }).click();
    await expect(page.getByText("Sida 2")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Föregående sida" }),
    ).toBeEnabled();

    // Last page label
    await expect(page.getByText(/sista/)).toBeVisible();

    await page.getByRole("button", { name: "Föregående sida" }).click();
    await expect(page.getByText("Sida 1")).toBeVisible();
  });

  // ── Empty & error states ──────────────────────────────────────────────────

  test("shows empty state when no invoices match filter", async ({ page }) => {
    await page.route("**/graphql", async (route) => {
      const { operationName } = route.request().postDataJSON();
      if (operationName === "GetInvoices")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { getInvoices: [] } }),
        });
      if (operationName === "GetAllCustomers")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { getAllCustomers: [] } }),
        });
      return route.continue();
    });
    await page.goto("/invoices");
    await expect(page.getByText("Inga fakturor hittades.")).toBeVisible();
  });

  test("shows error state when GetInvoices query fails", async ({ page }) => {
    await page.route("**/graphql", async (route) => {
      const { operationName } = route.request().postDataJSON();
      if (operationName === "GetInvoices")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ errors: [{ message: "Internal error" }] }),
        });
      return route.continue();
    });
    await page.goto("/invoices");
    await expect(
      page.getByText("Kunde inte hämta fakturor. Försök igen."),
    ).toBeVisible();
  });
});
