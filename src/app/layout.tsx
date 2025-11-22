import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

const siteUrl = "https://michi-application-tracker.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Michi's UniTracker - German Master's Application Tracker",
    template: "%s | Michi's UniTracker",
  },
  description: "Michi's personal tracker for German Master's program applications. Track deadlines, manage applications, and stay organized for Summer 2026.",
  keywords: ["university applications", "German universities", "Master's degree", "application tracker", "DAAD", "study in Germany"],
  authors: [{ name: "Michi" }],
  creator: "Michi",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Michi's UniTracker",
    title: "Michi's UniTracker - German Master's Application Tracker",
    description: "Personal tracker for German Master's program applications. Track deadlines, manage applications, and stay organized for Summer 2026.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Michi's UniTracker - German Master's Application Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Michi's UniTracker - German Master's Application Tracker",
    description: "Personal tracker for German Master's program applications. Track deadlines and stay organized.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen font-sans">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
