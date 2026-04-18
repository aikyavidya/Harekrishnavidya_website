
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/mainheader";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/Whatsapp";
import ScrollButtons from "./components/ScrollButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hare Krishna Movement   | Annadaan, Vidya Daan & Seva – HARE KRISHNA MOVEMENT  ",
  description: "Support Hare Krishna Movement   through Annadaan, Vidya Daan & spiritual initiatives. Join us in spreading values, serving meals & educating children.",
  keywords: "Hare Krishna Movement   Annadaan, Hare Krishna Movement   Seva, Donate to Hare Krishna Movement  , HARE KRISHNA MOVEMENT  ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="facebook-domain-verification" content="rcwjc3ukylcext6a4w0pdz2m4wa30p" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              "name": "ISKCON - HARE KRISHNA MOVEMENT  ",
              "alternateName": "Hare Krishna Golden Temple Hyderabad",
              "url": "https://iskcon-website-mmwe.vercel.app/",
              "logo": "https://iskcon-website-mmwe.vercel.app/logo.png",
              "founder": {
                "@type": "Person",
                "name": "A.C. Bhaktivedanta Swami Srila Prabhupada"
              },
              "slogan": "Serving Humanity through Annadaan, Vidya Daan & Seva",
              "description": "ISKCON (International Society for Krishna Consciousness) promotes spiritual growth, Annadaan, Vidya Daan, and seva initiatives. Support ISKCON's mission to spread Krishna Consciousness globally.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hare Krishna Golden Temple, Road No. 12, MLA Colony, Banjara Hills",
                "addressLocality": "Hyderabad",
                "addressRegion": "Telangana",
                "postalCode": "500034",
                "addressCountry": "IN"
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-8019397108",
                  "contactType": "Customer Support",
                  "areaServed": "IN",
                  "availableLanguage": ["English", "Hindi", "Telugu"]
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-8328389862",
                  "contactType": "Customer Support",
                  "areaServed": "IN",
                  "availableLanguage": ["English", "Hindi", "Telugu"]
                }
              ],
              "email": "aikyavidya@hkmhyderabad.org",
              "sameAs": [
                "https://shorturl.at/Dtutn",
                "https://www.instagram.com/harekrishnavidya_official/",
                "https://www.youtube.com/@HarekrishnaVidya"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Donation Programs",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Annadaan Donation",
                      "description": "Support ISKCON's Annadaan initiative to serve free meals."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Vidya Daan Donation",
                      "description": "Contribute towards education for underprivileged children."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "General Seva Donation",
                      "description": "Donate for seva activities and temple maintenance."
                    }
                  }
                ]
              }
            })
          }}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Header />
        <ScrollButtons />
        <WhatsAppButton />
        {children}
        <Footer />
      </body>
    </html>
  );
}
