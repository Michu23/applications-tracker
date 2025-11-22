import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "UniTracker - University Application Tracker",
  description: "Track and manage your university applications with ease",
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
