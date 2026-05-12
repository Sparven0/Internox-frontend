import { test, expect, Page } from "@playwright/test";

const baseHandlers = {
  GetInitPageData: {
    getInitPageData: {
      company: { id: "b8ba5b4d-10ff-443f-93ee-e629ad36ca02", name: "ACME AB" },
      users: [
        { id: "61943543-5897-4ea2-8844-7f615a199293", email: "admin@acme.com", role: "admin" },
        { id: "d4fa7727-246e-40a1-bfa5-428cd55eb892", email: "fynnxav@gmail.com", role: "employee" },
      ],
    },
  },
  GetInitPageIntegrationData: {
    getInitPageIntegrationData: { emails: [], customers: [] },
  },
  GetAllCustomers: {
    getAllCustomers: [
      { id: "84ce7f9f-2ab0-41d2-aa0f-077a6d7395a7", fortnoxCustomerNumber: "3", name: "Ruangrads Vårrullar", email: "ruangrad@varrollar.se" },
      { id: "8683b886-a69a-4f83-a21a-8614a1e72f0b", fortnoxCustomerNumber: "6", name: "Gustaf Vingren", email: "gustafwingren@hotmail.se" },
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
    await expect(page.getByText("ACME AB").first()).toBeVisible();
  });

  // ── Employee table ────────────────────────────────────────────────────────

  test("renders employee list with email and role badge", async ({ page }) => {
    await expect(page.getByText("admin@acme.com")).toBeVisible();
    await expect(page.getByText("fynnxav@gmail.com")).toBeVisible();
    await expect(page.getByText("admin")).toBeVisible();
    await expect(page.getByText("employee")).toBeVisible();
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
                { id: "84ce7f9f-2ab0-41d2-aa0f-077a6d7395a7", name: "Ruangrads Vårrullar", fortnoxCustomerNumber: "3", email: "ruangrad@varrollar.se" },
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