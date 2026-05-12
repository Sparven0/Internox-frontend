import { test, expect, Page } from "@playwright/test";

const baseHandlers = {
  GetInitPageData: {
    getInitPageData: {
      company: { id: "co-1", name: "Testbolaget AB" },
      users: [
        { id: "u1", email: "anna@test.se", role: "admin" },
        { id: "u2", email: "erik@test.se", role: "user" },
      ],
    },
  },
  GetInitPageIntegrationData: {
    getInitPageIntegrationData: { emails: [], customers: [] },
  },
  GetAllCustomers: {
    getAllCustomers: [
      { id: "c1", fortnoxCustomerNumber: "10", name: "Kund AB", email: "kund@ab.se" },
      { id: "c2", fortnoxCustomerNumber: "11", name: "Partner KB", email: "p@kb.se" },
    ],
  },
  GetOnboardingStatus: {
    getOnboardingStatus: { hasFortnox: true, hasEmployees: true, isComplete: true },
  },
  GetInvoiceRecipientAliases: { invoiceRecipientAliases: [] },
  GetCustomersByEmployee: { getCustomersByEmployee: [] },
};

async function mockDashboard(page: Page, overrides = {}) {
  const handlers = { ...baseHandlers, ...overrides };
  await page.route("**/graphql", async (route) => {
    const { operationName } = route.request().postDataJSON();
    if (operationName in handlers) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: handlers[operationName as keyof typeof handlers] }),
      });
    }
    return route.continue();
  });
}

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await mockDashboard(page);
    await page.goto("/dashboard");
  });

  // ── Stats row ─────────────────────────────────────────────────────────────

  test("stats row shows correct counts", async ({ page }) => {
    // 2 users, 2 customers
    const stats = page.locator(".dashboard-stats");
    await expect(stats.getByText("2").first()).toBeVisible(); // Anställda
    await expect(stats.getByText("Anställda")).toBeVisible();
    await expect(stats.getByText("Fortnox-kunder")).toBeVisible();
  });

  test("shows company name in topbar and sidebar", async ({ page }) => {
    await expect(page.getByText("Testbolaget AB").first()).toBeVisible();
  });

  // ── Employee table ────────────────────────────────────────────────────────

  test("renders employee list with email and role badge", async ({ page }) => {
    await expect(page.getByText("anna@test.se")).toBeVisible();
    await expect(page.getByText("erik@test.se")).toBeVisible();
    await expect(page.getByText("admin")).toBeVisible();
    await expect(page.getByText("user")).toBeVisible();
  });

  test("expanding employee loads their customers panel", async ({ page }) => {
    await page.route("**/graphql", async (route) => {
      const body = route.request().postDataJSON();
      if (body?.operationName === "GetCustomersByEmployee") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              getCustomersByEmployee: [
                { id: "c1", name: "Kund AB", fortnoxCustomerNumber: "10", email: null },
              ],
            },
          }),
        });
      }
      return route.continue();
    });

    // Click the "Kunder" button on the first employee row
    await page.locator(".ec-customers-btn").first().click();
    await expect(page.locator(".ec-employee-block--expanded")).toBeVisible();
  });

  test("clicking the same employee again collapses their panel", async ({
    page,
  }) => {
    const btn = page.locator(".ec-customers-btn").first();
    await btn.click();
    await expect(page.locator(".ec-employee-block--expanded")).toBeVisible();
    await btn.click();
    await expect(page.locator(".ec-employee-block--expanded")).not.toBeVisible();
  });

  // ── Fortnox connect button ────────────────────────────────────────────────

  test("does NOT show Koppla Fortnox when Fortnox is already connected", async ({
    page,
  }) => {
    await expect(page.getByRole("button", { name: "Koppla Fortnox" })).not.toBeVisible();
  });

  test("shows Koppla Fortnox button when hasFortnox is false", async ({
    page,
  }) => {
    await mockDashboard(page, {
      GetOnboardingStatus: {
        getOnboardingStatus: { hasFortnox: false, hasEmployees: true, isComplete: true },
      },
    });
    await page.goto("/dashboard");
    await expect(page.getByRole("button", { name: "Koppla Fortnox" })).toBeVisible();
  });

  // ── Refresh ───────────────────────────────────────────────────────────────

  test("refresh button triggers refetch of integration data", async ({
    page,
  }) => {
    let refetchCount = 0;
    page.on("request", (req) => {
      if (
        req.url().includes("graphql") &&
        req.postDataJSON()?.operationName === "GetInitPageIntegrationData"
      ) {
        refetchCount++;
      }
    });

    await page.getByTitle("Uppdatera").click();
    await page.waitForTimeout(300);
    expect(refetchCount).toBeGreaterThanOrEqual(1);
  });

  // ── Logout ────────────────────────────────────────────────────────────────

  test("logout clears session and redirects to login", async ({ page }) => {
    await page.route("**/graphql", async (route) => {
      if (route.request().postDataJSON()?.operationName === "Logout") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { logout: true } }),
        });
      }
      return route.continue();
    });

    await page.getByRole("button", { name: "Logga ut" }).click();
    await expect(page).toHaveURL("/");
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  test("Fakturor nav link navigates to /invoices", async ({ page }) => {
    await page.route("**/graphql", async (route) => {
      const { operationName } = route.request().postDataJSON();
      if (operationName === "GetInvoices")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { getInvoices: [] } }),
        });
      return route.continue();
    });
    await page.getByRole("link", { name: "Fakturor" }).click();
    await expect(page).toHaveURL("/invoices");
  });
});