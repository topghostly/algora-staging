import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackSignature, verifyTransaction } from "@/lib/paystack";
import { sendEmail } from "@/lib/email";
import { SubscriptionSuccessEmail } from "@/components/emails/SubscriptionSuccessEmail";
import { updateSubscription } from "@/app/(main)/actions/subscription";
import SubscriptionRenewedEmail from "@/components/emails/SubscriptionRenewedEmail";
import SubscriptionPaymentFailedEmail from "@/components/emails/SubscriptionPaymentFailedEmail";
import SubscriptionCancelledEmail from "@/components/emails/SubscriptionCancelledEmail";

export async function POST(req: Request) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // Verify that the Paystack signature is valid and present.
  if (!signature || !verifyPaystackSignature(bodyText, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const body = JSON.parse(bodyText);
  const { event, data } = body;

  switch (event) {
    case "charge.success": {
      const reference = data.reference;

      // Check if the transaction has already been processed to save an API call to Paystack.
      const existingTransaction = await prisma.paymentTransaction.findUnique({
        where: { reference },
      });

      if (existingTransaction) {
        return NextResponse.json(
          { message: "Transaction already processed" },
          { status: 200 },
        );
      }

      try {
        const verification = await verifyTransaction(reference);
        if (!verification.status) throw new Error("Verification failed");

        const email = verification.data.customer.email;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error("User not found");

        const { updated, tier } = await updateSubscription(reference, user.id);

        if (updated) {
          // Send renewal email if it is an automated charge (no frontend metadata), else send normal success email
          const isAutomatedRenewal = !data.metadata;
          const nextPaymentDateStr = verification.data.next_payment_date;
          const subscriptionPeriodEnd = nextPaymentDateStr
            ? new Date(nextPaymentDateStr)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          if (isAutomatedRenewal) {
            await sendEmail({
              to: email,
              subject: "Subscription Renewed Successfully",
              react: SubscriptionRenewedEmail({
                userName: user.name || "Learner",
                subscriptionTier: tier,
                nextBillingDate: subscriptionPeriodEnd.toLocaleDateString(),
              }) as any,
            });
          } else {
            await sendEmail({
              to: email,
              subject: "Your Algora Subscription",
              react: SubscriptionSuccessEmail({
                userName: user.name || "Learner",
                planName: tier,
              }) as any,
            });
          }
        } else {
          console.log("Subscription already processed, skipping email");
        }
      } catch (error) {
        console.error("Webhook error & Error updating subscription:", error);
      }
      break;
    }

    case "invoice.payment_failed":
    case "charge.failed": {
      const reference = data.reference;

      if (reference) {
        const existingFailure = await prisma.paymentTransaction.findUnique({
          where: { reference },
        });

        if (existingFailure) {
          break; // Already processed this failure
        }
      }

      const email = data.customer?.email;
      if (!email) break;

      const user = await prisma.user.findUnique({ where: { email } });

      if (user && user.subscriptionTier !== "FREE") {
        if (reference) {
          await prisma.paymentTransaction.create({
            data: {
              userId: user.id,
              reference: reference,
              paystackTransactionId: data.id?.toString(),
              amount: (data.amount || 0) / 100,
              status: "failed",
            },
          });
        }

        await sendEmail({
          to: user.email,
          subject: "Action Required: Subscription Payment Failed",
          react: SubscriptionPaymentFailedEmail({
            userName: user.name || "there",
            subscriptionTier: user.subscriptionTier,
          }) as any,
        });
      }
      break;
    }

    case "subscription.disable":
    case "subscription.not_renew": {
      const email = data.customer?.email;
      if (!email) break;
      const user = await prisma.user.findUnique({ where: { email } });

      // Ensure we only process if the user is not already FREE to avoid duplicate emails
      if (user && user.subscriptionTier !== "FREE") {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: "FREE",
            subscriptionId: null,
            cancelAtPeriodEnd: true,
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
      break;
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
