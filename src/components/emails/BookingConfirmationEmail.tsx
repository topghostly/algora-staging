import * as React from 'react';

interface BookingConfirmationEmailProps {
    userName: string;
    sessionTitle: string;
    tutorName: string;
    startTime: Date;
    meetingLink?: string | null;
}

export const BookingConfirmationEmail: React.FC<BookingConfirmationEmailProps> = ({
    userName,
    sessionTitle,
    tutorName,
    startTime,
    meetingLink
}) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
        <h1 style={{ color: '#2563eb' }}>Session Confirmed</h1>
        <p>Hi {userName},</p>
        <p>Just confirming that your session with <strong>{tutorName}</strong> is booked.</p>
        <p>You'll be covering <strong>{sessionTitle}</strong>. It's a great chance to ask specific questions or get feedback on your code.</p>

        <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <h3 style={{ marginTop: 0 }}>When & Where:</h3>
            <p style={{ margin: '5px 0' }}>📅 {new Date(startTime).toLocaleString()}</p>
            {meetingLink && (
                <p style={{ margin: '5px 0' }}>
                    🔗 <a href={meetingLink} style={{ color: '#2563eb' }}>Click here to join the call</a>
                </p>
            )}
        </div>

        <p>To get the most out of it, it helps to write down a few things you want to discuss beforehand.</p>
        <p>Talk soon,</p>

        <p>The Algora Team</p>
    </div>
);
