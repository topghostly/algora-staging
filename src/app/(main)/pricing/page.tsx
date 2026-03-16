"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SubscriptionTier } from "@prisma/client";

const PricingCard = dynamic(() => import("@/components/PricingCard"), {
  ssr: false,
});

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = (planCode: string, amount: number) => {
    if (!session?.user?.email) {
      router.push(`/auth/signup?plan=${planCode}`); // Redirect to signup if not logged in
      return;
    }

    const config = {
      reference: new Date().getTime().toString(),
      email: session.user.email,
      amount: amount * 100, // Paystack expects amount in kobo
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      plan: planCode,
    };

    // We can't use the hook directly in the callback, so we need a component or a different approach.
    // Actually, usePaystackPayment returns a function 'initializePayment'.
    // But we need to call the hook at the top level.
    // Let's make PricingCard handle the hook.
  };

  return (
    <main className="container" style={{ padding: "6rem 0 10rem 0" }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <h1 className="mb-4">Simple, Transparent Pricing</h1>
        <p className="mb-4">
          Invest in your future for less than the cost of a daily coffee.
        </p>
        <div
          className="w-fit md:text-base px-3 py-1 font-semibold rounded-full mb-6 mx-auto"
          style={{
            backgroundColor: "var(--muted-light)",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "var(--muted)",
            }}
          >
            ℹ️ <strong>Note:</strong> "Session Credits" are used to book 1-on-1
            mentorship sessions.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
      >
        {/* Free Tier */}
        <PricingCard
          title="Free"
          price="₦0"
          description="Get a taste of our structured learning path."
          features={[
            "Access to 3 videos per month",
            "Community access",
            "Public profile",
          ]}
          buttonText="Start Free"
          buttonLink="/auth/signup"
          variant="outline"
          isCurrentPlan={
            !!session?.user &&
            (session.user.subscriptionTier === "FREE" ||
              !session.user.subscriptionTier)
          }
        />

        {/* Basic Tier */}
        <PricingCard
          title="Basic"
          price="₦4,999"
          period="/month"
          description="Full access to all course content and community events."
          features={[
            "Access to ALL contents",
            "Weekly Group Office Hours",
            "Project reviews",
            "Certificate of completion",
          ]}
          buttonText="Join Basic"
          planCode={process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BASIC}
          amount={4999}
          tier={SubscriptionTier.BASIC}
          creditsToAdd={0}
          variant="outline"
          isCurrentPlan={session?.user?.subscriptionTier === "BASIC"}
        />

        {/* Pro Lite Tier */}
        <PricingCard
          title="Pro Lite"
          price="₦9,499"
          period="/month"
          description="Add personal mentorship to accelerate your growth."
          features={[
            "Everything in Basic",
            "1 One-on-One Session Credit/month",
            "Priority code reviews",
            "Career guidance",
          ]}
          buttonText="Join Pro Lite"
          planCode={process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_LITE}
          amount={9499}
          tier={SubscriptionTier.PRO_LITE}
          creditsToAdd={1}
          variant="primary"
          popular={true}
          isCurrentPlan={session?.user?.subscriptionTier === "PRO_LITE"}
        />

        {/* Pro Plus Tier */}
        <PricingCard
          title="Pro Plus"
          price="₦14,999"
          period="/month"
          description="Maximum mentorship for serious career switchers."
          features={[
            "Everything in Basic",
            "4 One-on-One Session Credits/month",
            "Weekly 1:1 check-ins",
            "Mock interviews",
            "Direct mentor access",
          ]}
          buttonText="Join Pro Plus"
          planCode={process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_PLUS}
          amount={14999}
          tier={SubscriptionTier.PRO_PLUS}
          creditsToAdd={4}
          variant="outline"
          isCurrentPlan={session?.user?.subscriptionTier === "PRO_PLUS"}
        />
      </div>
    </main>
  );
}
