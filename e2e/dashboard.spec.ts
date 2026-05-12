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

  test("stats row renders all three labels", async ({ page }) => {
    await expect(page.getByText("Anställda")).toBeVisible();
    await expect(page.getByText("Fortnox-kunder")).toBeVisible();
    await expect(page.getByText("E-postkopplingar")).toBeVisible();
  });

  // ── Employee table ────────────────────────────────────────────────────────

  test("employees section heading is visible", async ({ page }) => {
    await expect(
      page.locator(".dashboard-section__title").filter({ hasText: "Anställda" })
    ).toBeVisible();
  });

  test("each employee row has a Kunder button", async ({ page }) => {
    const buttons = page.locator(".ec-customers-btn");
    await expect(buttons.first()).toBeVisible();
  });

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