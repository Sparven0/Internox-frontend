import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Intercept the GraphQL login mutation
  await page.route("**/graphql", async (route) => {
    const body = route.request().postDataJSON();

    if (body?.operationName === "Login") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: { login: { companyId: "company-123" } },
        }),
      });
    }

    if (body?.operationName === "GetOnboardingStatus") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            getOnboardingStatus: {
              hasFortnox: true,
              hasEmployees: true,
              isComplete: true,
            },
          },
        }),
      });
    }

    if (body?.operationName === "GetUsersByCompanyId") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: { getUsersByCompanyId: [{ id: "user-1" }] },
        }),
      });
    }

    return route.continue();
  });

  await page.goto("/");
  await page.getByLabel("E-post").fill("admin@foretaget.se");
  await page.getByLabel("Lösenord").fill("password123");
  await page.getByLabel("Företagsdomän").fill("foretaget.se");
  await page.getByRole("button", { name: "Logga in" }).click();
  await page.waitForURL("/dashboard");

  // Save cookies/storage so other tests skip login
  await page.context().storageState({ path: authFile });
});
