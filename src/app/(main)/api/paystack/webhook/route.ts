import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackSignature, verifyTransaction } from "@/lib/paystack";
import { sendEmail } from "@/lib/email";
import { SubscriptionSuccessEmail } from "@/components/emails/SubscriptionSuccessEmail";
import { updateSubscription } from "@/app/(main)/actions/subscription";

export async function POST(req: Request) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // Only verify signature if it exists. If it doesn't, we assume it's an internal call
  // and proceed to verify transaction reference with Paystack API.
  if (signature && !verifyPaystackSignature(bodyText, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const body = JSON.parse(bodyText);
  const event = body.event;

  if (event === "charge.success") {
    const reference = body.data.reference;

    // Check if the transaction has already been processed to save an API call to Paystack.
    // This also mitigates any impact from replaying cURL commands.
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

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error("User not found");

      const { updated, tier } = await updateSubscription(reference, user.id);

      if (updated) {
        await sendEmail({
          to: email,
          subject: "Your Algora Subscription",
          react: SubscriptionSuccessEmail({
            userName: user.name || "Learner",
            planName: tier,
          }) as any,
        });
      } else {
        console.log("Subscription already processed, skipping email");
      }
    } catch (error) {
      console.error("Webhook error & Error updating subscription:", error);
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
