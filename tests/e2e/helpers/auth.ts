import { expect, Page } from "@playwright/test";
import path from "path";

export const AUTH_STATE_PATHS = {
  learner: path.join(__dirname, "../.auth/learner.json"),
  basicLearner: path.join(__dirname, "../.auth/basic-learner.json"),
  tutor: path.join(__dirname, "../.auth/tutor.json"),
} as const;

/**
 * Performs a credentials login and waits for the post-auth redirect.
 * Returns the page after a successful navigation.
 */
export async function loginAs(
  page: Page,
  email: string,
  password: string,
  expectedUrlPattern: RegExp = /(dashboard|tutor|admin|select-role|redirect)/,
) {
  await page.goto("/auth/signin");
  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').pressSequentially(email);
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').pressSequentially(password);
  await page.click('button[type="submit"]');
  await page.waitForURL(expectedUrlPattern, { timeout: 15_000 });
}
