import { test, expect } from "@playwright/test";
import { TEST_USERS } from "./global-setup";

test.describe("Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // unauthenticated

  // ── Sign-in page ────────────────────────────────────────────────────────────
  test("sign-in page renders required elements", async ({ page }) => {
    await page.goto("/auth/signin");

    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible();
    await expect(
      page.locator("main").getByPlaceholder("m@example.com"),
    ).toBeVisible();
    await expect(page.locator('main input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in with google/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /forgot your password/i }),
    ).toBeVisible();
  });

  // ── Invalid credentials ─────────────────────────────────────────────────────
  test("invalid credentials display an error and stay on sign-in", async ({
    page,
  }) => {
    await page.goto("/auth/signin");
    await page
      .locator("main")
      .getByPlaceholder("m@example.com")
      .pressSequentially("nobody@example.com");
    await page
      .locator('main input[type="password"]')
      .pressSequentially("wrongpassword");
    await page.click('button[type="submit"]');

    await expect(
      page.locator("p").filter({ hasText: /invalid email or password/i }),
    ).toBeVisible({ timeout: 10_000 });
    expect(page.url()).toContain("/auth/signin");
  });

  // ── Learner login → /dashboard ──────────────────────────────────────────────
  // test("learner credentials redirect to /dashboard", async ({ page }) => {
  //   await page.goto("/auth/signin");
  //   await page
  //     .locator("main")
  //     .getByPlaceholder("m@example.com")
  //     .pressSequentially(TEST_USERS.learner.email);
  //   await page
  //     .locator('main input[type="password"]')
  //     .pressSequentially(TEST_USERS.learner.password);
  //   await page.click('button[type="submit"]');

  //   await page.waitForURL(
  //     /(\/dashboard|\/auth\/select-role|\/auth\/redirect)/,
  //     {
  //       timeout: 15_000,
  //     },
  //   );
  //   // If landed on select-role the session role wasn't ready yet — still counts as auth success
  //   expect(page.url()).toMatch(
  //     /(\/dashboard|\/auth\/select-role|\/auth\/redirect)/,
  //   );
  // });

  // ── Tutor login → /tutor ────────────────────────────────────────────────────
  // test("tutor credentials redirect to /tutor", async ({ page }) => {
  //   await page.goto("/auth/signin");
  //   await page
  //     .locator("main")
  //     .getByPlaceholder("m@example.com")
  //     .pressSequentially(TEST_USERS.tutor.email);
  //   await page
  //     .locator('main input[type="password"]')
  //     .pressSequentially(TEST_USERS.tutor.password);
  //   await page.click('button[type="submit"]');

  //   // Wait for any post-auth landing (role-select or direct tutor redirect)
  //   await page.waitForURL(/(\/tutor|\/auth\/select-role|\/auth\/redirect)/, {
  //     timeout: 15_000,
  //   });
  //   // If landed on select-role the session role wasn't ready yet — still counts as auth success
  //   expect(page.url()).toMatch(
  //     /(\/tutor|\/auth\/select-role|\/auth\/redirect)/,
  //   );
  // });

  // ── Sign-up page ────────────────────────────────────────────────────────────
  test("sign-up page renders required fields", async ({ page }) => {
    await page.goto("/auth/signup");

    await expect(
      page.getByRole("heading", { name: /create account/i }),
    ).toBeVisible();
    await expect(page.locator('main input[type="text"]')).toBeVisible();
    await expect(
      page.locator("main").getByPlaceholder("m@example.com"),
    ).toBeVisible();
    await expect(page.locator('main input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /continue/i })).toBeVisible();
  });

  // ── Duplicate email registration ────────────────────────────────────────────
  // test("registering with an existing email returns an error", async ({
  //   page,
  // }) => {
  //   await page.goto("/auth/signup");
  //   await page.locator('main input[type="text"]').pressSequentially("Duplicate User");
  //   await page.getByPlaceholder("m@example.com").pressSequentially(TEST_USERS.learner.email);
  //   await page.locator('main input[type="password"]').pressSequentially("AnotherPass123!");
  //   await page.click('button[type="submit"]');

  //   await expect(
  //     page.getByText(/already exists|already registered|email.*taken/i),
  //   ).toBeVisible({ timeout: 10_000 });
  // });

  // ── Protected route redirects unauthenticated users ─────────────────────────
  test("protected route /dashboard redirects to sign-in when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/auth\/signin/, { timeout: 10_000 });
    expect(page.url()).toContain("/auth/signin");
  });

  test("protected route /tutor redirects to sign-in when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/tutor");
    await page.waitForURL(/\/auth\/signin/, { timeout: 10_000 });
    expect(page.url()).toContain("/auth/signin");
  });
});
