import crypto from "crypto";

export const verifyPaystackSignature = (event: string, signature: string) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;

  const hash = crypto.createHmac("sha512", secret).update(event).digest("hex");

  return hash === signature;
};

export const verifyTransaction = async (reference: string) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Paystack verification failed: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Failed to verify transaction: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const getSubscription = async (subscriptionCode: string) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }

  const response = await fetch(
    `https://api.paystack.co/subscription/${subscriptionCode}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to get subscription: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const disableSubscription = async (code: string, token: string) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }

  const response = await fetch(`https://api.paystack.co/subscription/disable`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      token,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to disable subscription: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
