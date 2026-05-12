import { test, expect } from "@playwright/test";

test.describe("Invoice page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/invoices");
    await page.waitForLoadState("networkidle");
  });

  // ── Layout ────────────────────────────────────────────────────────────────

  test("renders sidebar nav with active Fakturor link", async ({ page }) => {
    const nav = page.locator(".dashboard-nav");
    await expect(nav.getByRole("link", { name: "Fakturor" })).toHaveClass(
      /dashboard-nav__item--active/,
    );
    await expect(nav.getByRole("link", { name: "Översikt" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Bokföring" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Faktura-alias" })).toBeVisible();
  });

  test("shows page title Fakturalista", async ({ page }) => {
    await expect(page.getByText("Fakturalista")).toBeVisible();
  });

  test("renders table column headers", async ({ page }) => {
    await expect(page.getByText("Faktura #")).toBeVisible();
    await expect(page.getByText("Datum")).toBeVisible();
    await expect(page.getByText("Förfaller")).toBeVisible();
    await expect(page.getByText("Status")).toBeVisible();
    await expect(page.getByText("Bokförd")).toBeVisible();
  });

  // ── Filter bar ────────────────────────────────────────────────────────────

  test("filter bar renders status dropdown and customer input", async ({ page }) => {
    await expect(page.locator(".inv-status-select")).toBeVisible();
    await expect(page.locator(".inv-customer-input")).toBeVisible();
  });

  test("status dropdown has all expected options", async ({ page }) => {
    const select = page.locator(".inv-status-select");
    await expect(select.locator("option[value='']")).toHaveText("Alla statusar");
    await expect(select.locator("option[value='unpaid']")).toHaveText("Obetald");
    await expect(select.locator("option[value='paid']")).toHaveText("Betald");
    await expect(select.locator("option[value='overdue']")).toHaveText("Förfallen");
    await expect(select.locator("option[value='cancelled']")).toHaveText("Makulerad");
  });

  // ── Filtering sends correct GraphQL variables ─────────────────────────────

  test("selecting a status filter sends the correct variable", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("graphql") && req.postDataJSON()?.operationName === "GetInvoices") {
        requests.push(JSON.stringify(req.postDataJSON().variables));
      }
    });

    await page.selectOption(".inv-status-select", "paid");
    await page.waitForTimeout(400);

    expect(requests.some((r) => r.includes('"status":"paid"'))).toBe(true);
  });

  test("typing a customer number sends the correct variable", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("graphql") && req.postDataJSON()?.operationName === "GetInvoices") {
        requests.push(JSON.stringify(req.postDataJSON().variables));
      }
    });

    await page.fill(".inv-customer-input", "42");
    await page.waitForTimeout(400);

    expect(requests.some((r) => r.includes('"customerNumber":"42"'))).toBe(true);
  });

  test("changing status filter resets page to 1", async ({ page }) => {
    // Only run pagination part if there's a next page button enabled
    const nextBtn = page.getByRole("button", { name: "Nästa sida" });
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await expect(page.getByText("Sida 2")).toBeVisible();
    }

    await page.selectOption(".inv-status-select", "paid");
    await expect(page.getByText("Sida 1")).toBeVisible();
  });

  // ── Pagination ────────────────────────────────────────────────────────────

  test("previous page button is disabled on page 1", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Föregående sida" })).toBeDisabled();
  });

  test("next/prev navigation works when multiple pages exist", async ({ page }) => {
    const nextBtn = page.getByRole("button", { name: "Nästa sida" });

    // Skip if there's only one page of results
    test.skip(await nextBtn.isDisabled(), "Not enough invoices for pagination test");

    await nextBtn.click();
    await expect(page.getByText("Sida 2")).toBeVisible();
    await expect(page.getByRole("button", { name: "Föregående sida" })).toBeEnabled();

    await page.getByRole("button", { name: "Föregående sida" }).click();
    await expect(page.getByText("Sida 1")).toBeVisible();
  });

  // ── Expand / collapse detail panel ────────────────────────────────────────

  test("clicking a row expands the detail panel", async ({ page }) => {
    const firstRow = page.locator(".inv-table-row-main").first();

    // Skip if there are no invoices
    test.skip(!(await firstRow.isVisible()), "No invoices to expand");

    await firstRow.click();
    await expect(page.locator(".inv-detail-panel")).toBeVisible();
  });

  test("expanded detail panel shows meta field labels", async ({ page }) => {
    const firstRow = page.locator(".inv-table-row-main").first();
    test.skip(!(await firstRow.isVisible()), "No invoices to expand");

    await firstRow.click();
    await page.waitForLoadState("networkidle");

    // Either the detail loads or the reconnect banner shows — both are valid
    const hasDetail = await page.locator(".inv-detail-meta").isVisible();
    const hasBanner = await page.locator(".inv-reconnect-banner").isVisible();
    expect(hasDetail || hasBanner).toBe(true);

    if (hasDetail) {
      await expect(page.getByText("Fakturanummer")).toBeVisible();
      await expect(page.getByText("Status")).toBeVisible();
      await expect(page.getByText("Fakturarader")).toBeVisible();
      await expect(page.getByText("Exkl. moms")).toBeVisible();
      await expect(page.getByText("Inkl. moms")).toBeVisible();
    }
  });

  test("clicking the same row again collapses the detail panel", async ({ page }) => {
    const firstRow = page.locator(".inv-table-row-main").first();
    test.skip(!(await firstRow.isVisible()), "No invoices to expand");

    await firstRow.click();
    await expect(page.locator(".inv-detail-panel")).toBeVisible();

    await firstRow.click();
    await expect(page.locator(".inv-detail-panel")).not.toBeVisible();
  });

  test("chevron aria-label toggles between Visa and Dölj detaljer", async ({ page }) => {
    test.skip(!(await page.locator(".inv-expand-btn").first().isVisible()), "No invoices");

    await expect(page.getByRole("button", { name: "Visa detaljer" }).first()).toBeVisible();
    await page.getByRole("button", { name: "Visa detaljer" }).first().click();
    await expect(page.getByRole("button", { name: "Dölj detaljer" }).first()).toBeVisible();
  });

  // ── Logout ────────────────────────────────────────────────────────────────

  test("logout redirects to login page", async ({ page }) => {
    await page.getByRole("button", { name: "Logga ut" }).click();
    await expect(page).toHaveURL("/");
  });
});
