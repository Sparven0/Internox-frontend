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
          data: { login: { companyId: "b8ba5b4d_10ff_443f_93ee_e629ad36ca02" } },
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
          data: { getUsersByCompanyId: [{ id: "61943543-5897-4ea2-8844-7f615a199293" }] },
        }),
      });
    }

    return route.continue();
  });

  async function wait(){
    return new Promise(resolve => setTimeout(resolve, 3000));
  }

  await page.goto("/");
  await page.getByLabel("E-post").fill("admin@acme.com");
  await page.getByLabel("Lösenord").fill("admin");
  await page.getByLabel("Företagsdomän").fill("gmail.com");
  await page.getByRole("button", { name: "Logga in" }).click();

  await wait();

  await page.waitForURL("/dashboard");

  // Save cookies/storage so other tests skip login
  await page.context().storageState({ path: authFile });
});
