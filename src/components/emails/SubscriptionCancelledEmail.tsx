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

interface SubscriptionCancelledEmailProps {
  userName: string;
}

export const SubscriptionCancelledEmail = ({
  userName,
}: SubscriptionCancelledEmailProps) => {
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
      <Preview>Your subscription has been cancelled and downgraded to FREE.</Preview>

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
          {/* Header image using cohesive dark brand coloring */}
          <Section
            style={{
              backgroundImage:
                "url(https://i.ibb.co/qYx4G0x3/wmremove-transformed.png)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              height: "240px",
              textAlign: "center",
              backgroundColor: "#1f2937", 
            }}
          >
            <Text style={heroText}>Subscription Cancelled</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={text}>
              Hi {userName}, your premium subscription has been successfully cancelled. Your account has now been downgraded to the <strong>FREE</strong> plan.
            </Text>

            <Section style={detailsContainer}>
              <Text style={detailsText}>
                You will no longer be billed. You still have access to our free tier content and can continue learning with us! You can easily upgrade back to a premium plan at any time to regain full access.
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button href={process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/pricing` : "https://joinalgora.com/pricing"} style={button}>
                View Plans & Upgrade
              </Button>
            </Section>

            <Text style={mutedText}>
              We'll be here whenever you're ready to upgrade again. Keep building!
            </Text>
          </Section>
        </Container>
        <Section style={spacer} />
      </Body>
    </Html>
  );
};

export default SubscriptionCancelledEmail;

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
  width: "300px",
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
  backgroundColor: "#f3f4f6", // Light gray
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
  border: "1px solid #e5e7eb",
};

const detailsText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4b5563",
  margin: "4px 0",
  textAlign: "center" as const,
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
  backgroundColor: "#1f2937", // Dark gray button
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 28px",
  textDecoration: "none",
  display: "inline-block",
};
