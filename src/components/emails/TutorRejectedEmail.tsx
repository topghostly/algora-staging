import {
  Body,
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

interface TutorRejectedEmailProps {
  tutorName: string;
}

export const TutorRejectedEmail = ({ tutorName }: TutorRejectedEmailProps) => {
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
      <Preview>Update on your Algora tutor application</Preview>

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
            <Text style={heroText}>Application Update</Text>
          </Section>

          <Section style={content}>
            <Text style={text}>
              Hi {tutorName}, thank you for your interest in becoming a tutor on
              Algora. After reviewing your application, we are unable to approve
              your account at this time.
            </Text>

            <Text style={text}>
              If you believe this is an error or would like more information,
              please don't hesitate to reach out to our support team.
            </Text>

            <Text style={mutedText}>
              Contact us at{" "}
              <a href="mailto:support@joinalgora.com" style={{ color: "#00897B" }}>
                support@joinalgora.com
              </a>{" "}
              for more details.
            </Text>
          </Section>
        </Container>
        <Section style={spacer} />
      </Body>
    </Html>
  );
};

export default TutorRejectedEmail;

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

const brandContainer = { textAlign: "center" as const, marginBottom: "10px" };
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

const mutedText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#6b7280",
  textAlign: "center" as const,
  marginTop: "24px",
};
