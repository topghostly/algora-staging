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
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.paystack.co;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://algora-user-profiles-bucket.s3.us-east-1.amazonaws.com https://images.unsplash.com;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              frame-src 'self' https://js.paystack.co https://standard.paystack.co;
              block-all-mixed-content;
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-src 'self' https://js.paystack.co https://standard.paystack.co https://www.youtube.com https://www.youtube-nocookie.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
