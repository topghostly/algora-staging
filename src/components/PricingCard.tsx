"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";
import {
  updateSubscription,
  recordTransaction,
  cancelSubscription,
} from "@/app/(main)/actions/subscription";
import { SubscriptionTier } from "@prisma/client";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/alert-dialog";

export default function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonLink,
  planCode,
  amount,
  tier,
  creditsToAdd = 0,
  variant = "outline",
  popular = false,
  isCurrentPlan = false,
}: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink?: string;
  planCode?: string;
  amount?: number;
  tier?: SubscriptionTier;
  creditsToAdd?: number;
  variant?: "primary" | "outline";
  popular?: boolean;
  isCurrentPlan?: boolean;
}) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const config = {
    reference: new Date().getTime().toString(),
    email: session?.user?.email || "",
    amount: (amount || 0) * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    plan: planCode,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    // console.log("Payment successful", reference);
    try {
      if (tier) {
        await updateSubscription(reference.reference);
        toast.success(
          `Payment successful! Your subscription has been updated to ${title}.`,
          {
            duration: 5000,
          },
        );
        await update();
        router.push("/dashboard");
      } else {
        // Record non-tier transaction (if any)
        await recordTransaction({
          reference: reference.reference,
          paystackTransactionId: reference.transaction,
          amount: amount || 0,
          status: reference.status,
          planCode: planCode,
        });
        toast.success(
          "Payment successful! Your subscription has been updated.",
          {
            duration: 5000,
          },
        );
        await update();
      }
    } catch (error) {
      console.error("Failed to update subscription:", error);

      // Log the failure in the database
      await recordTransaction({
        reference: reference.reference,
        amount: amount || 0,
        status: "FAILED_TO_UPDATE_USER",
        planCode: planCode,
        paystackTransactionId: reference.transaction,
      });

      toast.error(
        "Payment was successful, but we encountered an error updating your account. Please contact support.",
        {
          duration: 5000,
        },
      );
    }
  };

  const onClose = async () => {
    console.log("Payment modal closed by user");
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    setShowCancelDialog(false);
    setIsCancelling(true);
    try {
      await cancelSubscription();
      toast.success("Subscription cancelled successfully.");
      await update();
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleClick = () => {
    if (isCurrentPlan) return;

    console.log("PricingCard clicked", {
      planCode,
      buttonLink,
      session: !!session,
    });

    if (!session) {
      console.log("No session, redirecting to signup");
      router.push(buttonLink || "/auth/signup");
      return;
    }

    if (planCode) {
      console.log("Initializing payment with config:", config);
      initializePayment({ onSuccess, onClose });
    } else if (buttonLink) {
      console.log("Navigating to buttonLink:", buttonLink);
      router.push(buttonLink);
    }
  };

  const borderColor = isCurrentPlan
    ? "var(--success)"
    : popular
      ? "var(--primary)"
      : "var(--border)";
  const shadow =
    isCurrentPlan || popular
      ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      : "none";
  const scale = isCurrentPlan || popular ? "scale(1.02)" : "none"; // Reduced scale slightly
  const zIndex = isCurrentPlan ? 20 : popular ? 10 : 1;

  return (
    <div
      className="card"
      style={{
        padding: "2rem",
        position: "relative",
        border: `2px solid ${borderColor}`,
        overflow: "visible",
        transform: scale,
        zIndex: zIndex,
        boxShadow: shadow,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isCurrentPlan
          ? "var(--bg-green-500/10)"
          : "var(--background)",
      }}
    >
      {isCurrentPlan && (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--success)",
            color: "white",
            padding: "0.25rem 1rem",
            borderRadius: "99px",
            fontSize: "0.85rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          CURRENT PLAN
        </div>
      )}

      {!isCurrentPlan && popular && (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--primary)",
            color: "white",
            padding: "0.25rem 1rem",
            borderRadius: "99px",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          MOST POPULAR
        </div>
      )}

      <h3
        style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: "0.5rem" }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "2.5rem", fontWeight: 600 }}>{price}</span>
        {period && (
          <span
            style={{
              color: "var(--muted)",
              marginLeft: "0.25rem",
              fontSize: "1.2rem",
            }}
          >
            {period}
          </span>
        )}
      </div>
      <p
        style={{
          color: "var(--muted)",
          marginBottom: "2rem",
          lineHeight: 1.5,
          fontSize: "0.95rem",
        }}
      >
        {description}
      </p>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 2rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        {features.map((feature, i) => (
          <li
            key={i}
            style={{ display: "flex", alignItems: "start", gap: "0.75rem" }}
          >
            <div
              style={{
                backgroundColor: isCurrentPlan
                  ? "var(--green-100)"
                  : popular
                    ? "var(--primary-light)"
                    : "var(--muted-light)",
                borderRadius: "50%",
                padding: "0.25rem",
                display: "flex",
                marginTop: "0.1rem",
              }}
            >
              <Check
                size={12}
                color={
                  isCurrentPlan
                    ? "var(--success)"
                    : popular
                      ? "var(--primary)"
                      : "var(--muted)"
                }
              />
            </div>
            <span style={{ fontSize: "0.9rem" }}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={isCurrentPlan ? handleCancelClick : handleClick}
        disabled={isCancelling}
        className={`btn rounded-lg ${variant === "primary" ? "btn-primary" : "btn-outline"} `}
        style={{
          width: "100%",
          textAlign: "center",
          justifyContent: "center",
          padding: "0.75rem",
          marginTop: "auto",
          opacity: isCancelling ? 0.7 : 1,
          cursor: isCancelling ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          border: isCurrentPlan ? "1px solid red" : "",
          backgroundColor: isCurrentPlan ? "#fff7f7" : "",
        }}
      >
        {isCancelling ? (
          <span className="text-red-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Cancelling...
          </span>
        ) : isCurrentPlan ? (
          <span className="text-red-500">Cancel Subscription</span>
        ) : (
          buttonText
        )}
      </button>

      <ConfirmationDialog
        isOpen={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Subscription"
        description="Are you sure you want to cancel your subscription? Your current plan will be downgraded to Free at the end of the billing period."
        confirmText="Yes, Cancel Subscription"
        cancelText="No, Keep It"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  );
}
