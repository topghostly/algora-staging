import crypto from "crypto";

/**
 * Generates a valid x-paystack-signature HMAC-SHA512 header value
 * using the PAYSTACK_SECRET_KEY environment variable.
 */
export function signPaystackPayload(payload: string): string {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return crypto.createHmac("sha512", secret).update(payload).digest("hex");
}

export function buildChargeSuccessPayload(
  reference: string,
  customerEmail: string,
  planCode: string,
  metadata?: Record<string, unknown>,
) {
  return {
    event: "charge.success",
    data: {
      reference,
      status: "success",
      customer: { email: customerEmail },
      plan: { plan_code: planCode },
      metadata: metadata ?? { source: "e2e-test" },
      next_payment_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
  };
}

export function buildChargeFailedPayload(customerEmail: string) {
  return {
    event: "charge.failed",
    data: {
      status: "failed",
      customer: { email: customerEmail },
    },
  };
}

export function buildSubscriptionDisablePayload(customerEmail: string) {
  return {
    event: "subscription.disable",
    data: {
      customer: { email: customerEmail },
    },
  };
}
