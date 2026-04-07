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

interface SubscriptionPaymentFailedEmailProps {
  userName: string;
  subscriptionTier: string;
}

export const SubscriptionPaymentFailedEmail = ({
  userName,
  subscriptionTier,
}: SubscriptionPaymentFailedEmailProps) => {
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
      <Preview>Action Required: Your subscription renewal failed</Preview>

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
          {/* Header image - we can use the same or a generic failure color if we had one, but we'll stick to the cohesive brand styling */}
          <Section
            style={{
              backgroundImage:
                "url(https://i.ibb.co/qYx4G0x3/wmremove-transformed.png)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              height: "240px",
              textAlign: "center",
              backgroundColor: "#b91c1c", // Red-ish context
            }}
          >
            <Text style={heroText}>Payment Failed</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={text}>
              Hi {userName}, we were unable to process your subscription renewal
              for the <strong>{subscriptionTier}</strong> plan.
            </Text>

            <Section style={detailsContainer}>
              <Text style={detailsText}>
                This typically happens due to insufficient funds, an expired
                card, or banking restrictions. Paystack will automatically retry
                the charge shortly. To prevent your subscription from being
                cancelled, please ensure your payment method is up to date.
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button
                href={
                  process.env.NEXT_PUBLIC_APP_URL
                    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
                    : "https://www.joinalgora.com/dashboard/pricing"
                }
                style={button}
              >
                Update Payment Method
              </Button>
            </Section>

            <Text style={mutedText}>
              If you have recently updated your card, you can ignore this email.
            </Text>
          </Section>
        </Container>
        <Section style={spacer} />
      </Body>
    </Html>
  );
};

export default SubscriptionPaymentFailedEmail;

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
  backgroundColor: "#fef2f2", // Light red bg
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
  border: "1px solid #fecaca",
};

const detailsText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#991b1b",
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
  backgroundColor: "#b91c1c", // Red-ish button
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 28px",
  textDecoration: "none",
  display: "inline-block",
};
