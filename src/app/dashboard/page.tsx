"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();

    return (
        <div className="container" style={{ marginTop: '4rem' }}>
            <div className="card">
                <h1 style={{ marginBottom: '1rem' }}>Dashboard</h1>
                <p style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>
                    Welcome back, <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{session?.user?.name}</span>!
                </p>

                <div style={{ padding: '1rem', backgroundColor: 'var(--muted-light)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
                    <p><strong>Email:</strong> {session?.user?.email}</p>
                    <p><strong>Role:</strong> {session?.user?.role}</p>
                    <p><strong>User ID:</strong> {session?.user?.id}</p>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="btn btn-outline"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
