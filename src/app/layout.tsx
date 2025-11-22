import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Michi's UniTracker - Master's Application Tracker",
  description: "Michi's personal tracker for German Master's program applications",
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
