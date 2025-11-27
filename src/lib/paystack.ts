import crypto from 'crypto';

export const verifyPaystackSignature = (event: any, signature: string) => {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return false;

    const hash = crypto.createHmac('sha512', secret)
        .update(JSON.stringify(event))
        .digest('hex');

    return hash === signature;
};
