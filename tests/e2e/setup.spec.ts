/**
 * setup.spec.ts
 *
 * Runs as the "setup" project (before all other test projects).
 * Logs in as each test persona and saves the browser storage state
 * so subsequent test files can skip the login flow entirely.
 */

import { test as setup } from "@playwright/test";
import { TEST_USERS } from "./global-setup";
import { AUTH_STATE_PATHS, loginAs } from "./helpers/auth";

setup("authenticate as free learner", async ({ page }) => {
  await loginAs(page, TEST_USERS.learner.email, TEST_USERS.learner.password);
  await page.context().storageState({ path: AUTH_STATE_PATHS.learner });
});

setup("authenticate as basic learner", async ({ page }) => {
  await loginAs(
    page,
    TEST_USERS.basicLearner.email,
    TEST_USERS.basicLearner.password,
  );
  await page.context().storageState({ path: AUTH_STATE_PATHS.basicLearner });
});

setup("authenticate as tutor", async ({ page }) => {
  await loginAs(page, TEST_USERS.tutor.email, TEST_USERS.tutor.password);
  await page.context().storageState({ path: AUTH_STATE_PATHS.tutor });
});
