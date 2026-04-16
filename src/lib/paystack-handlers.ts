import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { SubscriptionSuccessEmail } from "@/components/emails/SubscriptionSuccessEmail";
import SubscriptionRenewedEmail from "@/components/emails/SubscriptionRenewedEmail";
import SubscriptionPaymentFailedEmail from "@/components/emails/SubscriptionPaymentFailedEmail";
import SubscriptionCancelledEmail from "@/components/emails/SubscriptionCancelledEmail";
import { updateSubscription } from "@/app/(main)/actions/subscription";

export async function handleChargeSuccess(data: any) {
  const reference = data.reference as string;
  const email = data.customer?.email as string | undefined;

  if (!reference || !email) {
    console.error("charge.success: missing reference or customer email", { reference, email });
    return;
  }

  // Short-circuit before hitting Paystack's API or doing a user lookup.
  const existingTransaction = await prisma.paymentTransaction.findUnique({
    where: { reference },
    select: { id: true },
  });

  if (existingTransaction) {
    console.log(`charge.success: transaction ${reference} already processed`);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    console.error(`charge.success: no user found for email ${email}`);
    return;
  }

  const { updated, tier, subscriptionPeriodEnd } = await updateSubscription(reference, user.id);

  if (!updated) {
    // Already processed by the frontend's onSuccess — no email needed.
    return;
  }

  // No `data.metadata` means Paystack initiated the charge (automated renewal),
  // not the user via the frontend popup.
  const isAutomatedRenewal = !data.metadata;
  const periodEnd = subscriptionPeriodEnd ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  if (isAutomatedRenewal) {
    await sendEmail({
      to: user.email,
      subject: "Subscription Renewed Successfully",
      react: SubscriptionRenewedEmail({
        userName: user.name || "Learner",
        subscriptionTier: tier,
        nextBillingDate: periodEnd.toLocaleDateString(),
      }) as any,
    });
  } else {
    await sendEmail({
      to: user.email,
      subject: "Your Algora Subscription",
      react: SubscriptionSuccessEmail({
        userName: user.name || "Learner",
        planName: tier,
      }) as any,
    });
  }
}

export async function handleChargeFailed(data: any) {
  const reference = data.reference as string | undefined;
  const email = data.customer?.email as string | undefined;

  if (!email) return;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, subscriptionTier: true },
  });

  if (!user || user.subscriptionTier === "FREE") return;

  if (reference) {
    const existingFailure = await prisma.paymentTransaction.findUnique({
      where: { reference },
      select: { id: true },
    });
    if (existingFailure) return;

    await prisma.paymentTransaction.create({
      data: {
        userId: user.id,
        reference,
        paystackTransactionId: data.id?.toString(),
        amount: (data.amount || 0) / 100,
        status: "failed",
        reason: data.gateway_response || data.message || "Payment failed via webhook",
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "PAYMENT_FAILED",
      entityType: "TRANSACTION",
      entityId: reference || "unknown",
      metadata: {
        amount: (data.amount || 0) / 100,
        reason: data.gateway_response || data.message || "Payment failed via webhook",
      },
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Action Required: Subscription Payment Failed",
    react: SubscriptionPaymentFailedEmail({
      userName: user.name || "there",
      subscriptionTier: user.subscriptionTier,
    }) as any,
  });
}

export async function handleSubscriptionDisable(data: any, event: string) {
  const email = data.customer?.email as string | undefined;
  if (!email) return;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, subscriptionTier: true },
  });

  if (!user || user.subscriptionTier === "FREE") return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: "FREE",
      subscriptionId: null,
      cancelAtPeriodEnd: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "SUBSCRIPTION_CANCELLED",
      entityType: "SUBSCRIPTION",
      metadata: { source: "paystack_webhook", event },
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Your Subscription Has Been Cancelled",
    react: SubscriptionCancelledEmail({
      userName: user.name || "there",
    }) as any,
  });
}
