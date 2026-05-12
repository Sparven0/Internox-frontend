import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

const EMAIL = process.env.TEST_EMAIL ?? "";
const PASSWORD = process.env.TEST_PASSWORD ?? "";
const DOMAIN = process.env.TEST_DOMAIN ?? "";

if (!EMAIL || !PASSWORD || !DOMAIN) {
  throw new Error(
    "Missing test credentials. Set TEST_EMAIL, TEST_PASSWORD, TEST_DOMAIN in your .env file."
  );
}

setup("authenticate", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("E-post").fill(EMAIL);
  await page.getByLabel("Lösenord").fill(PASSWORD);
  await page.getByLabel("Företagsdomän").fill(DOMAIN);
  await page.getByRole("button", { name: "Logga in" }).click();

  // Wait for navigation to complete and page to fully settle
  await page.waitForURL(/(dashboard|admin|setup)/);
  await page.waitForLoadState("networkidle");

  // Save session cookie so all other tests skip login
  await page.context().storageState({ path: authFile });
});
