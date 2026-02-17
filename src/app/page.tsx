import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Gauge,
  Code,
  Users,
  Award,
  LibraryBig,
  BookOpen,
  Star,
  ChevronRight,
  PersonStanding,
  CircleGauge,
} from "lucide-react";
import Image from "next/image";
import Footer from "@/components/Footer";

type StepCardProps = {
  variant?: "horizontal" | "vertical";
  label: string;
  title: string;
  description?: string;
  actionText: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
};

type VerticalStepCardProps = {
  label: string;
  title: string;
  description?: string;
  actionText: string;
  imageSrc: string;
  imageAlt: string;
};

type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
};

type InfoCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: string;
  icon?: React.ReactNode;
  layout?: "horizontal" | "vertical";
  image?: boolean;
  className?: string;
};

export default function Home() {
  return (
    <>
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
                fontSize: "3.6rem",
                fontWeight: 500,
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
              curriculum, expert mentorship, and a portfolio that gets you
              hired.
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
          <div className="container flex justify-center">
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
                  fontSize: "3.3rem",
                  fontWeight: 500,
                  marginBottom: "1rem",
                }}
              >
                Why Choose Algora?
              </h2>
              <p style={{ fontSize: "1.1rem" }}>
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

        {/* Steps to start */}
        <section className="home-spacing-p">
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p className="text-sm font-semibold mb-2">Simple</p>
              <h2
                style={{
                  fontSize: "3.3rem",
                  fontWeight: 500,
                  marginBottom: "1rem",
                }}
              >
                Four steps to start
              </h2>

              <p style={{ fontSize: "1.1rem" }}>
                Pick your track, pay once a month, learn at your pace
              </p>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FirstStepCard />

              <VerticalStepCard
                label="Subscribe"
                title="Pick a plan that works for you"
                description="Go"
                actionText="Learn"
                imageSrc="https://images.unsplash.com/photo-1655720348616-184ae7fad7e3?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                imageAlt="Woman working on laptop"
              />

              <VerticalStepCard
                label="Work through lessons"
                title="Finish"
                description="Build your portfolio and move forward"
                actionText="Start"
                imageSrc="https://images.unsplash.com/photo-1633504885008-f8fed592a06a?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                imageAlt="People collaborating"
              />
            </div>
          </div>
        </section>

        {/* Testimonial section */}
        <section
          style={{ backgroundColor: "var(--primary-light)" }}
          className="home-spacing-p"
        >
          <div className="container">
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2
                style={{
                  fontSize: "3.3rem",
                  fontWeight: 500,
                  marginBottom: "1rem",
                }}
              >
                Real stories
              </h2>
              <p style={{ fontSize: "1.1rem" }}>
                Hear from learners across Africa
              </p>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="I went from confused about data to landing my first analytics role in six months. Algora gave me structure when I needed it most."
                name="Amara Okafor"
                role="Data analyst, Lagos"
                imageSrc="/images/algora_io_logo.jpeg"
              />

              <TestimonialCard
                quote="The office hours saved me. Real people answering real questions, not some bot. That made all the difference."
                name="Kwame Mensah"
                role="Junior developer, Accra"
                imageSrc="/images/algora_io_logo.jpeg"
              />

              <TestimonialCard
                quote="Finally, something that respects my time and my wallet. I learn when I can, and the support is there when I need it."
                name="Zainab Hassan"
                role="Student, Nairobi"
                imageSrc="/images/algora_io_logo.jpeg"
              />
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="home-spacing-p">
          <div className="container">
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p className="text-sm font-semibold mb-2">Why</p>
              <h2
                style={{
                  fontSize: "3.3rem",
                  fontWeight: 500,
                  marginBottom: "1rem",
                }}
              >
                Built for your reality
              </h2>
              <p style={{ fontSize: "1.1rem" }}>
                We know what works in Africa. Flexible, affordable, and human.
              </p>
            </div>

            <div>
              <div className="layout-grid">
                {/* Left Section with 3 blocks */}
                <div className="left-column">
                  <TrackCard />
                  <PeersCard />
                  <SpeedCard />
                </div>

                {/* Right Section Combined */}
                <SidebarCombinedCard />
              </div>
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
                fontWeight: 500,
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
              Join hundreds of other learners building the future of African
              tech.
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
                fontWeight: 500,
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
      <Footer />
    </>
  );
}

// SIDE COMPONENTS
const FirstStepCard = () => {
  return (
    <div
      className="card flex gap-6"
      style={{
        gridColumn: "span 2",
        padding: 0,
        alignItems: "stretch",
      }}
    >
      {/* Text */}
      <div
        className="flex flex-col justify-center"
        style={{ flex: 1, padding: "1.5rem" }}
      >
        <div>
          <p className="font-semibold mb-1">First</p>

          <h3 className="font-semibold mb-2" style={{ fontSize: "2.2rem" }}>
            Choose your track
          </h3>

          <p className="mb-6">
            Start with data analytics or explore other paths
          </p>

          <Link
            href="/tracks"
            className="flex items-center gap-1 font-semibold"
          >
            Next <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Image */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          position: "relative",
          width: "50%",
          minHeight: "260px",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1567717582090-02587705baf9?q=80&w=1356&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Man working in a cafe"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

const VerticalStepCard = ({
  label,
  title,
  description,
  actionText,
  imageSrc,
  imageAlt,
}: VerticalStepCardProps) => {
  return (
    <div
      className="card flex flex-col justify-between p-0"
      style={{ padding: 0 }}
    >
      <div
        className="flex flex-col justify-center "
        style={{ flex: 1, padding: "1.5rem" }}
      >
        <div>
          <p className="font-semibold mb-1">{label}</p>

          <h3 className="font-semibold mb-2" style={{ fontSize: "1.5rem" }}>
            {title}
          </h3>

          <p className="mb-6">{description}</p>

          <Link
            href="/tracks"
            className="flex items-center gap-1 font-semibold"
          >
            {actionText} <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <div
        className="rounded-lg overflow-hidden"
        style={{ position: "relative", height: "160px" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

const TestimonialCard = ({
  quote,
  name,
  role,
  imageSrc,
}: TestimonialCardProps) => {
  return (
    <div
      className="card flex flex-col justify-between"
      style={{
        padding: "2rem",
        height: "100%",
        backgroundColor: "var(--primary-light)",
        borderColor: "var(--muted)",
      }}
    >
      {/* Stars */}
      <div className="flex  mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={22} fill="black" stroke="black" />
        ))}
      </div>

      {/* Quote */}
      <p className="mb-6" style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>
        “{quote}”
      </p>

      {/* Author */}
      <div className="flex items-center" style={{ gap: "15px" }}>
        <div
          className="rounded-full overflow-hidden"
          style={{
            width: "40px",
            height: "40px",
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            src={imageSrc}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <div>
          <p className="font-semibold">{name}</p>
          <p className="">{role}</p>
        </div>
      </div>
    </div>
  );
};

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
      <h3 style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: "1rem" }}>
        {title}
      </h3>
      <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

// Why sectopn components

const TrackCard = () => (
  <div className="card track-card" style={{ padding: "0" }}>
    <div className="track-content">
      <div style={{ padding: "20px" }}>
        <span className="font-semibold mb-1">Track</span>
        <h3 className="font-semibold mb-2" style={{ fontSize: "1.7rem" }}>
          See exactly where you stand
        </h3>
        <p className="mb-6">Know your progress at every step</p>
        <Link href="#" className="flex items-center gap-1 font-semibold">
          View <ChevronRight size={16} />
        </Link>
      </div>
    </div>
    <div className="track-image-container">
      <img
        src="https://images.unsplash.com/photo-1656004035327-1ced20adbc1b?q=80&w=1304&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Tracking"
        className="card-image"
      />
    </div>
  </div>
);

const PeersCard = () => (
  <div
    className="card"
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div>
      <PersonStanding size={38} className="mb-4" />
      <h3 className="font-semibold mb-2" style={{ fontSize: "1.7rem" }}>
        Learn alongside your peers
      </h3>
      <p className="mb-6">Join a community that gets it</p>
    </div>
    <Link href="#" className="flex items-center gap-1 font-semibold">
      Connect <ChevronRight size={16} />
    </Link>
  </div>
);

const SpeedCard = () => (
  <div
    className="card"
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div>
      <CircleGauge size={34} className="mb-4" />
      <h3 className="font-semibold mb-2" style={{ fontSize: "1.7rem" }}>
        Move at your own speed
      </h3>
      <p className="mb-6">No pressure, no rigid schedules</p>
    </div>
    <Link href="#" className="flex items-center gap-1 font-semibold">
      Learn <ChevronRight size={16} />
    </Link>
  </div>
);

const SidebarCombinedCard = () => (
  <div className="">
    <div className="card sidebar-container" style={{ padding: 0 }}>
      <div className="relevant-card" style={{ padding: "40px" }}>
        <span className="font-semibold mb-1">Relevant</span>
        <h3
          className="font-semibold mb-2"
          style={{ fontSize: "2.5rem", maxWidth: "500px" }}
        >
          Content made for African tech careers
        </h3>
        <p className="mb-6">Real projects, real outcomes, real jobs</p>
        <div className="button-group">
          <Link
            href={"#"}
            className="btn btn-outline"
            style={{
              padding: "0.5rem 0.7rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Explore
          </Link>
          <Link href="#" className="flex items-center gap-1 font-semibold">
            Start <ChevronRight size={16} />
          </Link>
        </div>
      </div>
      <div className="sidebar-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1513152422499-61ec81f36b5b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Community"
          className="sidebar-image"
        />
      </div>
    </div>
  </div>
);
