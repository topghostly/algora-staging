import React from "react";
import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Algora",
  description: "Terms of Service for the Algora platform",
};

export default function TermsOfServicePage() {
  return (
    <>
      <main
        className="mx-auto max-w-4xl"
        style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        <h1 className="mb-8">Terms of Service</h1>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">Introduction</h3>
          <p className="mb-4">
            These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of the Algora platform, operated by Algora (&quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;). By accessing or using our
            platform, you agree to be bound by these Terms.
          </p>
          <p className="mb-4">
            If you do not agree with any part of these Terms, you must not use
            our platform.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">Use of the Platform</h3>
          <p className="mb-4">
            Algora provides an online learning platform connecting students with
            tutors for structured mentorship, courses, and tutoring sessions.
            You agree to use the platform only for lawful purposes and in
            accordance with these Terms.
          </p>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
            <li>
              Use the platform in any way that violates applicable laws or
              regulations.
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the platform or
              its related systems.
            </li>
            <li>
              Transmit any unsolicited or unauthorized advertising or
              promotional material.
            </li>
            <li>
              Impersonate any person or entity, or misrepresent your affiliation
              with any person or entity.
            </li>
            <li>
              Engage in any conduct that restricts or inhibits anyone&apos;s use
              or enjoyment of the platform.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">User Accounts</h3>
          <p className="mb-4">
            To access certain features of the platform, you must register for an
            account. You are responsible for maintaining the confidentiality of
            your account credentials and for all activities that occur under
            your account.
          </p>
          <p className="mb-4">
            You agree to provide accurate, current, and complete information
            during registration and to keep your account information up to date.
            We reserve the right to suspend or terminate your account if any
            information provided is inaccurate, incomplete, or fraudulent.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            Subscriptions & Payments
          </h3>
          <p className="mb-4">
            Certain features of the platform are available on a subscription
            basis. By subscribing, you agree to pay the applicable fees as
            described on our platform. All payments are processed securely
            through our payment provider, Paystack.
          </p>
          <p className="mb-4">
            Subscriptions automatically renew unless cancelled before the
            renewal date. You may cancel your subscription at any time through
            your account settings. Upon cancellation, you will retain access
            until the end of your current billing period.
          </p>
          <p className="mb-4">
            We reserve the right to modify subscription pricing with reasonable
            prior notice. Continued use of the platform after a price change
            constitutes acceptance of the new pricing.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            Tutoring Sessions & Google Calendar
          </h3>
          <p className="mb-4">
            Algora facilitates the scheduling of tutoring sessions between
            students and tutors. With your explicit consent, we integrate with
            Google Calendar to create and manage session events and generate
            Google Meet links on your behalf.
          </p>
          <p className="mb-4">
            You may revoke calendar access at any time through your{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Account settings
            </a>
            . Once revoked, we will no longer be able to create or manage
            calendar events for you.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">Intellectual Property</h3>
          <p className="mb-4">
            All content on the Algora platform, including but not limited to
            text, graphics, logos, course materials, and software, is the
            property of Algora or its content providers and is protected by
            applicable intellectual property laws.
          </p>
          <p className="mb-4">
            You are granted a limited, non-exclusive, non-transferable licence
            to access and use the platform for your personal, non-commercial
            purposes. You may not reproduce, distribute, modify, or create
            derivative works from any platform content without our prior written
            consent.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            Disclaimer of Warranties
          </h3>
          <p className="mb-4">
            The platform is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis without warranties of any kind, either express
            or implied. We do not warrant that the platform will be
            uninterrupted, error-free, or free of viruses or other harmful
            components.
          </p>
          <p className="mb-4">
            We do not guarantee the accuracy, completeness, or usefulness of any
            content provided on the platform, including content provided by
            tutors.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            Limitation of Liability
          </h3>
          <p className="mb-4">
            To the fullest extent permitted by law, Algora shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of or inability to use the platform,
            even if we have been advised of the possibility of such damages.
          </p>
          <p className="mb-4">
            Our total liability to you for any claim arising from these Terms or
            your use of the platform shall not exceed the amount you paid to us
            in the twelve months preceding the claim.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">Termination</h3>
          <p className="mb-4">
            We reserve the right to suspend or terminate your access to the
            platform at our discretion, with or without notice, for conduct that
            we believe violates these Terms or is harmful to other users, us, or
            third parties.
          </p>
          <p className="mb-4">
            You may terminate your account at any time by contacting us at{" "}
            <strong>support@joinalgora.com</strong>. Upon termination, your
            right to use the platform will immediately cease.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            Changes to These Terms
          </h3>
          <p className="mb-4">
            We may update these Terms from time to time. We will notify you of
            significant changes by posting the new Terms on this page with an
            updated date. Your continued use of the platform after changes are
            posted constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">Governing Law</h3>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with
            applicable laws. Any disputes arising under these Terms shall be
            subject to the exclusive jurisdiction of the competent courts.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">Contact Us</h3>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:{" "}
            <strong>support@joinalgora.com</strong>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
