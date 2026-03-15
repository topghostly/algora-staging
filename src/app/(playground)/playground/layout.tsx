import type { Metadata } from "next";
import localFont from "next/font/local";
import "./global.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";
import PlaygroundNav from "./components/playground-nav";
import { T } from "./components/constants";

// const outfit = Nata_Sans({ subsets: ["latin"] });

// const stackSans = localFont({
//   src: "./fonts/StackSansHeadline.ttf",
//   variable: "--font-stack",
//   weight: "100 900",
//   display: "swap",
// });

// const euclid = localFont({
//   src: [
//     {
//       path: "./fonts/Euclid-Light.ttf",
//       weight: "300",
//       style: "normal",
//     },
//     {
//       path: "./fonts/Euclid-Regular.ttf",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "./fonts/Euclid-Medium.ttf",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "./fonts/Euclid-SemiBold.ttf",
//       weight: "600",
//       style: "normal",
//     },
//     {
//       path: "./fonts/Euclid-Bold.ttf",
//       weight: "700",
//       style: "normal",
//     },
//   ],
//   variable: "--font-euclid",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Algora - Master Tech Skills",
  description: "Structured, project-based learning for African tech talent.",
  icons: {
    icon: "/images/algora.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        {/* <body className={euclid.className} suppressHydrationWarning> */}
        <Providers>
          <div
            className="flex flex-col min-h-screen"
            style={{
              background: `radial-gradient(ellipse at 15% 0%, #0a1628 0%, ${T.ink} 65%)`,
            }}
          >
            <PlaygroundNav />
            <main className="grow ">{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
