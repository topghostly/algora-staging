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

interface TutorApplicationEmailProps {
  tutorName: string;
  tutorEmail: string;
  specialties: string[];
  bio: string;
  resumeLink: string | null;
  adminUrl: string;
}

export const TutorApplicationEmail = ({
  tutorName,
  tutorEmail,
  specialties,
  bio,
  resumeLink,
  adminUrl,
}: TutorApplicationEmailProps) => {
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
      <Preview>New tutor application pending review — {tutorName}</Preview>

      <Body style={main}>
        <Section style={spacer} />
        <Container style={brandContainer}>
          <Img
            src={"https://i.ibb.co/mCgWnhzZ/algora-transparent.png"}
            alt="algora logo"
            width="60"
            height="60"
            style={brand}
          />
        </Container>

        <Container style={card}>
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
            <Text style={heroText}>New Tutor Application</Text>
          </Section>

          <Section style={content}>
            <Text style={text}>
              A new tutor has completed onboarding and is awaiting vetting.
            </Text>

            <Section style={detailsContainer}>
              <Text style={detailsHeader}>Applicant Details:</Text>
              <Text style={detailsText}>
                <strong>Name:</strong> {tutorName}
              </Text>
              <Text style={detailsText}>
                <strong>Email:</strong> {tutorEmail}
              </Text>
              <Text style={detailsText}>
                <strong>Specialties:</strong> {specialties.join(", ") || "None listed"}
              </Text>
              <Text style={detailsText}>
                <strong>Bio:</strong> {bio || "No bio provided"}
              </Text>
              {resumeLink && (
                <Text style={detailsText}>
                  <strong>Resume:</strong>{" "}
                  <a href={resumeLink} style={{ color: "#00897B" }}>
                    View Resume (PDF)
                  </a>
                </Text>
              )}
            </Section>

            <Section style={buttonContainer}>
              <Button href={adminUrl} style={button}>
                Review in Admin Dashboard
              </Button>
            </Section>

            <Text style={mutedText}>
              Please review this application and approve or reject it within 3
              working days. The applicant has been informed they will hear back
              within this timeframe.
            </Text>
          </Section>
        </Container>
        <Section style={spacer} />
      </Body>
    </Html>
  );
};

export default TutorApplicationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Helvetica, Manrope, sans-serif",
  padding: "40px 0",
};

const spacer = { height: "20px" };

const heroText = {
  fontSize: "32px",
  fontWeight: "600",
  color: "#ffffff",
  lineHeight: "1.2",
  textAlign: "center" as const,
  width: "240px",
  margin: "0 auto",
};

const brandContainer = {
  textAlign: "center" as const,
  marginBottom: "10px",
};

const brand = { display: "inline-block", margin: "0 auto" };

const card = {
  backgroundColor: "#f6f7fb",
  borderRadius: "20px",
  overflow: "hidden",
  maxWidth: "560px",
};

const content = { padding: "32px" };

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
