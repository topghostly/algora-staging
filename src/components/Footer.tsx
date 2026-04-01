import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#c0c0c0",
        borderTop: "2px solid",
        borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
        fontFamily: "Tahoma, Verdana, sans-serif",
        marginBottom: 30,
      }}
    >
      <div
        style={{
          background: "linear-gradient(to right, #0a246a, #3a6ea5)",
          padding: "3px 12px",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontFamily: "Tahoma, sans-serif",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          Algora — © {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
      <div className="container">
        <div
          style={{
            padding: "8px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "inline-block" }}>
            <Image
              src="/images/svg/Algora-image.svg"
              alt="Algora Logo"
              width={30}
              height={30}
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Navigation Links */}
          <nav>
            <ul
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li>
                <Link
                  href="/courses"
                  style={{
                    fontFamily: "Tahoma, sans-serif",
                    fontSize: "11px",
                    color: "#000080",
                    textDecoration: "underline",
                    padding: "2px 6px",
                  }}
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  style={{
                    fontFamily: "Tahoma, sans-serif",
                    fontSize: "11px",
                    color: "#000080",
                    textDecoration: "underline",
                    padding: "2px 6px",
                  }}
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  style={{
                    fontFamily: "Tahoma, sans-serif",
                    fontSize: "11px",
                    color: "#000080",
                    textDecoration: "underline",
                    padding: "2px 6px",
                  }}
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href="https://x.com/algora_io"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#000080" }}
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href="https://www.linkedin.com/company/algora-io/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#000080" }}
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://www.instagram.com/joinalgora/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#000080" }}
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
