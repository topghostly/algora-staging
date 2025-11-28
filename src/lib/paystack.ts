import crypto from 'crypto';

export const verifyPaystackSignature = (event: string, signature: string) => {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return false;

    const hash = crypto.createHmac('sha512', secret)
        .update(event)
        .digest('hex');

    return hash === signature;
};
