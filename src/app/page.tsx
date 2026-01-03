import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Code,
  Users,
  Award,
  LibraryBig,
  BookOpen,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section
        style={{
          padding: "6rem 0",
          textAlign: "center",
          // background: "linear-gradient(to bottom, var(--primary-light), white)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(0, 137, 123, 0.1)",
              color: "var(--primary)",
              borderRadius: "99px",
              fontWeight: 600,
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
            }}
          >
            🚀 Launching the next generation of African Tech Talent
          </div>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Master Tech Skills with{" "}
            {/* <span style={{ color: "var(--primary)" }}> */}
            Structured Mentorship
            {/* </span> */}
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--muted)",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
          >
            Stop wasting time on scattered tutorials. Get a structured
            curriculum, expert mentorship, and a portfolio that gets you hired.
          </p>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Link
              href="/auth/signup"
              className="btn btn-primary"
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <LibraryBig size={20} />
              Start Learning Free
            </Link>
            <Link
              href="/tracks"
              className="btn btn-outline"
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <BookOpen size={20} />
              View Curriculum
            </Link>
          </div>
        </div>
        <div className="container">
          <Image
            src="/images/three_people_holding_piece.svg"
            alt="three_people_holding_piece"
            width={0}
            height={0}
            style={{
              width: "80%",
              height: "auto",
              marginTop: "4rem",
              pointerEvents: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
            sizes="100vw"
          />
        </div>
      </section>

      {/* Value Props */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Why Choose Algora?
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
              We bridge the gap between self-learning and expensive bootcamps.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            <FeatureCard
              icon={<Code size={32} color="var(--primary)" />}
              title="Project-Based Learning"
              description="Don't just watch videos. Build real-world projects that you can show off in your portfolio."
            />
            <FeatureCard
              icon={<Users size={32} color="var(--accent)" />}
              title="Expert Mentorship"
              description="Get unstuck quickly with access to experienced tutors and weekly office hours."
            />
            <FeatureCard
              icon={<Award size={32} color="var(--secondary)" />}
              title="Career Focused"
              description="Our curriculum is designed backwards from job descriptions to ensure you learn what matters."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "5rem 0 10rem 0",
          backgroundColor: "var(--secondary)",
          color: "white",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}
          >
            Ready to start your journey?
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.9,
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
          >
            Join hundreds of other learners building the future of African tech.
          </p>
          <Link
            href="/auth/signup"
            className="btn"
            style={{
              backgroundColor: "var(--accent)",
              color: "black",
              border: "none",
              padding: "1rem 2.5rem",
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            Get Started Now{" "}
            <ArrowRight
              size={20}
              style={{ marginLeft: "0.5rem", verticalAlign: "middle" }}
            />
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: "2rem",
        textAlign: "left",
        transition: "transform 0.2s",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          backgroundColor: "var(--primary-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        {title}
      </h3>
      <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}
