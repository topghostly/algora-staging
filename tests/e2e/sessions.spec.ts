import { test, expect } from "@playwright/test";
import { AUTH_STATE_PATHS } from "./helpers/auth";

// ── Tutor: session list page ───────────────────────────────────────────────────
test.describe("Tutor – sessions page", () => {
  test.use({ storageState: AUTH_STATE_PATHS.tutor });

  test("tutor can view their sessions page", async ({ page }) => {
    await page.goto("/tutor/sessions");
    await expect(page).toHaveURL(/\/tutor\/sessions/);
    // Page should load without redirect to login
    await expect(page.locator("body")).not.toContainText(/sign in|log in/i);
  });

  test("tutor can navigate to create-session page", async ({ page }) => {
    await page.goto("/tutor/sessions");
    const newSessionLink = page.getByRole("link", {
      name: /new session|create session/i,
    });
    await expect(newSessionLink).toBeVisible({ timeout: 10_000 });
    await newSessionLink.click();
    await page.waitForURL(/\/tutor\/sessions\/new/, { timeout: 10_000 });
  });
});

// ── Tutor: session creation API (without calendar) ────────────────────────────
test.describe("Tutor – session creation API", () => {
  test.use({ storageState: AUTH_STATE_PATHS.tutor });

  test("creating a session without Google Calendar connected → 401", async ({
    request,
  }) => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const start = tomorrow.toISOString();
    const end = new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString();

    const res = await request.post("/api/session/create", {
      data: {
        startTime: start,
        endTime: end,
        type: "GROUP",
        title: "E2E Test Group Session",
      },
    });

    // Tutor test user has no calendar connected
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/google calendar not connected/i);
  });

  test("creating a session without required fields → 400", async ({
    request,
  }) => {
    const res = await request.post("/api/session/create", {
      data: { type: "GROUP", title: "Missing Times" },
    });

    expect(res.status()).toBe(400);
  });
});

// ── Learner: browse sessions (FREE tier — sees upgrade gate) ──────────────────
test.describe("Learner – browse sessions (FREE)", () => {
  test.use({ storageState: AUTH_STATE_PATHS.learner });

  test("browse-sessions page loads without redirecting to sign-in", async ({
    page,
  }) => {
    await page.goto("/dashboard/sessions/browse");
    await expect(page).toHaveURL(/\/dashboard\/sessions\/browse/);
    await expect(page.locator("body")).not.toContainText(/sign in|log in/i);
  });
});

// ── Learner: browse sessions (BASIC tier — can see session list) ───────────────
test.describe("Learner – browse sessions (BASIC)", () => {
  test.use({ storageState: AUTH_STATE_PATHS.basicLearner });

  test("seeded group session appears in browse list", async ({ page }) => {
    await page.goto("/dashboard/sessions/browse");
    await expect(page.getByText(/E2E Group Session/i)).toBeVisible({
      timeout: 10_000,
    });
  });
});

// ── Session booking – FREE learner restrictions ───────────────────────────────
test.describe("Session booking – FREE learner restrictions", () => {
  test.use({ storageState: AUTH_STATE_PATHS.learner });

  test("FREE learner sees upgrade gate instead of book button on browse page", async ({
    page,
  }) => {
    await page.goto("/dashboard/sessions/browse");
    await expect(page).toHaveURL(/\/dashboard\/sessions\/browse/);

    // FREE tier should show an upgrade prompt, not a functional book button
    await expect(
      page.getByRole("link", { name: /upgrade your plan/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});

// ── Session booking API: BASIC learner ────────────────────────────────────────
test.describe("Session booking – BASIC learner", () => {
  test.use({ storageState: AUTH_STATE_PATHS.basicLearner });

  test("BASIC learner dashboard/sessions page loads", async ({ page }) => {
    await page.goto("/dashboard/sessions");
    await expect(page).toHaveURL(/\/dashboard\/sessions/);
  });

  // test("duplicate enrollment is prevented", async ({ request }) => {
  //   // Enroll once (may succeed or fail depending on state)
  //   await request.post("/api/session/book", {
  //     data: { sessionId: TEST_IDS.groupSession },
  //   });

  //   // Second enrollment attempt must fail
  //   const res2 = await request.post("/api/session/book", {
  //     data: { sessionId: TEST_IDS.groupSession },
  //   });

  //   expect([400, 403, 409]).toContain(res2.status());
  // });
});

// ── Session request page ───────────────────────────────────────────────────────
test.describe("Learner – 1-on-1 session request", () => {
  test.use({ storageState: AUTH_STATE_PATHS.basicLearner });

  test("session request page loads for eligible learner", async ({ page }) => {
    await page.goto("/dashboard/sessions/request");
    await expect(page).toHaveURL(/\/dashboard\/sessions\/request/);
    await expect(page.locator("body")).not.toContainText(/sign in/i);
  });
});

// ── Unauthenticated access guard ──────────────────────────────────────────────
test.describe("Session pages – unauthenticated", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("browse sessions redirects to sign-in when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard/sessions/browse");
    await page.waitForURL(/\/auth\/signin/, { timeout: 10_000 });
  });
});
