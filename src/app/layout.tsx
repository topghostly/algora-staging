import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const outfit = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Algora - Master Tech Skills",
  description: "Structured, project-based learning for African tech talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
