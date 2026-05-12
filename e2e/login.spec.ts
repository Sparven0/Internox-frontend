import { test, expect } from "@playwright/test";

// These tests run without the saved auth state
test.use({ storageState: { cookies: [], origins: [] } });
const EMAIL = process.env.TEST_EMAIL ?? "";
const PASSWORD = process.env.TEST_PASSWORD ?? "";
const DOMAIN = process.env.TEST_DOMAIN ?? "";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the login form with all fields", async ({ page }) => {
    await expect(page.getByLabel("E-post")).toBeVisible();
    await expect(page.getByLabel("Lösenord")).toBeVisible();
    await expect(page.getByLabel("Företagsdomän")).toBeVisible();
    await expect(page.getByRole("button", { name: "Logga in" })).toBeVisible();
  });

  test("logs in successfully with valid credentials", async ({ page }) => {
    await page.getByLabel("E-post").fill(EMAIL);
    await page.getByLabel("Lösenord").fill(PASSWORD);
    await page.getByLabel("Företagsdomän").fill(DOMAIN);
    await page.getByRole("button", { name: "Logga in" }).click();

    await page.waitForURL(/(dashboard|admin)/);
    await expect(page).not.toHaveURL("/");
  });

  test("shows error message on invalid credentials", async ({ page }) => {
    await page.getByLabel("E-post").fill("nobody@invalid-domain-xyz.se");
    await page.getByLabel("Lösenord").fill("wrongpassword");
    await page.getByLabel("Företagsdomän").fill("invalid-domain-xyz.se");
    await page.getByRole("button", { name: "Logga in" }).click();

    // The backend should return an error — stay on login page
    await expect(page.locator(".login-error, [role='alert']")).toBeVisible();
    await expect(page).toHaveURL("/");
  });


  test("unauthenticated user is redirected to / from protected routes", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/");
  });
});
