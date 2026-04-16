import { NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/paystack";
import {
  handleChargeSuccess,
  handleChargeFailed,
  handleSubscriptionDisable,
} from "@/lib/paystack-handlers";

export async function POST(req: Request) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature || !verifyPaystackSignature(bodyText, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const { event, data } = JSON.parse(bodyText);

  console.log(`Paystack webhook received: ${event} for reference: ${data?.reference}`);

  try {
    switch (event) {
      case "charge.success": {
        const result = await handleChargeSuccess(data);
        if (result?.alreadyProcessed) {
          return NextResponse.json({ message: "Transaction already processed" }, { status: 200 });
        }
        break;
      }
      case "invoice.payment_failed":
      case "charge.failed":
        await handleChargeFailed(data);
        break;
      case "subscription.disable":
      case "subscription.not_renew":
        await handleSubscriptionDisable(data, event);
        break;
    }
  } catch (error) {
    // Log but return 200 — Paystack retries on non-2xx, which would cause duplicate processing.
    // Monitor this in CloudWatch and alert on repeated failures.
    console.error(`Webhook handler error for event "${event}":`, error);
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
