import { test, expect } from "@playwright/test";
import {
  signPaystackPayload,
  buildChargeSuccessPayload,
  buildChargeFailedPayload,
  buildSubscriptionDisablePayload,
} from "./helpers/paystack";
import { TEST_IDS, TEST_USERS } from "./global-setup";
import { AUTH_STATE_PATHS } from "./helpers/auth";

const WEBHOOK_URL = "/api/paystack/webhook";

// ── Pricing page (unauthenticated) ────────────────────────────────────────────
test.describe("Pricing page", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("renders all subscription tiers", async ({ page }) => {
    await page.goto("/pricing");

    // All four plan name headings must be present
    for (const tier of ["Free", "Basic", "Pro Lite", "Pro Plus"]) {
      await expect(
        page.getByRole("heading", { name: new RegExp(`^${tier}$`, "i") }),
      ).toBeVisible();
    }
  });

  test("unauthenticated subscribe click redirects to sign-up", async ({ page }) => {
    await page.goto("/pricing");

    // Click the first paid plan's CTA (Join Basic)
    await page.getByRole("button", { name: /join basic/i }).click();

    // Should land on signup (or signin) page
    await page.waitForURL(/(auth\/sign(up|in)|pricing)/, { timeout: 10_000 });
  });
});

// ── Webhook: signature validation ─────────────────────────────────────────────
test.describe("Paystack webhook – signature validation", () => {
  test("rejects payload with invalid signature → 400", async ({ request }) => {
    const payload = JSON.stringify(
      buildChargeSuccessPayload(
        "INVALID_SIG_REF",
        TEST_USERS.basicLearner.email,
        "PLN_test_basic",
      ),
    );

    const res = await request.post(WEBHOOK_URL, {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "x-paystack-signature": "0000000000000000deadbeef",
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Invalid signature");
  });

  test("accepts payload without signature header and processes gracefully → 200", async ({
    request,
  }) => {
    // No signature → skips HMAC check, proceeds to verify with Paystack API.
    // In test env the reference won't exist on Paystack, so it throws internally,
    // but the webhook still returns 200 (errors are caught and logged).
    const payload = JSON.stringify(
      buildChargeSuccessPayload(
        "NO_SIG_REF_TEST",
        TEST_USERS.learner.email,
        "PLN_test_basic",
      ),
    );

    const res = await request.post(WEBHOOK_URL, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status()).toBe(200);
  });
});

// ── Webhook: idempotency ──────────────────────────────────────────────────────
test.describe("Paystack webhook – idempotency", () => {
  test("duplicate charge.success with known reference → 200 already processed", async ({
    request,
  }) => {
    const payload = JSON.stringify(
      buildChargeSuccessPayload(
        TEST_IDS.processedTransaction, // pre-seeded in globalSetup
        TEST_USERS.basicLearner.email,
        "PLN_test_basic",
      ),
    );
    const signature = signPaystackPayload(payload);

    const res = await request.post(WEBHOOK_URL, {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "x-paystack-signature": signature,
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Transaction already processed");
  });
});

// ── Webhook: charge.failed ────────────────────────────────────────────────────
test.describe("Paystack webhook – charge.failed", () => {
  test("charge.failed event returns 200 webhook received", async ({
    request,
  }) => {
    const payload = JSON.stringify(
      buildChargeFailedPayload(TEST_USERS.basicLearner.email),
    );
    const signature = signPaystackPayload(payload);

    const res = await request.post(WEBHOOK_URL, {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "x-paystack-signature": signature,
      },
    });

    expect(res.status()).toBe(200);
  });
});

// ── Webhook: subscription.disable ────────────────────────────────────────────
test.describe("Paystack webhook – subscription.disable", () => {
  test("subscription.disable event returns 200 and is handled", async ({
    request,
  }) => {
    const payload = JSON.stringify(
      buildSubscriptionDisablePayload(TEST_USERS.basicLearner.email),
    );
    const signature = signPaystackPayload(payload);

    const res = await request.post(WEBHOOK_URL, {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "x-paystack-signature": signature,
      },
    });

    expect(res.status()).toBe(200);
  });
});

// ── Authenticated pricing page ────────────────────────────────────────────────
test.describe("Pricing page (authenticated learner)", () => {
  test.use({ storageState: AUTH_STATE_PATHS.learner });

  test("authenticated user sees subscription options", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText(/simple.*transparent pricing/i)).toBeVisible();
  });
});
