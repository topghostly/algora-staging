import Link from "next/link";

export default function Home() {
  return (
    <main className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>
        Welcome to <span style={{ color: 'var(--primary)' }}>Algora</span>
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
        The structured path to a tech career in Africa.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
        <Link href="/tracks" className="btn btn-outline">View Tracks</Link>
      </div>
    </main>
  );
}
