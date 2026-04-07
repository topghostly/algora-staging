import { test, expect } from "@playwright/test";
import { AUTH_STATE_PATHS } from "./helpers/auth";

const DISCONNECT_ENDPOINT = "/api/tutor/calendar/disconnect";
const SESSION_CREATE_ENDPOINT = "/api/session/create";

// ── Disconnect endpoint – unauthenticated ─────────────────────────────────────
test.describe("Google Calendar – disconnect endpoint (unauthed)", () => {
  test("unauthenticated request → 401", async ({ request }) => {
    const res = await request.post(DISCONNECT_ENDPOINT);
    expect(res.status()).toBe(401);
  });
});

// ── Disconnect endpoint – authenticated ───────────────────────────────────────
test.describe("Google Calendar – disconnect endpoint (authed)", () => {
  test.use({ storageState: AUTH_STATE_PATHS.tutor });

  test("authenticated tutor can call disconnect and receives success", async ({
    request,
  }) => {
    // The test tutor has no calendar connected; disconnect is still a valid
    // no-op call that clears null fields — it must return { success: true }.
    const res = await request.post(DISCONNECT_ENDPOINT);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});

// ── Session creation requires calendar ───────────────────────────────────────
test.describe("Google Calendar – session creation gate", () => {
  test.use({ storageState: AUTH_STATE_PATHS.tutor });

  test("session creation without calendar connected returns 401 with descriptive error", async ({
    request,
  }) => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const res = await request.post(SESSION_CREATE_ENDPOINT, {
      data: {
        startTime: tomorrow.toISOString(),
        endTime: new Date(tomorrow.getTime() + 3_600_000).toISOString(),
        type: "GROUP",
        title: "Calendar Gate Test Session",
      },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/google calendar not connected/i);
  });
});

// ── Tutor dashboard calendar UI ───────────────────────────────────────────────
test.describe("Google Calendar – tutor dashboard UI", () => {
  test.use({ storageState: AUTH_STATE_PATHS.tutor });

  test("tutor dashboard loads and shows calendar connection status", async ({
    page,
  }) => {
    await page.goto("/tutor");
    await expect(page).toHaveURL(/\/tutor/);

    // The dashboard must surface something about calendar connectivity
    const calendarIndicator = page
      .getByText(/connect.*calendar|calendar.*connected|google calendar/i)
      .first();
    await expect(calendarIndicator).toBeVisible({ timeout: 10_000 });
  });

  // test("create-session page shows calendar-required warning when not connected", async ({
  //   page,
  // }) => {
  //   await page.goto("/tutor/sessions/new");

  //   // Should either redirect away or show a connect-calendar prompt
  //   const calendarWarning = page.getByText(
  //     /connect.*calendar|calendar.*required|not connected/i,
  //   );
  //   const isOnPage = await calendarWarning
  //     .isVisible({ timeout: 5_000 })
  //     .catch(() => false);

  //   if (!isOnPage) {
  //     // Acceptable alternative: redirected away from the form
  //     expect(page.url()).not.toContain("/tutor/sessions/new");
  //   }
  // });
});

// ── Tutor sessions page shows seeded session ──────────────────────────────────
test.describe("Tutor – existing sessions list", () => {
  test.use({ storageState: AUTH_STATE_PATHS.tutor });

  test("seeded group session appears on tutor sessions page", async ({
    page,
  }) => {
    await page.goto("/tutor/sessions");
    await expect(page.getByText(/E2E Group Session/i)).toBeVisible({
      timeout: 10_000,
    });
  });
});
