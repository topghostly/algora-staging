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
    throw new Error(`Failed to verify transaction: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
