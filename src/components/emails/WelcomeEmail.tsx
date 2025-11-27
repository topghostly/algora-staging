import * as React from 'react';

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
    <div>
        <h1>Welcome, {name}!</h1>
        <p>Thank you for joining Livermore Duckwald. We are excited to help you on your learning journey.</p>
        <p>Explore our tracks and start learning today!</p>
    </div>
);
