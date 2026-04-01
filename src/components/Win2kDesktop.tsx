"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LibraryBig, ListChecks, Monitor, Folder, Globe, BookOpen } from "lucide-react";

/* ---------- Windows 2000 primitive helpers ---------- */

function Win2kBevel({
  children,
  className = "",
  style = {},
  inset = false,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  inset?: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        border: inset
          ? "2px solid"
          : "2px solid",
        borderColor: inset
          ? "#808080 #dfdfdf #dfdfdf #808080"
          : "#dfdfdf #808080 #808080 #dfdfdf",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Win2kTitleBar({
  title,
  icon,
  onClose,
}: {
  title: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(to right, #0a246a, #3a6ea5)",
        padding: "3px 6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon && <span style={{ display: "flex" }}>{icon}</span>}
        <span
          style={{
            color: "white",
            fontFamily: "Tahoma, Verdana, sans-serif",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", gap: "2px" }}>
        <Win2kWinBtn label="─" />
        <Win2kWinBtn label="□" />
        <Win2kWinBtn label="✕" danger onClick={onClose} />
      </div>
    </div>
  );
}

function Win2kWinBtn({
  label,
  danger,
  onClick,
}: {
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 16,
        height: 14,
        fontSize: "9px",
        fontFamily: "Tahoma, sans-serif",
        background: danger ? "#c0392b" : "#c0c0c0",
        border: "1px solid",
        borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
        color: danger ? "white" : "#000",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

function Win2kBtn({
  children,
  href,
  primary,
  style = {},
}: {
  children: React.ReactNode;
  href?: string;
  primary?: boolean;
  style?: React.CSSProperties;
}) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 12px",
    fontFamily: "Tahoma, Verdana, sans-serif",
    fontSize: "11px",
    background: "#c0c0c0",
    border: "2px solid",
    borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
    cursor: "pointer",
    color: "#000",
    textDecoration: "none",
    whiteSpace: "nowrap",
    ...style,
  };

  if (href) {
    return (
      <Link href={href} style={baseStyle}>
        {children}
      </Link>
    );
  }
  return <button style={baseStyle}>{children}</button>;
}

function Win2kWindow({
  title,
  icon,
  children,
  onClose,
  style = {},
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#c0c0c0",
        border: "2px solid",
        borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
        ...style,
      }}
    >
      <Win2kTitleBar title={title} icon={icon} onClose={onClose} />
      <div>{children}</div>
    </div>
  );
}

function Win2kMenuBar({ items }: { items: string[] }) {
  return (
    <div
      style={{
        background: "#c0c0c0",
        padding: "2px 4px",
        display: "flex",
        gap: 2,
        borderBottom: "1px solid #808080",
        fontFamily: "Tahoma, sans-serif",
        fontSize: "11px",
      }}
    >
      {items.map((item) => (
        <span
          key={item}
          style={{
            padding: "1px 6px",
            cursor: "pointer",
            color: "#000",
          }}
        >
          <u>{item[0]}</u>
          {item.slice(1)}
        </span>
      ))}
    </div>
  );
}

function Win2kStatusBar({ text }: { text: string }) {
  return (
    <div
      style={{
        borderTop: "1px solid #808080",
        background: "#c0c0c0",
        padding: "2px 6px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Win2kBevel
        inset
        style={{ flex: 1, padding: "1px 4px" }}
      >
        <span
          style={{
            fontFamily: "Tahoma, sans-serif",
            fontSize: "10px",
            color: "#000",
          }}
        >
          {text}
        </span>
      </Win2kBevel>
      <Win2kBevel
        inset
        style={{ padding: "1px 8px" }}
      >
        <span style={{ fontFamily: "Tahoma, sans-serif", fontSize: "10px" }}>
          Internet zone
        </span>
      </Win2kBevel>
    </div>
  );
}

/* ---------- Desktop Icon ---------- */
function DesktopIcon({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "4px 8px",
        cursor: "pointer",
        textDecoration: "none",
        width: 80,
      }}
    >
      <div style={{ color: "#fff", filter: "drop-shadow(1px 1px 1px #000)" }}>
        {icon}
      </div>
      <span
        style={{
          fontFamily: "Tahoma, sans-serif",
          fontSize: "11px",
          color: "#fff",
          textAlign: "center",
          textShadow: "1px 1px 2px #000",
          wordBreak: "break-word",
        }}
      >
        {label}
      </span>
    </Link>
  );
}

/* ---------- Taskbar ---------- */
function Win2kTaskbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        background: "#c0c0c0",
        borderTop: "2px solid #dfdfdf",
        display: "flex",
        alignItems: "center",
        zIndex: 1000,
        boxShadow: "0 -1px 2px rgba(0,0,0,0.3)",
      }}
    >
      {/* Start button */}
      <button
        style={{
          height: 24,
          padding: "0 8px",
          margin: "2px 4px",
          background: "#c0c0c0",
          border: "2px solid",
          borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
          fontFamily: "Tahoma, sans-serif",
          fontSize: "11px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 13 }}>⊞</span>
        <span>Start</span>
      </button>

      {/* Separator */}
      <div
        style={{
          width: 2,
          height: 24,
          borderLeft: "1px solid #808080",
          borderRight: "1px solid #dfdfdf",
          margin: "0 4px",
        }}
      />

      {/* Active window tab */}
      <Win2kBevel
        inset
        style={{
          height: 22,
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Globe size={12} />
        <span style={{ fontFamily: "Tahoma, sans-serif", fontSize: "11px" }}>
          Algora - Microsoft Internet Explorer
        </span>
      </Win2kBevel>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* System tray */}
      <Win2kBevel
        inset
        style={{
          height: 24,
          padding: "0 8px",
          marginRight: 4,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 14 }}>🔊</span>
        <span style={{ fontSize: 14 }}>🌐</span>
        <span
          style={{
            fontFamily: "Tahoma, sans-serif",
            fontSize: "11px",
            minWidth: 40,
            textAlign: "right",
          }}
        >
          {time}
        </span>
      </Win2kBevel>
    </div>
  );
}

/* ---------- Main Desktop Component ---------- */
export function Win2kDesktop() {
  const [closedHero, setClosedHero] = useState(false);
  const [closedFeatures, setClosedFeatures] = useState(false);
  const [closedSteps, setClosedSteps] = useState(false);

  const learnEverything = [
    {
      title: "Project-Based Learning",
      description:
        "Build real-world projects you can show off in your portfolio.",
      icon: "📁",
    },
    {
      title: "Expert Mentorship",
      description:
        "Get unstuck quickly with access to experienced tutors and office hours.",
      icon: "👨‍🏫",
    },
    {
      title: "Career Focused",
      description:
        "Our curriculum is designed backwards from job descriptions.",
      icon: "💼",
    },
  ];

  const simpleSteps = [
    {
      title: "Choose Your Track",
      description: "Start with data analytics or explore other paths.",
      link: "/tracks",
      linkText: "View tracks",
      icon: "📚",
    },
    {
      title: "Subscribe",
      description: "Pick a plan that works for you.",
      link: "/pricing",
      linkText: "View plans",
      icon: "💳",
    },
    {
      title: "Work through lessons",
      description: "Build your portfolio and move forward.",
      link: "#",
      linkText: "View Curriculum",
      icon: "🎓",
    },
  ];

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        background: "#008080",
        paddingBottom: 50,
        paddingTop: 12,
        paddingLeft: 12,
        paddingRight: 12,
        fontFamily: "Tahoma, Verdana, sans-serif",
        position: "relative",
      }}
    >
      {/* Desktop Icons */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <DesktopIcon label="My Computer" href="#" icon={<Monitor size={32} />} />
        <DesktopIcon label="Tracks" href="/tracks" icon={<Folder size={32} />} />
        <DesktopIcon label="Pricing" href="/pricing" icon={<BookOpen size={32} />} />
        <DesktopIcon label="Sign Up" href="/auth/signup" icon={<Globe size={32} />} />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: 100,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Marquee banner */}
        <div
          style={{
            background: "#000080",
            border: "2px solid #dfdfdf",
            padding: "4px 0",
            overflow: "hidden",
          }}
        >
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount={3}
            style={{
              color: "#ffff00",
              fontFamily: "Tahoma, sans-serif",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            🌟 Welcome to Algora Learning Platform! &nbsp;|&nbsp; Master Data
            and AI Skills with Structured Mentorship &nbsp;|&nbsp; Launching the
            next generation of African Tech Talent &nbsp;|&nbsp; Sign up today –
            Start Learning FREE! &nbsp;|&nbsp; 🌟
          </marquee>
        </div>

        {/* Hero Window */}
        {!closedHero && (
          <Win2kWindow
            title="Algora Learning Platform - Welcome"
            icon={<Globe size={12} color="white" />}
            onClose={() => setClosedHero(true)}
          >
            <Win2kMenuBar
              items={["File", "Edit", "View", "Favorites", "Tools", "Help"]}
            />

            {/* Address bar */}
            <div
              style={{
                background: "#c0c0c0",
                padding: "3px 6px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderBottom: "1px solid #808080",
              }}
            >
              <span style={{ fontSize: "11px", fontFamily: "Tahoma, sans-serif" }}>
                Address:
              </span>
              <Win2kBevel
                inset
                style={{
                  flex: 1,
                  padding: "1px 4px",
                  background: "white",
                }}
              >
                <span style={{ fontFamily: "Tahoma, sans-serif", fontSize: "11px" }}>
                  http://www.algora.io/
                </span>
              </Win2kBevel>
              <Win2kBtn>Go</Win2kBtn>
            </div>

            {/* Content */}
            <div
              style={{
                background: "white",
                padding: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                borderTop: "1px solid #dfdfdf",
              }}
            >
              {/* Hero Text Panel */}
              <Win2kBevel
                inset
                style={{ padding: 16, background: "#f0f0f0" }}
              >
                {/* Badge */}
                <div
                  style={{
                    background: "#000080",
                    color: "#ffff00",
                    fontFamily: "Tahoma, sans-serif",
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "2px 8px",
                    display: "inline-block",
                    marginBottom: 12,
                  }}
                >
                  ★ Launching the next generation of African Tech Talent ★
                </div>
                <h1
                  style={{
                    fontFamily: "Tahoma, Verdana, sans-serif",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#000080",
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  Master Data and AI Skills
                  <br />
                  with Structured Mentorship
                </h1>
                <p
                  style={{
                    fontFamily: "Tahoma, sans-serif",
                    fontSize: "11px",
                    color: "#333",
                    marginBottom: 16,
                    lineHeight: 1.5,
                  }}
                >
                  Stop wasting time on scattered tutorials. Get a structured
                  curriculum, expert mentorship, and a portfolio that gets you
                  hired.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Win2kBtn href="/auth/signup" primary>
                    <LibraryBig size={12} />
                    Start Learning Free
                  </Win2kBtn>
                  <Win2kBtn href="/tracks">
                    <ListChecks size={12} />
                    View Curriculum
                  </Win2kBtn>
                </div>
              </Win2kBevel>

              {/* Hero Image Panel */}
              <Win2kBevel inset style={{ overflow: "hidden" }}>
                <img
                  src="/images/Landing-7.webp"
                  alt="Algora Learning"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Win2kBevel>
            </div>

            <Win2kStatusBar text="Done" />
          </Win2kWindow>
        )}

        {/* Features Window */}
        {!closedFeatures && (
          <Win2kWindow
            title="Best Place to Learn Everything - Properties"
            icon={<Folder size={12} color="white" />}
            onClose={() => setClosedFeatures(true)}
          >
            <Win2kMenuBar items={["File", "Edit", "View", "Help"]} />

            <div style={{ background: "white", padding: 16 }}>
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid #c0c0c0",
                }}
              >
                <Folder size={20} color="#000080" style={{ marginRight: 8 }} />
                <div>
                  <div
                    style={{
                      fontFamily: "Tahoma, sans-serif",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000080",
                    }}
                  >
                    Best Place to Learn Everything
                  </div>
                  <div
                    style={{
                      fontFamily: "Tahoma, sans-serif",
                      fontSize: "11px",
                      color: "#666",
                    }}
                  >
                    We bridge the gap between self-learning and expensive
                    bootcamps.
                  </div>
                </div>
              </div>

              {/* Feature cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {learnEverything.map((item, i) => (
                  <Win2kBevel
                    key={i}
                    style={{ padding: 12, background: "#f0f0f0" }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        marginBottom: 6,
                        textAlign: "center",
                      }}
                    >
                      {item.icon}
                    </div>
                    <img
                      src={
                        i === 0
                          ? "/images/Landing-2.webp"
                          : i === 1
                          ? "/images/Landing-3.webp"
                          : "/images/Landing-6.webp"
                      }
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        display: "block",
                        marginBottom: 8,
                        border: "1px inset #808080",
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "Tahoma, sans-serif",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#000080",
                        marginBottom: 4,
                      }}
                    >
                      {item.icon} {item.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "Tahoma, sans-serif",
                        fontSize: "10px",
                        color: "#333",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.description}
                    </div>
                  </Win2kBevel>
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: 12 }}>
                <Win2kBtn href="/tracks">
                  <LibraryBig size={12} />
                  Start Learning
                </Win2kBtn>
              </div>
            </div>

            <Win2kStatusBar text="3 items" />
          </Win2kWindow>
        )}

        {/* Steps Window */}
        {!closedSteps && (
          <Win2kWindow
            title="Setup Wizard - Start with Three Simple Steps"
            icon={<BookOpen size={12} color="white" />}
            onClose={() => setClosedSteps(true)}
          >
            <Win2kMenuBar items={["File", "View", "Help"]} />

            <div style={{ background: "white", padding: 16 }}>
              {/* Wizard header */}
              <div
                style={{
                  background: "linear-gradient(to right, #000080, #1084d0)",
                  padding: "12px 16px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 32 }}>🧙</span>
                <div>
                  <div
                    style={{
                      color: "white",
                      fontFamily: "Tahoma, sans-serif",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Algora Setup Wizard
                  </div>
                  <div
                    style={{
                      color: "#cde",
                      fontFamily: "Tahoma, sans-serif",
                      fontSize: "11px",
                    }}
                  >
                    Follow these steps to begin your learning journey
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {simpleSteps.map((step, i) => (
                  <Win2kBevel key={i} style={{ background: "#f8f8f8" }}>
                    {/* Step title bar */}
                    <div
                      style={{
                        background: "linear-gradient(to right, #0a246a, #3a6ea5)",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          background: "white",
                          color: "#000080",
                          fontFamily: "Tahoma, sans-serif",
                          fontSize: "10px",
                          fontWeight: "bold",
                          width: 16,
                          height: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{
                          color: "white",
                          fontFamily: "Tahoma, sans-serif",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {step.title}
                      </span>
                    </div>
                    <div style={{ padding: 10 }}>
                      <img
                        src={
                          i === 0
                            ? "/images/Landing-5.webp"
                            : i === 1
                            ? "/images/Landing-1.webp"
                            : "/images/Landing-4.webp"
                        }
                        alt={step.title}
                        style={{
                          width: "100%",
                          height: 110,
                          objectFit: "cover",
                          display: "block",
                          marginBottom: 8,
                          border: "1px inset #808080",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "Tahoma, sans-serif",
                          fontSize: "10px",
                          color: "#333",
                          marginBottom: 8,
                          lineHeight: 1.4,
                        }}
                      >
                        {step.description}
                      </div>
                      <Win2kBtn href={step.link}>
                        {step.linkText} →
                      </Win2kBtn>
                    </div>
                  </Win2kBevel>
                ))}
              </div>
            </div>

            {/* Wizard footer */}
            <div
              style={{
                background: "#c0c0c0",
                borderTop: "1px solid #808080",
                padding: "8px 12px",
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <Win2kBtn>{"< Back"}</Win2kBtn>
              <Win2kBtn href="/auth/signup" primary>
                {"Next >"}
              </Win2kBtn>
              <Win2kBtn>Cancel</Win2kBtn>
            </div>
          </Win2kWindow>
        )}

        {/* CTA Dialog */}
        <Win2kWindow
          title="Information"
          icon={
            <span style={{ color: "white", fontSize: 12 }}>ℹ️</span>
          }
        >
          <div
            style={{
              background: "#c0c0c0",
              padding: 16,
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 36, flexShrink: 0 }}>ℹ️</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "Tahoma, sans-serif",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#000",
                  marginBottom: 6,
                }}
              >
                Start your career in tech today!
              </div>
              <div
                style={{
                  fontFamily: "Tahoma, sans-serif",
                  fontSize: "11px",
                  color: "#333",
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                Learn in-demand skills, build real projects, and join a
                community of African innovators.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Win2kBtn href="/auth/signup">
                  <LibraryBig size={12} />
                  Start Learning Free
                </Win2kBtn>
                <Win2kBtn href="/tracks">
                  <ListChecks size={12} />
                  View Curriculum
                </Win2kBtn>
              </div>
            </div>
          </div>
        </Win2kWindow>
      </div>

      {/* Taskbar */}
      <Win2kTaskbar />
    </div>
  );
}
