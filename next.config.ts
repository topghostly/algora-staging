import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "algora-user-profiles-bucket.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.paystack.co https://www.youtube.com https://unpkg.com https://vercel.live;
              worker-src 'self' blob:;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://algora-user-profiles-bucket.s3.us-east-1.amazonaws.com https://images.unsplash.com https://lh3.googleusercontent.com https://avatar.iran.liara.run https://i.ytimg.com;
              font-src 'self';
              connect-src 'self' https://*.ingest.de.sentry.io https://*.ingest.sentry.io https://algora-user-profiles-bucket.s3.us-east-1.amazonaws.com https://noembed.com https://cdn.plyr.io;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              frame-src 'self' https://js.paystack.co https://checkout.paystack.com https://standard.paystack.co https://www.youtube.com https://www.youtube-nocookie.com;
              block-all-mixed-content;
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "algora-learn-bz",
  project: "algora-learn-nextjs",
  silent: !process.env.CI,
  tunnelRoute:
    process.env.NODE_ENV === "production" ? "/monitoring" : undefined,
});
