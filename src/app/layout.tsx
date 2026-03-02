import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { COMPANY, SITE } from "@/lib/constants";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.name} | ${COMPANY.tagline}`,
    template: `%s | ${COMPANY.name}`,
  },
  description: "Integrated IoT solutions for CIC DevB Smart Site Safety System compliance in Hong Kong. Smart helmets, environmental monitoring, AI surveillance, and more.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: SITE.ogLocale,
    alternateLocale: SITE.ogAlternateLocale,
    siteName: COMPANY.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
