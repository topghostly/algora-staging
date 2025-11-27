import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackSignature } from "@/lib/paystack";
import { sendEmail } from "@/lib/email";
import { SubscriptionSuccessEmail } from "@/components/emails/SubscriptionSuccessEmail";

export async function POST(req: Request) {
    const body = await req.json();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature || !verifyPaystackSignature(body, signature)) {
        return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const event = body.event;
    const data = body.data;

    if (event === "charge.success") {
        const email = data.customer.email;
        const planCode = data.plan?.plan_code;

        let tier = "FREE";
        let credits = 0;

        if (planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BASIC) {
            tier = "BASIC";
            credits = 0;
        } else if (planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_LITE) {
            tier = "PRO_LITE";
            credits = 1;
        } else if (planCode === process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_PLUS) {
            tier = "PRO_PLUS";
            credits = 4;
        }

        if (tier !== "FREE") {
            const user = await prisma.user.findUnique({ where: { email } });

            await prisma.user.update({
                where: { email },
                data: {
                    subscriptionTier: tier as any,
                    subscriptionId: data.subscription_code, // Save subscription code for future reference
                    credits1on1: credits // Reset credits on new subscription payment? Or increment? 
                    // For now, let's set it to the plan limit. 
                    // Ideally, we should handle rollovers or resets more carefully, 
                    // but setting it is safe for the initial payment.
                }
            });

            // Send Subscription Success Email
            await sendEmail({
                to: email,
                subject: "Your Algora Subscription (" + tier + ")",
                react: SubscriptionSuccessEmail({
                    userName: user?.name || "Learner",
                    planName: tier
                }) as any
            });
        }
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
