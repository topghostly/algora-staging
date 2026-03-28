"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubscriptionTier } from "@prisma/client";

import {
  verifyTransaction,
  getSubscription,
  disableSubscription,
} from "@/lib/paystack";
import { revalidatePath } from "next/cache";

export async function updateSubscription(reference: string, userId: string) {
  console.log("Updating subscription for user", userId);
  // const session = await getServerSession(authOptions);

  // if (!session?.user?.id) {
  //   throw new Error("Unauthorized");
  // }

  const existing = await prisma.paymentTransaction.findUnique({
    where: { reference },
    select: { planCode: true },
  });

  if (existing) {
    // Map planCode back to tier for the response
    let tier: SubscriptionTier = "FREE";
    if (existing.planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BASIC) tier = "BASIC";
    else if (existing.planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_LITE) tier = "PRO_LITE";
    else if (existing.planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_PLUS) tier = "PRO_PLUS";

    return { success: true, updated: false, tier };
  }

  // 1. Verify transaction with Paystack
  const verification = await verifyTransaction(reference);

  if (!verification.status || verification.data.status !== "success") {
    throw new Error("Payment verification failed");
  }

  // Security check: Ensure the transaction email matches the user we are updating
  // This prevents Insecure Direct Object Reference (IDOR) attacks
  const paystackEmail = verification.data.customer.email;
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!targetUser || targetUser.email.toLowerCase() !== paystackEmail.toLowerCase()) {
    console.error("Security Alert: User email mismatch", {
      providedUserId: userId,
      targetUserEmail: targetUser?.email,
      paystackEmail,
    });
    throw new Error("User mismatch: This transaction does not belong to the intended user.");
  }

  const planCode = verification.data.plan;
  const amount = verification.data.amount / 100;
  const paystackTransactionId = verification.data.id.toString();

  console.log("The verification worked", verification);

  // 2. Map plan to tier and credits
  let tier: SubscriptionTier = "FREE";
  let creditsToAdd = 0;

  if (planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BASIC) {
    tier = "BASIC";
    creditsToAdd = 0;
  } else if (planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_LITE) {
    tier = "PRO_LITE";
    creditsToAdd = 1;
  } else if (planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_PLUS) {
    tier = "PRO_PLUS";
    creditsToAdd = 4;
  }

  if (tier === "FREE") {
    throw new Error("Invalid plan code or plan not recognized");
  }

  // Use a transaction to ensure both user update and transaction logging succeed
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        subscriptionId: verification.data.subscription_code || null,
        credits1on1: {
          increment: creditsToAdd,
        },
      },
    });

    await tx.paymentTransaction.create({
      data: {
        userId: userId,
        reference: reference,
        paystackTransactionId: paystackTransactionId,
        amount: amount,
        status: verification.data.status,
        planCode: planCode,
      },
    });

    return user;
  });

  revalidatePath("/pricing");
  revalidatePath("/dashboard");

  return { success: true, updated: true, tier };
  // return { success: true, user: result };
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
    select: { subscriptionId: true },
  });

  if (!user?.subscriptionId) {
    throw new Error("No active subscription found");
  }

  // 1. Fetch subscription to get the email token
  const subscription = await getSubscription(user.subscriptionId);

  if (subscription.status && subscription.data?.email_token) {
    // 2. Disable subscription in Paystack
    await disableSubscription(
      user.subscriptionId,
      subscription.data.email_token,
    );
  } else {
    console.warn(
      "Could not retrieve email_token for subscription, might already be disabled or invalid.",
    );
  }

  // 3. Update user record in database to FREE
  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      subscriptionTier: "FREE",
      subscriptionId: null,
    },
  });

  revalidatePath("/pricing");

  return { success: true };
  // return { success: true, user: updatedUser };
}
