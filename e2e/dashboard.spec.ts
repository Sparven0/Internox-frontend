import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
  });

  // ── Layout ────────────────────────────────────────────────────────────────

  test("renders sidebar nav links", async ({ page }) => {
    const nav = page.locator(".dashboard-nav");
    await expect(nav.getByRole("link", { name: "Bokföring" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Fakturor" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Faktura-alias" })).toBeVisible();
  });

  test("shows page title Översikt", async ({ page }) => {
    await expect(page.getByText("Översikt")).toBeVisible();
  });

  test("shows logout button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Logga ut" })).toBeVisible();
  });

  test("shows refresh button", async ({ page }) => {
    await expect(page.getByTitle("Uppdatera")).toBeVisible();
  });

  // ── Stats row ─────────────────────────────────────────────────────────────

<<<<<<< HEAD
  test("stats row renders all three labels", async ({ page }) => {
    await expect(page.getByText("Anställda")).toBeVisible();
    await expect(page.getByText("Fortnox-kunder")).toBeVisible();
    await expect(page.getByText("E-postkopplingar")).toBeVisible();
=======
  test("stats row shows correct counts", async ({ page }) => {
    // 2 users, 2 customers
    const stats = page.locator(".dashboard-stats");
    await expect(stats.getByText("2").first()).toBeVisible(); // Anställda
    await expect(stats.getByText("Anställda")).toBeVisible();
    await expect(stats.getByText("Fortnox-kunder")).toBeVisible();
  });

  test("shows company name in topbar and sidebar", async ({ page }) => {
    await expect(page.getByText("ACME AB").first()).toBeVisible();
>>>>>>> 750ace22befb1d30c298859b548a834ccd17c6f7
  });

  // ── Employee table ────────────────────────────────────────────────────────

<<<<<<< HEAD
  test("employees section heading is visible", async ({ page }) => {
    await expect(
      page.locator(".dashboard-section__title").filter({ hasText: "Anställda" })
    ).toBeVisible();
  });

  test("each employee row has a Kunder button", async ({ page }) => {
    const buttons = page.locator(".ec-customers-btn");
    await expect(buttons.first()).toBeVisible();
  });
=======
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
>>>>>>> 750ace22befb1d30c298859b548a834ccd17c6f7

  test("clicking Kunder expands the employee panel", async ({ page }) => {
    const btn = page.locator(".ec-customers-btn").first();
    await btn.click();
    await expect(page.locator(".ec-employee-block--expanded")).toBeVisible();
  });

  test("clicking the same Kunder button again collapses the panel", async ({ page }) => {
    const btn = page.locator(".ec-customers-btn").first();
    await btn.click();
    await expect(page.locator(".ec-employee-block--expanded")).toBeVisible();
    await btn.click();
    await expect(page.locator(".ec-employee-block--expanded")).not.toBeVisible();
  });

  // ── Refresh ───────────────────────────────────────────────────────────────

  test("refresh button triggers a new GetInitPageIntegrationData request", async ({ page }) => {
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
    await page.waitForTimeout(500);
    expect(refetchCount).toBeGreaterThanOrEqual(1);
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  test("Fakturor nav link navigates to /invoices", async ({ page }) => {
    await page.getByRole("link", { name: "Fakturor" }).click();
    await expect(page).toHaveURL("/invoices");
  });

  test("Bokföring nav link navigates to /bookkeeping", async ({ page }) => {
    await page.getByRole("link", { name: "Bokföring" }).click();
    await expect(page).toHaveURL("/bookkeeping");
  });

  // ── Logout ────────────────────────────────────────────────────────────────

  test("logout redirects to login page", async ({ page }) => {
    await page.getByRole("button", { name: "Logga ut" }).click();
    await expect(page).toHaveURL("/");
  });
});