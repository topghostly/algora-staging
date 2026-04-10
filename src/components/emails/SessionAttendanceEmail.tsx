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

interface SessionAttendanceEmailProps {
  tutorName: string;
  sessionTitle: string;
  date: string;
  time: string;
  confirmUrl: string;
}

export const SessionAttendanceEmail = ({
  tutorName,
  sessionTitle,
  date,
  time,
  confirmUrl,
}: SessionAttendanceEmailProps) => {
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
      <Preview>Did your session &quot;{sessionTitle}&quot; take place?</Preview>

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
          {/* Header */}
          <Section
            style={{
              backgroundImage:
                "url(https://i.ibb.co/qYx4G0x3/wmremove-transformed.png)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              height: "240px",
              textAlign: "center",
              backgroundColor: "#004D40",
            }}
          >
            <Text style={heroText}>Session Check-In</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={text}>
              Hi {tutorName}, your session &quot;{sessionTitle}&quot; was
              scheduled for {date} at {time}. Did it take place?
            </Text>

            <Section style={detailsContainer}>
              <Text style={detailsHeader}>Session Details:</Text>
              <Text style={detailsText}>
                <strong>Date:</strong> {date}
              </Text>
              <Text style={detailsText}>
                <strong>Time:</strong> {time}
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button href={`${confirmUrl}&attended=true`} style={buttonYes}>
                Yes, it happened
              </Button>
            </Section>

            <Section style={buttonContainer}>
              <Button href={`${confirmUrl}&attended=false`} style={buttonNo}>
                No, it didn&apos;t happen
              </Button>
            </Section>

            <Text style={mutedText}>
              Your response helps us keep your session history accurate. If you
              don&apos;t respond within 4 days, the session will be
              automatically marked as cancelled.
            </Text>
          </Section>
        </Container>
        <Section style={spacer} />
      </Body>
    </Html>
  );
};

export default SessionAttendanceEmail;

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

const detailsContainer = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
  border: "1px solid #e5e7eb",
};

const detailsHeader = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "12px",
};

const detailsText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4b5563",
  margin: "4px 0",
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
  margin: "12px 0",
};

const buttonYes = {
  backgroundColor: "#00897B",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 28px",
  textDecoration: "none",
  display: "inline-block",
};

const buttonNo = {
  backgroundColor: "#6b7280",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 28px",
  textDecoration: "none",
  display: "inline-block",
};
