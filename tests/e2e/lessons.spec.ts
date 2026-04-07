import { test, expect } from "@playwright/test";
import { TEST_IDS } from "./global-setup";
import { AUTH_STATE_PATHS } from "./helpers/auth";

const VIDEO_LESSON_URL = `/tracks/${TEST_IDS.track}/lessons/${TEST_IDS.videoLesson}`;
const TEXT_LESSON_URL = `/tracks/${TEST_IDS.track}/lessons/${TEST_IDS.textLesson}`;

// ── Unauthenticated access ────────────────────────────────────────────────────
test.describe("Lessons – unauthenticated", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("lesson page redirects unauthenticated user to sign-in", async ({
    page,
  }) => {
    await page.goto(VIDEO_LESSON_URL);
    await page.waitForURL(/\/auth\/signin/, { timeout: 10_000 });
  });
});

// ── Video lesson ──────────────────────────────────────────────────────────────
test.describe("Lessons – video playback", () => {
  test.use({ storageState: AUTH_STATE_PATHS.learner });

  test("video lesson page loads without error", async ({ page }) => {
    await page.goto(VIDEO_LESSON_URL);
    await expect(page).toHaveURL(new RegExp(TEST_IDS.videoLesson));
    await expect(page.locator("body")).not.toContainText(
      /something went wrong|not found|error/i,
    );
  });

  test("video lesson renders the lesson title", async ({ page }) => {
    await page.goto(VIDEO_LESSON_URL);
    await expect(
      page.getByRole("heading", { name: /E2E Video Lesson/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("video lesson renders a YouTube iframe or Plyr container", async ({
    page,
  }) => {
    await page.goto(VIDEO_LESSON_URL);
    // Either an iframe (YouTube embed) or a plyr wrapper div must be present
    const videoContainer = page
      .locator('iframe[src*="youtube"], .plyr, [data-plyr-provider]')
      .first();
    await expect(videoContainer).toBeVisible({ timeout: 15_000 });
  });

  test("video lesson page shows prev/next navigation controls", async ({
    page,
  }) => {
    await page.goto(VIDEO_LESSON_URL);
    // At least one navigation control (prev or next) must exist
    const navControl = page
      .getByRole("link", { name: /previous|next/i })
      .or(page.locator('[aria-label*="next"], [aria-label*="prev"]'))
      .first();
    await expect(navControl).toBeVisible({ timeout: 10_000 });
  });
});

// ── Text lesson ───────────────────────────────────────────────────────────────
test.describe("Lessons – text content", () => {
  test.use({ storageState: AUTH_STATE_PATHS.learner });

  test("text lesson page loads without error", async ({ page }) => {
    await page.goto(TEXT_LESSON_URL);
    await expect(page).toHaveURL(new RegExp(TEST_IDS.textLesson));
    await expect(page.locator("body")).not.toContainText(
      /something went wrong|not found/i,
    );
  });

  test("text lesson renders markdown content", async ({ page }) => {
    await page.goto(TEXT_LESSON_URL);
    // The seeded text content starts with "# E2E Test Content"
    await expect(page.getByText(/E2E Test Content/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("text lesson renders the lesson title in heading", async ({ page }) => {
    await page.goto(TEXT_LESSON_URL);
    await expect(
      page.getByRole("heading", { name: /E2E Text Lesson/i }),
    ).toBeVisible({ timeout: 10_000 });
  });
});

// ── Track / module navigation ─────────────────────────────────────────────────
test.describe("Lessons – track navigation", () => {
  test.use({ storageState: AUTH_STATE_PATHS.learner });

  test("navigating to the track page shows the enrolled track", async ({
    page,
  }) => {
    await page.goto(`/tracks/${TEST_IDS.track}`);
    await expect(
      page.getByRole("heading", { name: /E2E Test Track/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("lesson breadcrumb contains a link back to the track", async ({
    page,
  }) => {
    await page.goto(VIDEO_LESSON_URL);
    // A link pointing to the parent track must exist in the page
    const trackLink = page.locator(`a[href*="${TEST_IDS.track}"]`).first();
    await expect(trackLink).toBeVisible({ timeout: 10_000 });
  });
});

// ── Progress marking ──────────────────────────────────────────────────────────
test.describe("Lessons – progress tracking API", () => {
  test.use({ storageState: AUTH_STATE_PATHS.learner });

  test("POST /api/progress marks a lesson complete and returns 200", async ({
    request,
  }) => {
    const res = await request.post("/api/progress", {
      data: { lessonId: TEST_IDS.textLesson },
    });

    // Accept 200 (new completion) or 409/200 if already marked
    expect([200, 201, 409]).toContain(res.status());
  });
});
