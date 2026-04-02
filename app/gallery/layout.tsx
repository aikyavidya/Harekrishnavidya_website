import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hare Krishna Movement  Gallery | Annadaan & Seva Moments",
  description: "Browse Hare Krishna Movement's photo gallery showcasing Annadaan, Vidya Daan, seva activities, and community programs. See the impact of your support.",
  keywords: "Hare Krishna Movement Gallery, Annadaan photos, Hare Krishna Movement  seva events",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
