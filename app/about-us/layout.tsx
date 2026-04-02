import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Hare Krishna Movement India | Our Mission, Vision & Values",
  description: "Learn about Hare Krishna Movement India's mission of Annadaan, education, and spreading Krishna consciousness. Discover our values and the people behind the movement.",
  keywords: "Hare Krishna Movement India About, Hare Krishna Mission, Hare Krishna Values, Krishna Consciousness",
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
