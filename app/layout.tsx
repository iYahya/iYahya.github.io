import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo, DM_Sans, Syne } from "next/font/google";

import { ThemeScript } from "@/components/ThemeScript";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iyahya.github.io"),
  title: "Yahia — React Native & Front-End Developer",
  description:
    "React Native and front-end developer. 8+ years, 30+ published apps. Based in Mansoura, Egypt.",
  openGraph: {
    title: "Yahia — Portfolio",
    description: "React Native and front-end developer portfolio.",
    images: [{ url: "/assets/og-image.png" }],
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='24' font-size='20' font-family='system-ui,sans-serif' fill='%2300d4ff'%3EYH%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${dmSans.variable} ${syne.variable} ${cairo.variable}`}>{children}</body>
    </html>
  );
}
