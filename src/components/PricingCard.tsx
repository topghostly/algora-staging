"use client";

import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";

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
  variant?: "primary" | "outline";
  popular?: boolean;
  isCurrentPlan?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const config = {
    reference: new Date().getTime().toString(),
    email: session?.user?.email || "",
    amount: (amount || 0) * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    plan: planCode,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    alert("Payment successful! Your subscription has been updated.");
    router.refresh();
  };

  const onClose = () => {
    // handle close
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
        style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}
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
        <span style={{ fontSize: "2rem", fontWeight: 800 }}>{price}</span>
        {period && (
          <span
            style={{
              color: "var(--muted)",
              marginLeft: "0.25rem",
              fontSize: "0.9rem",
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
        onClick={handleClick}
        disabled={isCurrentPlan}
        className={`btn ${variant === "primary" ? "btn-primary" : "btn-outline"}`}
        style={{
          width: "100%",
          textAlign: "center",
          justifyContent: "center",
          padding: "0.75rem",
          marginTop: "auto",
          opacity: isCurrentPlan ? 0.7 : 1,
          cursor: isCurrentPlan ? "default" : "pointer",
          backgroundColor: isCurrentPlan ? "var(--muted-light)" : undefined,
          color: isCurrentPlan ? "var(--muted)" : undefined,
          borderColor: isCurrentPlan ? "transparent" : undefined,
        }}
      >
        {isCurrentPlan ? "Current Plan" : buttonText}
      </button>
    </div>
  );
}
