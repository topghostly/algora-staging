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
    <div>
        <h1>Booking Confirmed!</h1>
        <p>Hi {userName},</p>
        <p>Your session <strong>{sessionTitle}</strong> with <strong>{tutorName}</strong> has been confirmed.</p>
        <p><strong>Time:</strong> {new Date(startTime).toLocaleString()}</p>
        {meetingLink && (
            <p>
                <strong>Meeting Link:</strong> <a href={meetingLink}>{meetingLink}</a>
            </p>
        )}
        <p>See you there!</p>
    </div>
);
