import * as React from 'react';

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
        <h1 style={{ color: '#2563eb' }}>Welcome to Algora, {name}!</h1>
        <p>Hi {name},</p>
        <p>Thanks for joining us. I'm really glad you're here.</p>
        <p>At Algora, we're all about helping you become a better developer, whether you're just starting out or looking to level up. We've built this platform to be the kind of place we wish we had when we were learning.</p>

        <h3>A few things you can do right now:</h3>
        <ul>
            <li><strong>Check out the Tracks:</strong> We've organized our lessons into clear paths so you don't have to guess what to learn next.</li>
            <li><strong>Say Hello:</strong> If you join our community spaces, introduce yourself. We're a friendly bunch.</li>
        </ul>

        <p>If you ever get stuck or just want to share what you're working on, feel free to reply to this email. I read every response.</p>

        <p>Best,<br />The Algora Team</p>
    </div>
);
