import * as React from 'react';

interface SubscriptionSuccessEmailProps {
    userName: string;
    planName: string;
}

export const SubscriptionSuccessEmail: React.FC<SubscriptionSuccessEmailProps> = ({ userName, planName }) => (
    <div>
        <h1>Subscription Upgraded!</h1>
        <p>Hi {userName},</p>
        <p>You have successfully upgraded to the <strong>{planName}</strong> plan.</p>
        <p>Enjoy your new benefits and happy learning!</p>
    </div>
);
