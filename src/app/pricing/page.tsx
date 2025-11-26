import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <main className="container" style={{ padding: "6rem 0" }}>
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1rem" }}>Simple, Transparent Pricing</h1>
                <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: "600px", margin: "0 auto" }}>
                    Invest in your future for less than the cost of a daily coffee.
                </p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                alignItems: "stretch"
            }}>
                {/* Free Tier */}
                <PricingCard
                    title="Free"
                    price="₦0"
                    description="Get a taste of our structured learning path."
                    features={[
                        "Access to 3 videos per month",
                        "Community access",
                        "Public profile"
                    ]}
                    buttonText="Start Free"
                    buttonLink="/auth/signup"
                    variant="outline"
                />

                {/* Basic Tier */}
                <PricingCard
                    title="Basic"
                    price="₦9,000"
                    period="/month"
                    description="Full access to all course content and community events."
                    features={[
                        "Access to ALL contents",
                        "Weekly Group Office Hours",
                        "Project reviews",
                        "Certificate of completion"
                    ]}
                    buttonText="Join Basic"
                    buttonLink="/auth/signup?plan=basic"
                    variant="outline"
                />

                {/* Pro Lite Tier */}
                <PricingCard
                    title="Pro Lite"
                    price="₦12,000"
                    period="/month"
                    description="Add personal mentorship to accelerate your growth."
                    features={[
                        "Everything in Basic",
                        "1 One-on-One session/month",
                        "Priority code reviews",
                        "Career guidance"
                    ]}
                    buttonText="Join Pro Lite"
                    buttonLink="/auth/signup?plan=pro_lite"
                    variant="primary"
                    popular={true}
                />

                {/* Pro Plus Tier */}
                <PricingCard
                    title="Pro Plus"
                    price="₦18,000"
                    period="/month"
                    description="Maximum mentorship for serious career switchers."
                    features={[
                        "Everything in Basic",
                        "4 One-on-One sessions/month",
                        "Weekly 1:1 check-ins",
                        "Mock interviews",
                        "Direct mentor access"
                    ]}
                    buttonText="Join Pro Plus"
                    buttonLink="/auth/signup?plan=pro_plus"
                    variant="outline"
                />
            </div>
        </main>
    );
}

function PricingCard({
    title,
    price,
    period,
    description,
    features,
    buttonText,
    buttonLink,
    variant = "outline",
    popular = false
}: {
    title: string,
    price: string,
    period?: string,
    description: string,
    features: string[],
    buttonText: string,
    buttonLink: string,
    variant?: "primary" | "outline",
    popular?: boolean
}) {
    return (
        <div className="card" style={{
            padding: "2rem",
            position: "relative",
            border: popular ? "2px solid var(--primary)" : "1px solid var(--border)",
            transform: popular ? "scale(1.05)" : "none",
            zIndex: popular ? 10 : 1,
            boxShadow: popular ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "none",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }}>
            {popular && (
                <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    padding: "0.25rem 1rem",
                    borderRadius: "99px",
                    fontSize: "0.85rem",
                    fontWeight: 600
                }}>
                    MOST POPULAR
                </div>
            )}

            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h3>
            <div style={{ display: "flex", alignItems: "baseline", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800 }}>{price}</span>
                {period && <span style={{ color: "var(--muted)", marginLeft: "0.25rem", fontSize: "0.9rem" }}>{period}</span>}
            </div>
            <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: 1.5, fontSize: "0.95rem" }}>{description}</p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                {features.map((feature, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "start", gap: "0.75rem" }}>
                        <div style={{
                            backgroundColor: popular ? "var(--primary-light)" : "var(--muted-light)",
                            borderRadius: "50%",
                            padding: "0.25rem",
                            display: "flex",
                            marginTop: "0.1rem"
                        }}>
                            <Check size={12} color={popular ? "var(--primary)" : "var(--muted)"} />
                        </div>
                        <span style={{ fontSize: "0.9rem" }}>{feature}</span>
                    </li>
                ))}
            </ul>

            <Link
                href={buttonLink}
                className={`btn ${variant === "primary" ? "btn-primary" : "btn-outline"}`}
                style={{ width: "100%", textAlign: "center", justifyContent: "center", padding: "0.75rem", marginTop: "auto" }}
            >
                {buttonText}
            </Link>
        </div>
    );
}
