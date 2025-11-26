export default function AdminDashboard() {
    return (
        <div>
            <h1 style={{ marginBottom: "1.5rem" }}>Dashboard Overview</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                <div className="card">
                    <h3 style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Users</h3>
                    <p style={{ fontSize: "2rem", fontWeight: 700 }}>0</p>
                </div>

                <div className="card">
                    <h3 style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Active Tracks</h3>
                    <p style={{ fontSize: "2rem", fontWeight: 700 }}>0</p>
                </div>

                <div className="card">
                    <h3 style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Revenue</h3>
                    <p style={{ fontSize: "2rem", fontWeight: 700 }}>₦0</p>
                </div>
            </div>
        </div>
    );
}
