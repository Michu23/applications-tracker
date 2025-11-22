import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description: "Essential links and resources for applying to German Master's programs - DAAD, Uni-Assist, top universities, scholarships, and application deadlines for Summer 2026.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "My Resources | Michi's UniTracker",
    description: "Essential links for German Master's applications - DAAD, Uni-Assist, top universities, scholarships, and deadlines for Summer 2026.",
    url: "https://michi-application-tracker.vercel.app/resources",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
