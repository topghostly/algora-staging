import crypto from "crypto";

export const verifyPaystackSignature = (event: string, signature: string) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;

  const hash = crypto.createHmac("sha512", secret).update(event).digest("hex");

  return hash === signature;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const verifyTransaction = async (
  reference: string,
  maxRetries = 5,
  baseDelayMs = 1000,
) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    const errorBody = await response.text();

    // Status 400 usually indicates "Transaction reference not found"
    // which happens during replication lag immediately after a successful payment
    if (response.status === 400 || response.status >= 500) {
      console.warn(
        `Paystack verification attempt ${attempt} failed: ${response.status} ${response.statusText}`,
        errorBody,
      );

      if (attempt < maxRetries) {
        // Exponential backoff
        await sleep(baseDelayMs * Math.pow(1.5, attempt - 1));
        continue;
      }
    }

    console.error(
      `Paystack verification failed after ${attempt} attempts: ${response.status} ${response.statusText}`,
      errorBody,
    );
    throw new Error(`Failed to verify transaction: ${response.statusText}`);
  }
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

export const listSubscriptions = async (customerEmail: string) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }

  const url = new URL("https://api.paystack.co/subscription");
  url.searchParams.set("customer", customerEmail);
  url.searchParams.set("perPage", "5");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list subscriptions: ${response.statusText}`);
  }

  const data = await response.json();
  return data as {
    status: boolean;
    data: Array<{
      subscription_code: string;
      email_token: string;
      status: string;
      plan: { plan_code: string };
    }>;
  };
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
