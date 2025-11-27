import * as React from 'react';

interface SubscriptionSuccessEmailProps {
    userName: string;
    planName: string;
}

export const SubscriptionSuccessEmail: React.FC<SubscriptionSuccessEmailProps> = ({ userName, planName }) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
        <h1 style={{ color: '#2563eb' }}>You're on the {planName} Plan</h1>
        <p>Hi {userName},</p>
        <p>Thanks for upgrading to the <strong>{planName}</strong> plan.</p>
        <p>We really appreciate your support. It means we can keep improving Algora for everyone.</p>
        <p>You now have access to all the features included in your tier. If you have any trouble finding something or just have a question about your subscription, let us know.</p>

        <p>Thanks again,<br />The Algora Team</p>
    </div>
);
