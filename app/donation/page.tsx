"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
// import { useRouter } from "next/navigation";

import { useMediaQuery } from "react-responsive";
import useUTM from "../utils/useUTM";
import mobileImg from "@/public/images/enrichBanner.jpg";
import tabletImg from "@/public/images/enrichBanner.jpg";
import desktopImg from "@/public/images/enrichBanner.jpg";

// import k3 from "../../public/images/k3.png";
// import k1 from "../../public/images/k1.png";
// import k4 from "../../public/images/k4.png";
// import k5 from "../../public/images/k5.png";
// import k2 from "../../public/images/k2.png";
// import phn from "../../public/images/phn.png";
// import upi_qr from "../../public/newQR.png";

import dig1 from "@/public/dig1.jpg";
import dig3 from "@/public/dig2.jpg";

import edu1 from "@/public/galleryection/education7.jpg";
import fest1 from "@/public/galleryection/food01.jpg";
import value from "@/public/galleryection/food04.jpg";
import yoga1 from "@/public/galleryection/food2.jpg";
import edu2 from "@/public/galleryection/edu2.jpg";
import fest2 from "@/public/galleryection/foodDonation.jpg";
import cul1 from "@/public/galleryection/cul1.jpg";
import edu3 from "@/public/galleryection/education3.jpg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const galleryImages = [
  { src: fest1, alt: "Gallery 1" },
  { src: edu1, alt: "Gallery 3" },
  { src: fest2, alt: "Gallery 2" },
  { src: edu3, alt: "Gallery 3" },
  { src: value, alt: "Gallery 3" },
  { src: yoga1, alt: "Gallery 3" },
  { src: edu2, alt: "Gallery 3" },
  { src: cul1, alt: "Gallery 3" },
];

// Default/fallback data
const defaultDonationOptions = [
  // { children: 50, amount: 1350 },
  { children: 100, amount: 2700 },
  { children: 200, amount: 5400 },
  { children: 300, amount: 8100 },
  { children: 500, amount: 13500 },
  { children: 1000, amount: 27000 },
  { children: 1500, amount: 40500 },
  { children: 3000, amount: 81000 },
  { children: 5000, amount: 135000 },
  { children: 10000, amount: 270000 },
];

const defaultSponsorshipOptions = [
  { children: 1, amount: 12000 },
  { children: 2, amount: 24000 },
  { children: 4, amount: 48000 },
  { children: 8, amount: 98000 },
  { children: 9, amount: 108000 },
];

const defaultAcademicYearOptions = [
  { children: 1, amount: 5000 },
  { children: 3, amount: 15000 },
  { children: 5, amount: 25000 },
];

const defaultMonthlyOptions = [
  { children: 5, amount: 2500 },
  { children: 10, amount: 5000 },
  { children: 25, amount: 12500 },
  { children: 50, amount: 25000 },
  { children: 75, amount: 37500 },
  { children: 100, amount: 50000 },
  { children: 150, amount: 75000 },
  { children: 200, amount: 100000 },
];

const defaultSpecialOptions = [
  {
    title: "Sponsor Education of 1 Entire Village for 1 Whole Year",
    amount: 150000,
  },
  {
    title: "Sponsor Education of 1 Entire Village for 1 Month",
    amount: 12500,
  },
];

// API Types
interface DonationCard {
  _id: string;
  category: "food" | "giftFuture" | "giftLearning";
  text: string;
  yearText?: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    giftFuture?: DonationCard[];
    giftLearning?: DonationCard[];
    food?: DonationCard[];
  };
}

type FoodDonationOption =
  | { key: string; children: number; amount: number }
  | { key: string; title: string; amount: number };

type GiftFutureOption =
  | { key: string; children: number; amount: number; yearText?: string }
  | { key: string; title: string; amount: number; yearText?: string };

type GiftLearningOption =
  | { key: string; children: number; amount: number; yearText?: string }
  | { key: string; title: string; amount: number; yearText?: string };

type GiftLearningSpecialOption = { key: string; title: string; amount: number };

// Helper function to extract children count from text
const extractChildrenCount = (text: string): number | null => {
  // Try to extract number from text like "Feed 100 Children", "Sponsor 2 Children", etc.
  const match = text.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};


// Helper function to format numbers in Indian style
const formatIndianCurrency = (amount: number) => {
  return amount.toLocaleString("en-IN");
};

function AnnadanCard({
  childrenCount,
  amount,
  title,
}: {
  childrenCount?: number;
  amount: number;
  title?: string;
}) {
  const { appendUTMToUrl } = useUTM();
  const heading =
    title ?? (childrenCount !== undefined ? `Feed ${childrenCount} Children` : "Donate");
  const purpose =
    title
      ? `${title} - Annadan Seva`
      : childrenCount !== undefined
        ? `Serve ${childrenCount} Children - Annadan Seva`
        : "Annadan Seva";

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-blue-900 hover:border-blue-900">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900"></div>
      <div className="p-8 text-center">
        <h3 className="font-bold text-xl mb-3 text-gray-800 leading-tight">
          {heading}
        </h3>
        <div className="mb-6">
          <span className="text-3xl font-extrabold text-black">
            ₹ {formatIndianCurrency(amount)}
          </span>
        </div>
        <Link
          href={appendUTMToUrl(
            `/donate?purpose=${encodeURIComponent(
              purpose
            )}&amount=${amount}`
          )}
        >
          <button className="bg-gradient-to-r from-blue-900 to-blue-900 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
            Donate Now
          </button>
        </Link>
      </div>
    </div>
  );
}

function AnnadanSpecialCard({
  title,
  amount,
}: {
  title: string;
  amount: number;
}) {
  const { appendUTMToUrl } = useUTM();

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-blue-900 hover:border-blue-900">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900"></div>
      <div className="p-5 text-center">
        <h3 className="font-bold text-xl mb-3 text-gray-800 leading-tight">
          {title}
        </h3>
        <div className="mb-6">
          <span className="text-3xl font-extrabold text-black">
            ₹ {formatIndianCurrency(amount)}
          </span>
        </div>
        <Link
          href={appendUTMToUrl(
            `/donate?purpose=${encodeURIComponent(title)}&amount=${amount}`
          )}
        >
          <button className="bg-gradient-to-r from-blue-900 to-blue-900 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
            Donate Now
          </button>
        </Link>
      </div>
    </div>
  );
}

function AnnadanAnyAmountCard() {
  const { appendUTMToUrl } = useUTM();

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-blue-900">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900"></div>
      <div className="p-8 text-center">
        <h3 className="font-bold text-xl mb-3 text-gray-800 leading-tight">
          Donate Any Amount
        </h3>
        <div className="mb-6">
          <span className="text-2xl font-semibold text-gray-500">
            ------------
          </span>
        </div>
        <Link
          href={appendUTMToUrl(
            `/donate?purpose=${encodeURIComponent("Annadan Seva - Any Amount")}`
          )}
        >
          <button className="bg-gradient-to-r from-blue-900 to-blue-900 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
            Donate Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function DonationPage() {
  // const router = useRouter();
  const { appendUTMToUrl } = useUTM();

  // State for API data
  const [donationOptions, setDonationOptions] = useState<FoodDonationOption[]>(
    defaultDonationOptions.map(({ children, amount }) => ({
      key: `default-food-${children}`,
      children,
      amount,
    }))
  );
  const [sponsorshipOptions, setSponsorshipOptions] = useState<GiftFutureOption[]>(
    defaultSponsorshipOptions.map(({ children, amount }) => ({
      key: `default-giftFuture-${children}`,
      children,
      amount,
      yearText: "Food and Education for 1 Year",
    }))
  );
  const [academicYearOptions, setAcademicYearOptions] = useState<GiftLearningOption[]>(
    defaultAcademicYearOptions.map(({ children, amount }) => ({
      key: `default-giftLearning-year-${children}`,
      children,
      amount,
      yearText: "for 1 Academic Year",
    }))
  );
  const [monthlyOptions, setMonthlyOptions] = useState<GiftLearningOption[]>(
    defaultMonthlyOptions.map(({ children, amount }) => ({
      key: `default-giftLearning-month-${children}`,
      children,
      amount,
      yearText: "for 1 Month",
    }))
  );
  const [specialOptions, setSpecialOptions] = useState<GiftLearningSpecialOption[]>(
    defaultSpecialOptions.map(({ title, amount }) => ({
      key: `default-giftLearning-special-${title}`,
      title,
      amount,
    }))
  );
  const [, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // State for banner
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Fetch donation amounts from API
  // useEffect(() => {
  //   const fetchDonationAmounts = async () => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);

  //       // Use Next.js API route which will proxy to external API
  //       const apiUrl = '/api/donation-amounts/grouped/by-category';

  //       console.log('Fetching donation amounts from:', apiUrl);

  //       const response = await fetch(apiUrl, {
  //         cache: "no-store",
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (!response.ok) {
  //         console.warn('API request failed, using default values');
  //         // Don't throw error - just use default values
  //         return;
  //       }

  //       const result: ApiResponse = await response.json();

  //       // If API returns success but no data, or if data is empty, use defaults
  //       if (!result.success) {
  //         console.warn('API returned success: false, using default values');
  //         return;
  //       }

  //       if (!result.data) {
  //         console.warn('API returned no data, using default values');
  //         return;
  //       }

  //       // Map food category to donationOptions
  //       if (result.data.food && result.data.food.length > 0) {
  //         const mappedFood = result.data.food
  //           .map((card) => {
  //             const children = extractChildrenCount(card.text);
  //             if (children !== null) {
  //               return { children, amount: card.amount };
  //             }
  //             return null;
  //           })
  //           .filter((item): item is { children: number; amount: number } => item !== null)
  //           .sort((a, b) => a.amount - b.amount);

  //         if (mappedFood.length > 0) {
  //           setDonationOptions(mappedFood);
  //         }
  //       }

  //       // Map giftFuture category to sponsorshipOptions
  //       if (result.data.giftFuture && result.data.giftFuture.length > 0) {
  //         const mappedGiftFuture = result.data.giftFuture
  //           .map((card) => {
  //             const children = extractChildrenCount(card.text);
  //             if (children !== null) {
  //               return { children, amount: card.amount };
  //             }
  //             return null;
  //           })
  //           .filter((item): item is { children: number; amount: number } => item !== null)
  //           .sort((a, b) => a.amount - b.amount);

  //         if (mappedGiftFuture.length > 0) {
  //           setSponsorshipOptions(mappedGiftFuture);
  //         }
  //       }

  //       // Map giftLearning category to academicYearOptions and monthlyOptions
  //       if (result.data.giftLearning && result.data.giftLearning.length > 0) {
  //         const academicYear: { children: number; amount: number }[] = [];
  //         const monthly: { children: number; amount: number }[] = [];
  //         const special: { title: string; amount: number }[] = [];

  //         result.data.giftLearning.forEach((card) => {
  //           const children = extractChildrenCount(card.text);
  //           const lowerText = card.text.toLowerCase();
  //           const lowerYearText = (card.yearText || "").toLowerCase();

  //           // Check if it's a special option (village sponsorship)
  //           if (lowerText.includes("village") || lowerText.includes("entire")) {
  //             special.push({
  //               title: card.text,
  //               amount: card.amount,
  //             });
  //           }
  //           // Check if it's an academic year option
  //           else if (lowerText.includes("academic year") || lowerYearText.includes("academic") || lowerYearText.includes("year")) {
  //             if (children !== null) {
  //               academicYear.push({ children, amount: card.amount });
  //             }
  //           }
  //           // Check if it's a monthly option
  //           else if (lowerText.includes("month") || lowerYearText.includes("month")) {
  //             if (children !== null) {
  //               monthly.push({ children, amount: card.amount });
  //             }
  //           }
  //           // Default to monthly if unsure
  //           else if (children !== null) {
  //             monthly.push({ children, amount: card.amount });
  //           }
  //         });

  //         if (academicYear.length > 0) {
  //           setAcademicYearOptions(academicYear.sort((a, b) => a.amount - b.amount));
  //         }
  //         if (monthly.length > 0) {
  //           setMonthlyOptions(monthly.sort((a, b) => a.amount - b.amount));
  //         }
  //         if (special.length > 0) {
  //           setSpecialOptions(special);
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error fetching donation amounts:", err);
  //       setError(err instanceof Error ? err.message : "Failed to load donation amounts");
  //       // Keep default values on error
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchDonationAmounts();
  // }, []);
  useEffect(() => {
    const fetchDonationAmounts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = 'https://api.harekrishnavidya.org/api/donation-amounts/grouped/by-category';

        console.log('Fetching donation amounts from:', apiUrl);

        const response = await fetch(apiUrl, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.warn("API request failed, using default values");
          return;
        }

        const result: ApiResponse = await response.json();

        if (!result.success || !result.data) {
          console.warn("Invalid API response, using default values");
          return;
        }

        // ---- FOOD ----
        if (result.data.food?.length) {
          const mappedFood = result.data.food
            .map((card): FoodDonationOption => {
              const children = extractChildrenCount(card.text);
              if (children !== null) {
                return { key: card._id, children, amount: card.amount };
              }
              return { key: card._id, title: card.text, amount: card.amount };
            })
            .sort((a, b) => a.amount - b.amount);

          if (mappedFood.length) setDonationOptions(mappedFood);
        }

        // ---- GIFT FUTURE ----
        if (result.data.giftFuture?.length) {
          const mapped = result.data.giftFuture
            .map((card): GiftFutureOption => {
              const children = extractChildrenCount(card.text);
              if (children !== null) {
                return {
                  key: card._id,
                  children,
                  amount: card.amount,
                  yearText: card.yearText,
                };
              }
              return {
                key: card._id,
                title: card.text,
                amount: card.amount,
                yearText: card.yearText,
              };
            })
            .sort((a, b) => a.amount - b.amount);

          if (mapped.length) setSponsorshipOptions(mapped);
        }

        // ---- GIFT LEARNING ----
        if (result.data.giftLearning?.length) {
          const academicYear: GiftLearningOption[] = [];
          const monthly: GiftLearningOption[] = [];
          const special: GiftLearningSpecialOption[] = [];

          result.data.giftLearning.forEach(card => {
            const children = extractChildrenCount(card.text);
            const text = card.text.toLowerCase();
            const yearText = (card.yearText || "").toLowerCase();

            if (text.includes("village") || text.includes("entire")) {
              special.push({ key: card._id, title: card.text, amount: card.amount });
            } else if (text.includes("academic") || yearText.includes("year")) {
              if (children !== null) {
                academicYear.push({
                  key: card._id,
                  children,
                  amount: card.amount,
                  yearText: card.yearText,
                });
              } else {
                academicYear.push({
                  key: card._id,
                  title: card.text,
                  amount: card.amount,
                  yearText: card.yearText,
                });
              }
            } else {
              if (children !== null) {
                monthly.push({
                  key: card._id,
                  children,
                  amount: card.amount,
                  yearText: card.yearText,
                });
              } else {
                monthly.push({
                  key: card._id,
                  title: card.text,
                  amount: card.amount,
                  yearText: card.yearText,
                });
              }
            }
          });

          if (academicYear.length) setAcademicYearOptions(academicYear.sort((a, b) => a.amount - b.amount));
          if (monthly.length) setMonthlyOptions(monthly.sort((a, b) => a.amount - b.amount));
          if (special.length) setSpecialOptions(special.sort((a, b) => a.amount - b.amount));
        }

      } catch (err) {
        console.error("Error fetching donation amounts:", err);
        setError("Failed to load donation amounts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationAmounts();
  }, []);

  // Fetch banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch("https://api.harekrishnavidya.org/api/banner/get", {
          cache: "no-store",
        });
        const data = await response.json();
        if (data.url) {
          // Prepend backend URL if the banner URL is relative
          const fullUrl = data.url.startsWith("http")
            ? data.url
            : `https://api.harekrishnavidya.org${data.url}`;
          setBannerUrl(fullUrl);
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
      }
    };
    fetchBanner();
  }, []);

  // const vidyaDaanHandleClick = () => {
  //   const url = `/donate?purpose=${encodeURIComponent(
  //     "Vidhya Daan - Any Amount"
  //   )}`;
  //   router.push(appendUTMToUrl(url));
  // };

  // const anadanHandleClick = () => {
  //   const purpose = "Annadan Seva - Any Amount";
  //   const url = `/donate?purpose=${encodeURIComponent(purpose)}`;
  //   router.push(appendUTMToUrl(url));
  // };

  // const TeachingHandleClick = () => {
  //   const url = `/donate?purpose=${encodeURIComponent(
  //     "Sponsor a Child - Any Amount"
  //   )}`;
  //   router.push(appendUTMToUrl(url));
  // };
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  return (
    <>
      <div className="relative w-full  md:aspect-[16/8]   aspect-[10/5]   overflow-hidden">
        {/* <Image
          src="/home/home_img.jpeg"
          alt="Donation Banner"
          fill
          className="object-cover lg:px-3"
          priority
        /> */}

        <Image
          src={bannerUrl || (isMobile ? mobileImg : isTablet ? tabletImg : desktopImg)}
          alt="Donation Banner"
          fill
          className="object-cover lg:px-3"
          priority
        />
        {/* <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg text-lg h-14 px-8" asChild>
            <Link href="#donate">
              <Heart className="w-5 h-5 mr-2" />
              Support Our Mission
            </Link>
          </Button>
        </div> */}
      </div>

      <div className="text-center py-10  text-2xl  md:text-3xl font-bold   md:max-w-6xl mx-auto">
        We are providing{" "}
        <span className="text-orange-500">Free Food, Education </span> and
        Values for life based on Bhagavad-Gita to underprivileged in{" "}
        <span className="text-orange-500"> Rural Areas of India</span>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-10 max-w-6xl mx-auto">
        <div className="flex-1">
          <Image
            src={dig1}
            alt="idji1"
            className="object-contain w-full h-auto"
          />
        </div>
        <div className="flex-1">
          <Image
            src={dig3}
            alt="idji2"
            className="object-contain w-full h-auto"
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="mt-4 md:mt-0 bg-orange-500 text-white text-center py-3 rounded-md  max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold">
          Our Trustee Shri Madhu Pandit Dasa
        </h3>
        <p className="text-md mt-1">
          Striving to please spiritual Master Srila Prabhupada, a true visionary
          who wanted to see a hunger free world.
        </p>
      </div>
      {/* Quick Access Navigation */}

      <div id="donate" className="bg-white text-center py-8 px-4">
        <button className="bg-gray-200 text-black font-semibold px-4 py-2 rounded-full mb-4 text-[36px]">
          ✧ Annadan Seva
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold italic">
          Serve Love Through <span className="text-blue-900">Food</span>
        </h2>

        <p className="text-gray-600 mt-2 mb-10 max-w-xl mx-auto">
          &quot;Join our sacred mission to feed hungry souls. Every meal you
          fund is prasadam blessed, nourishing, and life-changing.&quot;
        </p>

        {/* All donation cards visible on all screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {donationOptions.map((opt) =>
            "children" in opt ? (
              <AnnadanCard
                key={opt.key}
                childrenCount={opt.children}
                amount={opt.amount}
              />
            ) : (
              <AnnadanCard key={opt.key} title={opt.title} amount={opt.amount} />
            )
          )}
        </div>

        {/* Special Section Centered */}
        <div className="mt-16 flex flex-col items-center gap-12">
          {/* Donate Any Amount - Center */}
          <div className="max-w-sm w-full">
            <AnnadanAnyAmountCard />
          </div>

          {/* Sponsor Village block */}
          <div className="flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto">
            <div className="flex-1">
              <AnnadanSpecialCard
                title="Sponsor Anna-Daan of 1 Entire Village for 1 Whole Year"
                amount={270000}
              />
            </div>
            <div className="flex-1">
              <AnnadanSpecialCard
                title="Sponsor Anna-Daan of 1 Entire Village for 1 Month"
                amount={18000}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white text-center py-8 px-4 text-black">
        <button className="bg-gray-200 text-black font-semibold px-4 py-2 rounded-full mb-6 text-[36px]">
          ✧ Vidhya Dana Seva
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold italic mb-2">
          Gift the Light of <span className="text-orange-500">Learning</span>
        </h2>

        <p className="text-gray-500 max-w-xl mx-auto mb-10">
          &quot;Through your support, children gain not just education, but
          purpose and inner strength.&quot;
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* First 2 Academic Year Options */}
          <>
            {academicYearOptions.slice(0, 2).map((opt) => (
              <div
                key={opt.key}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-orange-500"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-500"></div>

                <div className="p-8">
                  <h3 className="font-bold text-xl text-gray-800 mb-1">
                    {"children" in opt
                      ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""} Education`
                      : opt.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {opt.yearText || "for 1 Academic Year"}
                  </p>
                  <p className="text-3xl font-extrabold text-black mb-6">
                    ₹ {formatIndianCurrency(opt.amount)}
                  </p>
                  <Link
                    href={appendUTMToUrl(
                      `/donate?purpose=${encodeURIComponent(
                        "children" in opt
                          ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""} Education for 1 Academic Year`
                          : opt.title
                      )}&amount=${opt.amount}`
                    )}
                  >
                    <button className="bg-gradient-to-r from-orange-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl  transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-fit cursor-pointer">
                      Donate Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}

            {/* Remaining Academic Year Options - only shown on lg+ */}
            <div className="hidden lg:contents">
              {academicYearOptions.slice(2).map((opt) => (
                <div
                  key={opt.key}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-orange-500"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-500 "></div>

                  <div className="p-8">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">
                      {"children" in opt
                        ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""} Education`
                        : opt.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {opt.yearText || "for 1 Academic Year"}
                    </p>
                    <p className="text-3xl font-extrabold text-black mb-6">
                      ₹ {formatIndianCurrency(opt.amount)}
                    </p>
                    <Link
                      href={appendUTMToUrl(
                        `/donate?purpose=${encodeURIComponent(
                          "children" in opt
                            ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""} Education for 1 Academic Year`
                            : opt.title
                        )}&amount=${opt.amount}`
                      )}
                    >
                      <button className="bg-gradient-to-r from-orange-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl  transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-fit cursor-pointer">
                        Donate Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>

          {/* Monthly Options */}
          {monthlyOptions.slice(0).map((opt) => (
            <div
              key={opt.key}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-orange-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-500"></div>

              <div className="p-8">
                <h3 className="font-bold text-xl text-gray-800 mb-1">
                  {"children" in opt
                    ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""} Education`
                    : opt.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{opt.yearText || "for 1 Month"}</p>
                <p className="text-3xl font-extrabold text-black mb-6">
                  ₹ {formatIndianCurrency(opt.amount)}
                </p>
                <Link
                  href={appendUTMToUrl(
                    `/donate?purpose=${encodeURIComponent(
                      "children" in opt
                        ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""} Education for 1 Month`
                        : opt.title
                    )}&amount=${opt.amount}`
                  )}
                >
                  <button className="bg-gradient-to-r from-orange-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl  transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-fit cursor-pointer">
                    Donate Now
                  </button>
                </Link>
              </div>
            </div>
          ))}

          {/* Special Options */}
          {specialOptions.map(({ key, title, amount }) => (
            <div
              key={key}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-orange-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-500"></div>

              <div className="p-8">
                <h3 className="font-semibold text-lg text-center text-gray-800 mb-6">
                  {title}
                </h3>
                <p className="text-3xl font-extrabold text-black mb-6">
                  ₹ {formatIndianCurrency(amount)}
                </p>
                <Link
                  href={appendUTMToUrl(
                    `/donate?purpose=${encodeURIComponent(
                      title
                    )}&amount=${amount}`
                  )}
                >
                  <button className="bg-gradient-to-r from-orange-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl  transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-fit cursor-pointer">
                    Donate Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white text-center py-8 px-4 text-black ">
        <button className="bg-gray-200 text-black font-semibold px-4 py-2 rounded-full mb-6 text-[36px]">
          ✧ Sponsor a Child
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold italic mb-2">
          Gift a <span className="text-blue-900">Future</span>
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-10">
          &quot;Gift a child a future filled with wisdom and opportunity.&quot;
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <>
            {/* First 2 cards - always visible */}
            {sponsorshipOptions.slice(0, 2).map((opt) => (
              <div
                key={opt.key}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-blue-900"
              >
                {/* Decorative top accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900"></div>

                <div className="p-8">
                  <h3 className="font-bold text-xl text-gray-800 mb-1">
                    {"children" in opt
                      ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""}`
                      : opt.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {opt.yearText || "Food and Education for 1 Year"}
                  </p>
                  <p className="text-3xl font-extrabold text-black mb-6">
                    ₹ {formatIndianCurrency(opt.amount)}
                  </p>
                  <Link
                    href={appendUTMToUrl(
                      `/donate?purpose=${encodeURIComponent(
                        "children" in opt
                          ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""} - Food and Education`
                          : opt.title
                      )}&amount=${opt.amount}`
                    )}
                  >
                    <button className="bg-gradient-to-r from-blue-900 to-blue-900 text-white font-semibold px-6 py-3 rounded-xl hover:[#002A42]/20 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-fit cursor-pointer">
                      Donate Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}

            {/* Remaining cards - visible only on md+ */}
            <div className="hidden md:contents">
              {sponsorshipOptions.slice(2).map((opt) => (
                <div
                  key={opt.key}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-blue-900"
                >
                  {/* Decorative top accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900"></div>

                  <div className="p-8">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">
                      {"children" in opt
                        ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""}`
                        : opt.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {opt.yearText || "Food and Education for 1 Year"}
                    </p>
                    <p className="text-3xl font-extrabold text-black mb-6">
                      ₹ {formatIndianCurrency(opt.amount)}
                    </p>
                    <Link
                      href={appendUTMToUrl(
                        `/donate?purpose=${encodeURIComponent(
                          "children" in opt
                            ? `Sponsor ${opt.children} Child${opt.children > 1 ? "ren" : ""} - Food and Education`
                            : opt.title
                        )}&amount=${opt.amount}`
                      )}
                    >
                      <button className="bg-gradient-to-r from-blue-900 to-blue-900 text-white font-semibold px-6 py-3 rounded-xl  transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-fit cursor-pointer">
                        Donate Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>

          <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-blue-900">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900 "></div>

            <div className="p-8">
              <h3 className="font-bold text-xl text-gray-800 mb-1">
                Donate Any amount
              </h3>
              <p className="text-2xl font-bold text-black mb-6">---------</p>
              <Link
                href={appendUTMToUrl(
                  `/donate?purpose=${encodeURIComponent(
                    "Sponsor a Child - Any Amount"
                  )}`
                )}
              >
                <button className="bg-gradient-to-r from-blue-900 to-blue-900 text-white font-semibold px-6 py-3 rounded-xl  transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-fit cursor-pointer">
                  Donate Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------Vidhya Dan--------------------------- */}

      {/* -----------------donation details------------------------ */}
      {/* <div className="bg-white text-black py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Left Section - Text & UPI Icons */}
      {/* <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">
              Donation Through Bank (NEFT/ RTGS)
            </h2>

            <p className="mb-2">
              <span className="font-bold">Beneficiary Name:</span> HARE KRISHNA
              MOVEMENT INDIA
            </p>
            <p className="mb-2">
              <span className="font-bold">Bank Name:</span> KOTAK MAHINDRA BANK.
            </p>
            <p className="mb-2">
              <span className="font-bold">A/c No:</span> 0449364305
            </p>
            <p className="mb-6">
              <span className="font-bold">IFSC code:</span> KKBK0007478
            </p>

            <h3 className="text-lg font-semibold mb-2">Pay by UPI ID</h3>

            <div className="mb-4 flex justify-start">
              <Image
                src={phn}
                alt="UPI Options"
                width={260}
                height={260}
                className="inline-block object-contain"
              />
            </div>

            <p className="text-md ">
              <span className="font-bold">Mob No:</span>{" "}
              <span className="font-extrabold"> 8919035202</span>
            </p>
          </div> */}

      {/* Right Section - QR Code */}
      {/* <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
            <div className="flex justify-center w-full">
              <Image
                src={upi_qr}
                alt="QR Code"
                width={320}
                height={280}
                className="rounded-md object-contain"
              />
            </div>
          </div> */}
      {/* </div>
      </div> */}

      {/* -------------------Gallery Section--------------------- */}
      <div className="bg-[#EDF2F7]">
        <section className="mt-5 px-4 md:px-10 lg:px-20">
          <div className=" flex items-center justify-center  mt-2">
            <div className="flex flex-col items-center gap-4 w-[523px] text-center text-[--text-dark-charcoal] font-['Urbanist']">
              <h1 className=" text-2xl mt-2 lg:text-[40px] font-extrabold leading-[120%]">
                A glimpse into the lives you&#39;ve <br />
                touched with your{" "}
                <span className="text-[#FF9C5A] italic">kindness</span>
              </h1>
            </div>
          </div>
        </section>
        <section className="px-4 py-6  flex justify-center">
          <div className="max-w-6xl w-full text-center">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((item, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-md "
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    className="  transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* 🔁 Inverted overlay logic: starts dark, fades on hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/10 bg-opacity-60 group-hover:bg-opacity-0 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}


