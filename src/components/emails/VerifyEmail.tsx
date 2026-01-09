import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Img,
  Font,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
  verificationLink: string;
}

export const VerifyEmail = ({ verificationLink }: VerifyEmailProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_C-bk.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Verify your email address</Preview>

      <Body style={main}>
        <Section style={spacer} />
        {/* Brand */}
        <Container style={brandContainer}>
          <Img
            src={"https://i.ibb.co/mCgWnhzZ/algora-transparent.png"}
            alt="algora logo"
            width="60"
            height="60"
            style={brand}
          />
        </Container>

        {/* Card */}
        <Container style={card}>
          {/* Header image */}
          <Section
            style={{
              backgroundImage:
                "url(https://i.ibb.co/qYx4G0x3/wmremove-transformed.png)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              height: "240px",
              textAlign: "center",
            }}
          >
            <Text style={heroText}>Verify your email</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={text}>
              Welcome to Algora! Please verify your email address to get started
              and access all features.
            </Text>

            <Section style={buttonContainer}>
              <Button href={verificationLink} style={button}>
                Verify Email
              </Button>
            </Section>

            <Text style={mutedText}>
              If you didn’t create an account, you can safely ignore this email.
              This link expires in 24 hours.
            </Text>
          </Section>
        </Container>
        <Section style={spacer} />
      </Body>
    </Html>
  );
};

export default VerifyEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Helvetica, Manrope, sans-serif",
  padding: "40px 0",
};

const spacer = {
  height: "20px",
};

const heroText = {
  fontSize: "32px",
  fontWeight: "600",
  color: "#ffffff",
  lineHeight: "1.2",
  textAlign: "center" as const,
  padding: "0 auto",
  width: "240px",
  margin: "0 auto",
};

const brandContainer = {
  textAlign: "center" as const,
  marginBottom: "10px",
};

const brand = {
  display: "inline-block",
  margin: "0 auto",
};

const card = {
  backgroundColor: "#f6f7fb",
  borderRadius: "20px",
  overflow: "hidden",
  maxWidth: "560px",
};

const content = {
  padding: "32px",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#374151",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const mutedText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#6b7280",
  textAlign: "center" as const,
  marginTop: "24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#00897B",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 28px",
  textDecoration: "none",
  display: "inline-block",
};
