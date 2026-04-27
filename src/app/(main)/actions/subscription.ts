"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubscriptionTier } from "@prisma/client";
import { withRetry } from "@/lib/db-utils";

import {
  verifyTransaction,
  getSubscription,
  disableSubscription,
  listSubscriptions,
} from "@/lib/paystack";
import { revalidatePath } from "next/cache";

const ALLOWED_PLANS: Record<
  string,
  { tier: SubscriptionTier; credits: number }
> = {
  [process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BASIC!]: { tier: "BASIC", credits: 0 },
  [process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_LITE!]: {
    tier: "PRO_LITE",
    credits: 1,
  },
  [process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_PLUS!]: {
    tier: "PRO_PLUS",
    credits: 4,
  },
};

export async function updateSubscription(
  reference: string,
  userId: string,
  subscriptionCodeOverride?: string,
) {
  console.log("Updating subscription for user", userId);

  const existing = await withRetry(() =>
    prisma.paymentTransaction.findUnique({
      where: { reference },
      select: { status: true, planCode: true },
    }),
  );

  // Only short-circuit if the transaction is already fully successful.
  // If it's "PENDING_VERIFICATION" or other intermediate states, we proceed to verify.
  if (existing?.status === "success" || existing?.status === "SUCCESS") {
    const plan = ALLOWED_PLANS[existing.planCode!];
    return {
      success: true,
      updated: false,
      tier: plan?.tier || "FREE",
      subscriptionPeriodEnd: null,
    };
  }

  // 1. Verify transaction with Paystack
  const verification = await verifyTransaction(reference);

  if (!verification.status || verification.data.status !== "success") {
    throw new Error("Payment verification failed");
  }

  // Security check: Ensure the transaction email matches the user we are updating
  // This prevents Insecure Direct Object Reference (IDOR) attacks
  const paystackEmail = verification.data.customer.email;
  const targetUser = await withRetry(() =>
    prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    }),
  );

  if (
    !targetUser ||
    targetUser.email.toLowerCase() !== paystackEmail.toLowerCase()
  ) {
    console.error("Security Alert: User email mismatch", {
      providedUserId: userId,
      targetUserEmail: targetUser?.email,
      paystackEmail,
    });
    throw new Error(
      "User mismatch: This transaction does not belong to the intended user.",
    );
  }

  const planCode = verification.data.plan;
  const amount = verification.data.amount / 100;
  const paystackTransactionId = verification.data.id.toString();
  const channel = verification.data.channel ?? null;
  const auth = verification.data.authorization ?? {};
  const authorizationCode = auth.authorization_code ?? null;
  const cardType = auth.card_type ?? null;
  const last4 = auth.last4 ?? null;
  const expMonth = auth.exp_month ?? null;
  const expYear = auth.exp_year ?? null;
  const bank = auth.bank ?? null;
  const customerCode = verification.data.customer?.customer_code ?? null;
  const paidAt = verification.data.paid_at
    ? new Date(verification.data.paid_at)
    : null;

  // 2. Map plan to tier and credits
  const plan = ALLOWED_PLANS[planCode];

  if (!plan) {
    throw new Error("Invalid plan code or plan not recognized");
  }

  const { tier, credits: creditsToAdd } = plan;

  const subscriptionPeriodEnd = verification.data.next_payment_date
    ? new Date(verification.data.next_payment_date)
    : null;

  // Use a transaction to ensure both user update and transaction logging succeed
  try {
    await withRetry(() =>
      prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: tier,
            subscriptionId:
              subscriptionCodeOverride ||
              verification.data.subscription_code ||
              null,
            subscriptionPeriodEnd: subscriptionPeriodEnd,
            cancelAtPeriodEnd: false,
            credits1on1: creditsToAdd,
          },
        });

        await tx.paymentTransaction.upsert({
          where: { reference: reference },
          update: {
            status: verification.data.status,
            paystackTransactionId: paystackTransactionId,
            paidAt,
            channel,
            authorizationCode,
            cardType,
            last4,
            expMonth,
            expYear,
            bank,
            customerCode,
          },
          create: {
            userId: userId,
            reference: reference,
            paystackTransactionId: paystackTransactionId,
            amount: amount,
            status: verification.data.status,
            planCode: planCode,
            channel,
            authorizationCode,
            cardType,
            last4,
            expMonth,
            expYear,
            bank,
            customerCode,
            paidAt,
          },
        });

        await tx.activityLog.create({
          data: {
            userId: userId,
            action: "PAYMENT_SUCCESS",
            entityType: "TRANSACTION",
            entityId: paystackTransactionId,
            metadata: { amount, tier, planCode },
          },
        });
      }),
    );
  } catch (error: any) {
    // P2002 = unique constraint on `reference` — the webhook beat the frontend to it
    // (or vice versa). The record exists and the user is already upgraded; treat as success.
    if (error?.code === "P2002") {
      revalidatePath("/pricing");
      revalidatePath("/dashboard");
      return { success: true, updated: false, tier, subscriptionPeriodEnd };
    }
    throw error;
  }

  revalidatePath("/pricing");
  revalidatePath("/dashboard");

  return { success: true, updated: true, tier, subscriptionPeriodEnd };
}

/**
 * Manually trigger verification for a transaction.
 * Usually called from the UI when a transaction is stuck in "PENDING_VERIFICATION".
 */
export async function manualVerifyTransaction(reference: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await updateSubscription(reference, session.user.id);
}

export async function recordTransaction(details: {
  reference: string;
  amount: number;
  status: string;
  planCode?: string;
  paystackTransactionId?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.paymentTransaction.create({
    data: {
      userId: session.user.id,
      reference: details.reference,
      amount: details.amount,
      status: details.status,
      planCode: details.planCode,
      paystackTransactionId: details.paystackTransactionId,
    },
  });

  return { success: true };
}

export async function cancelSubscription() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionId: true, email: true },
  });

  let subscriptionId = user?.subscriptionId ?? null;

  // If subscriptionId is missing from DB, check Paystack directly before failing
  if (!subscriptionId) {
    if (!user?.email) throw new Error("No active subscription found");

    const paystackSubs = await listSubscriptions(user.email);
    const active = paystackSubs.data?.find((s) => s.status === "active");

    if (!active) {
      throw new Error("No active subscription found");
    }

    subscriptionId = active.subscription_code;

    // Persist it so future cancellations don't need to re-query
    await prisma.user.update({
      where: { id: session.user.id },
      data: { subscriptionId },
    });
  }

  // 1. Fetch subscription to get the email token
  const subscription = await getSubscription(subscriptionId);

  if (subscription.status && subscription.data?.email_token) {
    // 2. Disable subscription in Paystack
    await disableSubscription(subscriptionId, subscription.data.email_token);
  } else {
    console.warn(
      "Could not retrieve email_token for subscription, might already be disabled or invalid.",
    );
  }

  // 3. Update user record in database to set cancellation flag
  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      cancelAtPeriodEnd: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "SUBSCRIPTION_CANCELLED_BY_USER",
      entityType: "SUBSCRIPTION",
      metadata: {
        source: "dashboard_ui",
      },
    },
  });

  revalidatePath("/pricing");

  return { success: true };
  // return { success: true, user: updatedUser };
}
