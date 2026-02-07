"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubscriptionTier } from "@prisma/client";

export async function updateSubscription(
  tier: SubscriptionTier,
  subscriptionId: string,
  creditsToAdd: number,
  transactionDetails: {
    reference: string;
    paystackTransactionId: string;
    amount: number;
    planCode?: string;
    status: string;
  },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Use a transaction to ensure both user update and transaction logging succeed
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionTier: tier,
        subscriptionId: subscriptionId,
        credits1on1: {
          increment: creditsToAdd,
        },
      },
    });

    await tx.paymentTransaction.create({
      data: {
        userId: session.user.id,
        reference: transactionDetails.reference,
        paystackTransactionId: transactionDetails.paystackTransactionId,
        amount: transactionDetails.amount,
        status: transactionDetails.status,
        planCode: transactionDetails.planCode,
      },
    });

    return user;
  });

  return { success: true, user: result };
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
