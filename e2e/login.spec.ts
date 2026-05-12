import { test, expect } from "@playwright/test";

// These tests run without the saved auth state
test.use({ storageState: { cookies: [], origins: [] } });

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

  test("shows error message on invalid credentials", async ({ page }) => {
    await page.route("**/graphql", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          errors: [{ message: "Ogiltiga inloggningsuppgifter" }],
        }),
      }),
    );

    await page.getByLabel("E-post").fill("wrong@example.com");
    await page.getByLabel("Lösenord").fill("wrongpassword");
    await page.getByLabel("Företagsdomän").fill("example.com");
    await page.getByRole("button", { name: "Logga in" }).click();

    await expect(page.getByText("Ogiltiga inloggningsuppgifter")).toBeVisible();
    await expect(page).toHaveURL("/");
  });

  test("redirects to /setup when onboarding is incomplete", async ({
    page,
  }) => {
    await page.route("**/graphql", async (route) => {
      const { operationName } = route.request().postDataJSON();
      if (operationName === "Login")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { login: { companyId: "c-1" } } }),
        });
      if (operationName === "GetOnboardingStatus")
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              getOnboardingStatus: {
                hasFortnox: false,
                hasEmployees: false,
                isComplete: false,
              },
            },
          }),
        });
      return route.continue();
    });

    await page.getByLabel("E-post").fill("new@foretaget.se");
    await page.getByLabel("Lösenord").fill("password");
    await page.getByLabel("Företagsdomän").fill("foretaget.se");
    await page.getByRole("button", { name: "Logga in" }).click();

    await page.waitForURL("/setup");
    await expect(page).toHaveURL("/setup");
  });

  test("unauthenticated user is redirected to / from protected routes", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/");
  });
});
