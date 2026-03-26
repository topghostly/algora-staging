import React from "react";
import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy ",
  description: "Privacy Policy for the Algora platform",
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
          <h3 className=" mb-4">Introduction</h3>
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
          <h3 className=" mb-4">Information We Collect</h3>
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

        <section className="mb-8">
          <h3 className=" mb-4">Use of Third-Party Services</h3>
          <p className="mb-4">
            Our platform relies on trusted third-party services to securely and
            efficiently handle authentication, payments, and infrastructure.
          </p>
          <p className="mb-4 ">
            Specifically, we use Google Services (Google OAuth / Google Sign-In)
            for user authentication and scheduling functionality.
          </p>
          <ul className="list-disc pl-6 mb-4 flex flex-col gap-2">
            <li>
              <p>
                <strong>Shared Data:</strong> During authentication, Google
                provides us with limited user information necessary to create
                and manage your account. This includes your email address, name,
                and basic profile information such as your profile image (if
                available).
              </p>
            </li>
            <li>
              <p>
                <strong>OAuth Scopes:</strong> We request only the minimum
                necessary Google OAuth scopes required for functionality,
                including basic profile information (<code>openid</code>,{" "}
                <code>email</code>, <code>profile</code>) for authentication,
                and Google Calendar access (
                <code>https://www.googleapis.com/auth/calendar.events</code>)
                strictly for scheduling tutoring sessions. We do not request
                access to sensitive data such as Gmail, Google Drive, or
                contacts.
              </p>
            </li>
            <li>
              <p>
                <strong>No Passwords Stored:</strong> Authentication is securely
                handled by Google. We do not collect, process, or store your
                passwords on our platform.
              </p>
            </li>
            <li>
              <p>
                <strong>Data Processing Control:</strong> We do not control how
                Google processes or stores your data on their systems. We
                recommend reviewing{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google’s Privacy Policy
                </a>{" "}
                for more information on their practices.
              </p>
            </li>
            <li>
              <p>
                <strong>Google Calendar & Meet (Tutors Only):</strong> Tutors
                may optionally connect their Google Calendar to enable automated
                scheduling of tutoring sessions. With your explicit consent, we
                request permission to create and manage calendar events related
                only to sessions booked through our platform, including adding
                session details and generating Google Meet links. We do not
                access, read, or modify any calendar events unrelated to
                sessions created through our platform. This access is used
                strictly to support core functionality and can be revoked at any
                time through your Google account settings.
              </p>
            </li>
            <li>
              <p>
                <strong>Limited Use:</strong> We only request access to Google
                user data that is necessary to provide core platform
                functionality. We do not sell, rent, or share your data with
                third parties for advertising or marketing purposes. We do not
                use Google user data for training artificial intelligence or
                machine learning models. Algora's use and transfer of
                information received from Google APIs complies with{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className=" mb-4">How We Use Your Information</h3>
          <p className="mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 flex flex-col gap-2 mb-4">
            <li>
              <p>
                To authenticate your identity and provide secure access to your
                account and courses.
              </p>
            </li>
            <li>
              <p>
                To personalize your learning experience and track your progress.
              </p>
            </li>
            <li>
              <p>
                To manage subscriptions, process payments, and facilitate
                mentorship sessions.
              </p>
            </li>
            <li>
              <p>
                To synchronize tutoring sessions with Google Calendar and
                generate Google Meet links for connected tutor accounts.
              </p>
            </li>
            <li>
              <p>
                To improve, maintain, and optimize platform performance and user
                experience.
              </p>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className=" mb-4">Data Storage and Security</h3>
          <p className="mb-4">
            We implement industry-standard security measures, including
            encryption in transit and restricted access controls, to protect
            your data from unauthorized access, alteration, or disclosure.
          </p>
          <p className="mb-4">
            We retain personal data only for as long as necessary to provide our
            services and comply with applicable legal obligations.
          </p>
        </section>

        <section className="mb-8">
          <h3 className=" mb-4">User Rights</h3>
          <p className="mb-4">
            You have the right to access, update, or request deletion of your
            personal data at any time.
          </p>
          <p className="mb-4">
            You also maintain full control over your third-party account
            connections and may revoke our access to your Google account at any
            time through your Google account settings. Once access is revoked,
            we will no longer access or process your Google data.
          </p>
        </section>

        <section className="mb-8">
          <h3 className=" mb-4">Third-Party Links and Services Disclaimer</h3>
          <p className="mb-4">
            Our platform may contain links to external websites and integrate
            third-party services. These services operate independently under
            their own privacy policies, and we are not responsible for their
            data practices.
          </p>
        </section>

        <section className="mb-8">
          <h3 className=" mb-4">Changes to This Policy</h3>
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or legal requirements. When updates are
            made, users will be notified accordingly.
          </p>
        </section>

        <section className="mb-8">
          <h3 className=" mb-4">Contact Information</h3>
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
