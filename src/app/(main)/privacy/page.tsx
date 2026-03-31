import React from "react";
import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Algora",
  description:
    "Privacy Policy and Google API Disclosure for the Algora platform",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main
        className="mx-auto px-4 max-w-4xl"
        style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        <h1 className="mb-8">Privacy Policy</h1>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">Introduction</h3>
          <p className="mb-4">
            Algora operates this platform to provide a high-quality learning
            experience, comprehensive courses, and structured mentorship to
            support your career growth.
          </p>
          <p className="mb-4">
            We are fully committed to protecting your privacy and ensuring
            transparency in how we handle your personal information. This
            Privacy Policy explains how we collect, use, and safeguard your
            data.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            Information We Collect
          </h3>
          <h3 className="text-xl font-medium mb-2">
            Data Provided Directly by Users
          </h3>
          <p className="mb-4">
            When you interact with our platform, you provide certain information
            directly, including your profile details, learning progress,
            payment-related information, and communications with mentors.
          </p>
          <h3 className="text-xl font-medium mb-2">
            Data Collected Automatically
          </h3>
          <p className="mb-4">
            We automatically collect technical data necessary to operate and
            secure the platform, including device information, log data, session
            activity, and authentication metadata obtained through your selected
            third-party authentication provider.
          </p>
        </section>

        {/* GOOGLE API DISCLOSURE SECTION - UPDATED FOR VERIFICATION */}
        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            Use of Third-Party Services & Google API Disclosure
          </h3>
          <p className="mb-4">
            Our platform relies on trusted third-party services to securely and
            efficiently handle authentication, payments, and infrastructure.
            Specifically, we use Google Services (Google OAuth / Google Sign-In)
            for user authentication and scheduling functionality.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <p className="font-bold mb-4">Google API Limited Use Disclosure</p>
            <p className="mb-4 ">
              Algora’s use and transfer of information received from Google APIs
              to any other app will adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </div>

          <ul className="list-disc pl-6 mb-4 flex flex-col gap-4">
            <li>
              <p>
                <strong>Shared Data:</strong> During authentication, Google
                provides us with limited user information necessary to create
                and manage your account. This includes your email address, name,
                and basic profile image.
              </p>
            </li>
            <li>
              <p>
                <strong>OAuth Scopes & Usage:</strong> We request the minimum
                necessary Google OAuth scopes:
              </p>
              <ul className="list-circle pl-8 mt-2 space-y-1">
                <li>
                  <code>openid, email, profile</code>: To authenticate your
                  identity and secure your account.
                </li>
                <li>
                  <code>https://www.googleapis.com/auth/calendar.events</code>:
                  Strictly used by tutors to schedule tutoring sessions,
                  generate Google Meet links, and manage session timing.
                </li>
              </ul>
            </li>
            <li>
              <p>
                <strong>Google Calendar Specifics:</strong> With your explicit
                consent, we access your calendar only to create and manage
                events related to sessions booked through Algora. We do not
                read, modify, or delete any events, or access any other
                calendars that are not created by our platform.
              </p>
            </li>
            <li>
              <p>
                <strong>No Data Selling or AI Training:</strong> We do not sell,
                rent, or share your Google user data with third parties for
                advertising or marketing purposes. Furthermore, we do not use
                Google user data to train artificial intelligence or machine
                learning models.
              </p>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            How We Use Your Information
          </h3>
          <p className="mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
            <li>To authenticate your identity and provide secure access.</li>
            <li>To personalize your learning experience and track progress.</li>
            <li>To manage subscriptions and process payments.</li>
            <li>
              To synchronize tutoring sessions with Google Calendar and generate
              Google Meet links.
            </li>
            <li>To improve, maintain, and optimize platform performance.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">
            Data Storage, Security & Retention
          </h3>
          <p className="mb-4">
            We implement industry-standard security measures, including
            encryption in transit and restricted access controls.
          </p>
          <p className="mb-4">
            <strong>Retention:</strong> We retain personal data and Google
            API-sourced metadata only for as long as your account is active or
            as needed to provide you with our services. If you delete your
            account, we will purge your personal data from our active databases
            within 30 days, unless required otherwise by law.
          </p>
          <p className="mb-4">
            <strong>Human Access:</strong> Our staff does not access or read
            your Google user data unless specifically required for technical
            support requested by you.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">User Rights</h3>
          <p className="mb-4">
            You have the right to access, update, or request deletion of your
            personal data at any time.
          </p>
          <p className="mb-4">
            <strong>Revocation:</strong> You may revoke Algora&apos;s access to
            your Google account at any time through your{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Security Settings
            </a>
            . Once access is revoked, we will no longer be able to synchronize
            events to your calendar.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold">Contact Information</h3>
          <p className="mb-4">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or your personal data, please contact us at:{" "}
            <strong>support@joinalgora.com</strong>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
