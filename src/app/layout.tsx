import type { Metadata } from "next";
import { Nata_Sans } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";

const outfit = Nata_Sans({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
