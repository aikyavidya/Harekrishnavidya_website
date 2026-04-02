'use client'
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Script from "next/script";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DONATION_CONFIG, getApiUrl } from "@/app/config/donation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";

const getBackendApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// CMS Backend Data Structure
interface ImpactStatistic {
  value: string;
  label: string;
  description: string;
  _id?: string;
}

interface DonationImpact {
  amount: string;
  description: string;
  _id?: string;
}

interface FundUtilizationItem {
  label: string;
  percentage: string;
  amount: string;
  description: string;
  _id?: string;
}

interface GalleryItem {
  url: string;
  caption: string;
  category: string;
}

interface VideoItem {
  title: string;
  url: string;
  thumbnail: string;
}

interface Testimonial {
  name: string;
  designation: string;
  quote: string;
  image: string;
  _id?: string;
}

interface Campaign {
  _id?: string;
  basicInfo: {
    title: string;
    subtitle: string;
    slug: string;
    category: string;
    location: string;
    shortDescription: string;
    coverImage: string;
    bannerImage: string;
    deadline: string;
    isFeatured: boolean;
    isActive: boolean;
  };
  story: {
    fullStory: string;
    mission: string;
    vision: string;
  };
  impact: {
    impactStatistics: ImpactStatistic[];
    donationImpacts: DonationImpact[];
  };
  campaignImpact?: {
    classrooms?: number;
    students?: string | number;
    teachers?: number;
    duration?: string;
  };
  funds: {
    targetAmount: number;
    raisedAmount: number;
    minimumDonation: number;
    suggestedAmounts: number[];
    fundUtilization: FundUtilizationItem[];
    currency: string;
    totalDonors?: number;
  };
  gallery: GalleryItem[];
  albums: string[];
  videos: VideoItem[];
  testimonials?: Testimonial[];
  donorWall: {
    showDonorWall: boolean;
    showDonorNames: boolean;
    showDonationAmounts: boolean;
    minAmountToDisplay: number;
    recentDonors: any[];
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    socialLinks: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    };
  };
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Minimal Razorpay types for TypeScript
interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayHandlerResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  notes?: Record<string, string>;
}

interface RazorpayWindow {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
  };
}

import { useSearchParams } from "next/navigation";

// ... previous imports

function BuildSchoolContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Dynamic donation options from campaign data, with fallback
  const donationOptions = campaign?.impact?.donationImpacts && campaign.impact.donationImpacts.length > 0
    ? campaign.impact.donationImpacts.map(impact => ({
      amount: parseInt(impact.amount),
      description: impact.description
    }))
    : [
      { amount: 500, description: "10 bricks for construction" },
      { amount: 2500, description: "One desk and bench set" },
      { amount: 5000, description: "Classroom materials" },
      { amount: 10000, description: "Library setup" },
    ];


  // Fetch campaign data from CMS API
  useEffect(() => {
    const fetchCampaign = async () => {
      let url;
      if (id) {
        url = getBackendApiUrl(`/api/campaign-management/${id}`);
      } else {
        // Default to the specific campaign slug for this page if no ID is provided
        url = getBackendApiUrl(`/api/campaign-management/slug/build-a-school-in-rural-telangana`);
      }

      try {
        setLoading(true);

        const res = await fetch(
          url,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
              "Pragma": "no-cache"
            }
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Failed to fetch campaign:", res.status, errorData);
          throw new Error(errorData.message || "Failed to fetch campaign");
        }

        const response = await res.json();
        console.log("Campaign data received:", response);

        // Map CMS data structure to component usage
        if (response.success && response.data) {
          setCampaign(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch campaign", err);
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const getInitials = (name?: string) => {
    const cleaned = (name ?? "").trim();
    if (!cleaned) return "?";
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  // Calculate progress percentage
  const progressPercentage = campaign
    ? Math.min((campaign.funds.raisedAmount / campaign.funds.targetAmount) * 100, 100)
    : 65;

  // Calculate days left
  const daysLeft = campaign?.basicInfo?.deadline
    ? Math.max(0, Math.ceil((new Date(campaign.basicInfo.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Format currency
  const formatCurrency = (amount: number | undefined | null) => {
    // Handle undefined, null, or non-numeric values
    if (amount === undefined || amount === null || !Number.isFinite(amount)) {
      return '₹0';
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Handle donation submission
  const handleDonate = async () => {
    if (
      !campaign ||
      typeof selectedAmount !== "number" ||
      !Number.isFinite(selectedAmount) ||
      selectedAmount <= 0
    ) {
      alert("Please select an amount to donate");
      return;
    }

    setSubmitting(true);

    try {
      // 1) Create Razorpay order via generic donation API
      const createOrderRes = await fetch(getApiUrl("/create-order"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedAmount,
          currency: DONATION_CONFIG.PAYMENT.CURRENCY,
          notes: `Build School Campaign - ${campaign.basicInfo.title}`,
        }),
      });

      if (!createOrderRes.ok) {
        const errorData = await createOrderRes.json().catch(() => ({}));
        console.error("Failed to create Razorpay order:", errorData);
        throw new Error(
          errorData.message || "Failed to create payment order. Please try again."
        );
      }

      const { order } = await createOrderRes.json();

      // 2) Ensure Razorpay script is loaded
      if (
        !isRazorpayLoaded ||
        typeof window === "undefined" ||
        !(window as unknown as RazorpayWindow).Razorpay
      ) {
        alert(
          "Payment gateway is still loading. Please wait a moment and try again."
        );
        return;
      }

      // 3) Open Razorpay checkout
      const options: RazorpayOptions = {
        key: DONATION_CONFIG.RAZORPAY.KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: DONATION_CONFIG.ORGANIZATION.NAME,
        description: campaign.basicInfo.title,
        order_id: order.id,
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            // 4) Verify payment on backend and record generic donation
            const verifyRes = await fetch(getApiUrl("/verify-payment"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donorData: {
                  sevaName: "Build a School in Rural Telangana",
                  sevaType: DONATION_CONFIG.SEVA_TYPES.VIDHYA_DANA,
                  donorType: "individual",
                  isAnonymous: true,
                  description: `Donation for build-school campaign`,
                  campaign: "build-school",
                  notes: `Build School Campaign - ${campaign.basicInfo.title}`,
                  // Minimal donor info so backend validation always passes
                  donorName: "Build School Donor",
                  donorEmail: "anonymous@example.com",
                  donorPhone: "0000000000",
                },
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              console.error("Payment verification failed:", verifyData);
              alert(
                verifyData.message ||
                "Payment verification failed. Please contact support if the amount was deducted."
              );
              return;
            }

            // 5) Update campaign totals using Campaign Management endpoint
            if (campaign._id) {
              const updateRes = await fetch(
                getBackendApiUrl(`/api/campaign-management/${campaign._id}/donor`),
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: "Build School Supporter",
                    amount: selectedAmount,
                    isAnonymous: true
                  }),
                }
              );

              const updateData = await updateRes.json().catch(() => ({}));

              if (updateRes.ok && updateData.data) {
                setCampaign(updateData.data);
              } else {
                console.error(
                  "Campaign update after payment failed:",
                  updateData
                );
              }
            }

            alert("Thank you! Your donation was completed successfully.");

            // reset UI
            setSelectedAmount(null);
            setCustomAmount("");
            setShowCustomAmount(false);
          } catch (err) {
            console.error("Error after Razorpay success handler:", err);
            alert(
              "Payment succeeded but we could not update the campaign. Please contact support with your payment details."
            );
          } finally {
            setSubmitting(false);
          }
        },
        theme: {
          color: DONATION_CONFIG.ORGANIZATION.THEME_COLOR,
        },
        notes: {
          campaign: "build-school",
        },
      };

      const rzp = new (window as unknown as RazorpayWindow).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Donation error:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to start payment. Please try again."
      );
    } finally {
      // Do not reset submitting here if Razorpay is open –
      // it will be reset in the handler or on early failure.
      if (!isRazorpayLoaded) {
        setSubmitting(false);
      }
    }
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomAmount(raw);

    // When user clears/backspaces, also clear the selected amount
    if (!raw) {
      setSelectedAmount(null);
      return;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setSelectedAmount(null);
      return;
    }

    // Donations should be whole rupees
    setSelectedAmount(Math.floor(parsed));
  };
  const isValidSelectedAmount =
    typeof selectedAmount === "number" &&
    Number.isFinite(selectedAmount) &&
    selectedAmount > 0;
  const stories = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",

      tag: "Education",
      title: "First Girl From Her Village to Attend Classes",
      author: "Asha · Student, Age 12",
      text: `Asha walks 3 kilometers daily to our center. She's now teaching her siblings and dreams of becoming a teacher.`,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tag: "Nutrition",
      title: "How One Meal Changed Everything",
      author: "Ravi’s Family · Beneficiary",
      text: `Nutritious meals helped Ravi focus in school. His grades improved & his mother says it gave him hope.`,
    },
  ];
  return (
    <>
      {/* Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setIsRazorpayLoaded(true)}
        onError={() => {
          console.error("Failed to load Razorpay script");
          setIsRazorpayLoaded(false);
        }}
      />

      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-[#F96D2F] via-[#FA6F30] to-[#F1872B] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[auto] lg:min-h-[calc(100vh-10rem)]">

            {/* LEFT CONTENT */}
            <div className="order-2 lg:order-1 space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">

              <span className="inline-block bg-black/20 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                Education Campaign
              </span>

              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-display font-bold leading-tight">
                {loading ? "Loading..." : campaign?.basicInfo?.title || "Build a School in Rural Telangana"}
              </h1>

              <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {loading
                  ? "Loading campaign details..."
                  : campaign?.basicInfo?.subtitle || campaign?.basicInfo?.shortDescription ||
                  "Give 200+ children a safe place to learn and grow in a permanent school building"}
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-sm sm:text-base font-medium text-white">
                  {campaign?.basicInfo?.location || "Komarolu, Telangana"}
                </span>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">

                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60 z-10 rounded-2xl sm:rounded-3xl" />

                  <Image
                    src={campaign?.basicInfo?.coverImage || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"}
                    width={800}
                    height={400}
                    alt={campaign?.basicInfo?.title || "Books"}
                    className="object-cover w-full h-auto"
                    priority
                  />

                  {/* Outer Glow */}
                  <div className="absolute -inset-4 bg-white/10 rounded-3xl -z-10 blur-xl" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8 lg:px-8 flex flex-col lg:flex-row gap-8">
          {/* LEFT CARD (STICKY) */}
          <div className="w-full lg:w-2/3 rounded-2xl  
       space-y-10 overflow-y-auto scrollbar-hide">

            {/* ===== EXISTING STATS CARD ===== */}
            {/* BORDER WRAPPER */}
            <div className="border-2 border-primary/40 rounded-lg shadow-md">
              {/* INNER CARD */}
              <div className="bg-white rounded-lg p-5 sm:p-6 lg:p-8">

                {/* AMOUNT + GOAL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-[#847062]">
                      AMOUNT RAISED
                    </p>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FA6B2E] mt-2">
                      {loading ? "..." : campaign ? formatCurrency(campaign.funds.raisedAmount) : "₹32.50L"}
                    </div>
                  </div>

                  <div className="sm:text-end">
                    <p className="text-xs sm:text-sm font-semibold text-[#847062]">
                      Goal
                    </p>
                    <div className="text-xl sm:text-2xl font-bold mt-2">
                      {loading ? "..." : campaign ? formatCurrency(campaign.funds.targetAmount) : "₹50.00L"}
                    </div>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-6">
                  <div className="w-full h-4 sm:h-5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* FUNDED + TO GO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <p className="text-sm font-bold text-primary mt-4 sm:mt-6">
                    {loading ? "..." : `${Math.round(progressPercentage)}% Funded`}
                  </p>

                  <p className="text-sm font-semibold text-[#847062] sm:text-end sm:mt-6">
                    {loading
                      ? "..."
                      : campaign
                        ? `${formatCurrency(campaign.funds.targetAmount - campaign.funds.raisedAmount)} to go`
                        : "₹17.50L to go"}
                  </p>
                </div>

                {/* SUPPORTERS + DAYS LEFT */}
                <div className="mt-6 border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* SUPPORTERS */}
                  <div className="bg-orange-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
                      {/* icon */}
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-black">
                        {loading
                          ? "..."
                          : campaign?.funds?.totalDonors
                          ?? campaign?.donorWall?.recentDonors?.length
                          ?? 0}
                      </p>
                      <p className="text-[#847062] text-sm">Supporters</p>
                    </div>
                  </div>

                  {/* DAYS LEFT */}
                  <div className="bg-orange-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      {/* icon */}
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-black">
                        {loading ? "..." : daysLeft}
                      </p>
                      <p className="text-[#847062] text-sm">Days Left</p>
                    </div>
                  </div>
                </div>

                {/* BADGES */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center text-sm text-gray-700 text-center">
                  <span className="flex items-center gap-2">🛡 Verified Campaign</span>
                  <span className="flex items-center gap-2">✔ 80G Tax Benefit</span>
                </div>

              </div>
            </div>
            {/* ===== NEW SECTION: WHY THIS CAMPAIGN MATTERS ===== */}

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx={12} cy={12} r={10} />
                  <circle cx={12} cy={12} r={6} />
                  <circle cx={12} cy={12} r={2} />
                </svg>
              </div>

              <div>
                <h2 className="text-3xl font-black text-[#2D1B0F] ">Why This Campaign Matters</h2>

                <p className="text-[#847060] text-sm
 mt-1">The problem we&apos;re solving</p>
              </div>
            </div>
            {/* PROBLEM BOX */}
            <div className="mt-6 border-2 border-primary/40 bg-red-50 p-6 rounded-lg">
              <div className="flex gap-3 items-start">

                <div className="w-8 h-8  text-red-700 font-bold rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={28}
                    height={28}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-700"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <line x1={12} y1={8} x2={12} y2={12} />
                    <line x1={12} y1={16} x2={12.01} y2={16} />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold text-red-700 text-lg">The Problem</p>
                  <p className="text-[#847060] text-sm mt-2 leading-relaxed">
                    {campaign?.story?.fullStory || "In the heart of rural Telangana, over 200 children are denied the basic right to educational infrastructure. They attend classes under trees, in extreme heat, rain, and harsh weather conditions. Without proper facilities, these children struggle to focus on learning, and their potential remains untapped."}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 border-2 border-primary/40  bg-red-50 p-6 rounded-lg">
              <div className="flex gap-3 items-start">

                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 bg-primary text-white p-2 rounded-full"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-red-700 text-lg">Our Solution
                  </p>
                  <p className="text-[#847060] text-sm mt-2 leading-relaxed">
                    {campaign?.story?.mission || "This campaign aims to build a permanent school building with 6 classrooms, a library, separate facilities for boys and girls, and a playground. The school will serve children for 25+ years, providing a safe, conducive learning environment where they can thrive."}
                  </p>
                </div>
              </div>
            </div>
            {/* ===== CAMPAIGN IMPACT SECTION ===== */}
            <div className="mt-12">
              <h2 className="text-3xl font-black text-[#2D1B0F]">Campaign Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {loading ? (
                  <div className="col-span-full text-sm text-[#847062]">Loading impact statistics...</div>
                ) : campaign?.impact?.impactStatistics && campaign.impact.impactStatistics.length > 0 ? (
                  campaign.impact.impactStatistics.map((stat, index) => (
                    <div key={stat._id || index} className="border-2 border-primary/40 bg-white p-6 rounded-lg shadow-sm flex gap-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx={12} cy={12} r={10} />
                          <circle cx={12} cy={12} r={6} />
                          <circle cx={12} cy={12} r={2} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        <p className="font-black mt-1">{stat.label}</p>
                        <p className="text-[#847062] text-sm mt-1">{stat.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback static data
                  <>
                    <div className="border-2 border-primary/40 bg-white p-6 rounded-lg shadow-sm flex gap-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
                          <path d="M18 5v16" />
                          <path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" />
                          <circle cx="12" cy="9" r="2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-gray-900">6</p>
                        <p className="font-black mt-1">Classrooms</p>
                        <p className="text-[#847062] text-sm mt-1">Fully equipped learning spaces</p>
                      </div>
                    </div>
                    <div className="border-2 border-primary/40 bg-white p-6 rounded-lg shadow-sm flex gap-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M12 7v14" />
                          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-gray-900">200+</p>
                        <p className="font-black mt-1">Students</p>
                        <p className="text-[#847062] text-sm mt-1">Children will benefit</p>
                      </div>
                    </div>
                    <div className="border-2 border-primary/40 bg-white p-6 rounded-lg shadow-sm flex gap-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-gray-900">8</p>
                        <p className="font-black mt-1">Teachers</p>
                        <p className="text-[#847062] text-sm mt-1">Local employment created</p>
                      </div>
                    </div>
                    <div className="border-2 border-primary/40 bg-white p-6 rounded-lg shadow-sm flex gap-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                          <circle cx="12" cy="8" r="6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-gray-900">25+ years</p>
                        <p className="text-sm font-black">Duration</p>
                        <p className="text-[#847062] text-sm mt-1">Long-term impact</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* ===== FUND UTILIZATION BREAKDOWN ===== */}

            {/* Real Stories From the Ground */}
            <div className="mt-16">
              <h2 className="text-4xl text-[#2D1B0F] font-black">Real Stories From the Ground</h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8  ">
                {stories.map((story) => (
                  <Card
                    key={story.id}
                    className="
    group 
    transition-all duration-300 
    
 border-2 border-primary/40 
    
    hover:shadow-[0_10px_40px_-15px_rgba(251,146,60,0.3)]
    overflow-hidden 
    
  "
                  >

                    {/* IMAGE */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 mix-blend-multiply z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <Image
                        src={story.image}
                        alt={story.title}
                        width={400}
                        height={224}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Top Tag Badge */}
                      <Badge
                        className="absolute top-4 left-4 bg-primary text-white backdrop-blur-md text-xs font-bold px-3 py-1.5 shadow-lg z-20"
                      >
                        {story.tag}
                      </Badge>

                      {/* Bottom shadow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    </div>

                    {/* CONTENT */}
                    <CardContent className="p-6 ">
                      <h3 className="text-xl font-bold text-foreground mb-2  transition-colors text-foreground">
                        {story.title}
                      </h3>

                      <p className="text-sm  mb-2 text-[#847060]">
                        {story.author}
                      </p>

                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 text-[#847060]">
                        &quot;{story.text}&quot;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Community Voices - Testimonials */}
            <div className="mt-16">
              <h2 className="text-4xl font-black text-[#2D1B0F]">Community Voices</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8 ">
                {loading ? (
                  <div className="col-span-full text-sm text-[#847062]">
                    Loading testimonials...
                  </div>
                ) : campaign?.testimonials && campaign.testimonials.length > 0 ? (
                  campaign.testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial._id || index}
                      className="bg-[#fcf8f5] p-6 rounded-lg shadow-md border-2 border-primary flex flex-col"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full mr-4 border-2 border-[#f5e0d3] bg-primary text-white flex items-center justify-center font-black text-xl">
                          {getInitials(testimonial.name)}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[#443026]">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-[#847062]">
                            {testimonial.designation}
                          </p>
                        </div>
                      </div>
                      <blockquote className="text-sm italic text-[#847062] leading-relaxed mt-2">
                        &quot;{testimonial.quote}&quot;
                      </blockquote>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-sm text-[#847062]">
                    No testimonials available right now.
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* RIGHT DONATION BOX */}
          <div className="w-full h-vh lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-8 border-2 border-primary/40 
        max-h-auto overflow-y-auto scrollbar-hide lg:sticky lg:top-24">
              {/* Heart Icon */}
              <div className="w-12 h-12 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="text-white block"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-center text-[#2D1B0F]  text-2xl font-black mt-4">Make Your Donation</h2>
              <p className="text-center text-sm text-[#847062] mt-2">Every contribution counts</p>

              {/* Amount Selection */}
              <p className="font-black mt-6">Select Amount</p>
              <div className="mt-4 space-y-3">
                {donationOptions.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedAmount(option.amount);
                      setShowCustomAmount(false);
                    }}
                    className={`border rounded-xl p-4 cursor-pointer
      ${selectedAmount === option.amount
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                      }`}
                  >
                    <p className="font-semibold text-lg">₹{option.amount}</p>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </div>
                ))}

              </div>

              {/* Custom Amount Option */}
              <div
                onClick={() => setShowCustomAmount(!showCustomAmount)}
                className="border-2 mt-6 border-orange-400 bg-orange-50 text-center py-3 rounded-xl font-black text-sm cursor-pointer transition"
              >
                Custom Amount
              </div>

              {/* Custom Amount Input – shows only when clicked */}
              <div
                className={`mt-3 overflow-hidden transition-all duration-300 ${showCustomAmount ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="border-2 border-orange-300 rounded-xl p-1 bg-gray-50 mt-2 text-[#847062]">
                  <input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full p-2 bg-transparent outline-none border-2  border-gray-200 rounded-xl"
                  />
                </div>
              </div>
              {/* Monthly Donation Toggle */}
              {/* <div className="flex items-center mt-2  border-2 border-orange-50 rounded-xl p-6 bg-orange-50 ">
                <label
                  htmlFor="monthly-donation-toggle"
                  className="text-sm font-semibold text-gray-700 mr-2 "
                >
                  Monthly Donation (eNACH)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-2 border rounded-xl"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setSelectedAmount(Number(value));
                      setShowCustomAmount(false);
                    }
                  }}
                />
              </div> */}

              {/* Donate Button */}
              <div className="mt-8">
                <button
                  onClick={handleDonate}
                  disabled={!isValidSelectedAmount || submitting || loading}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                >
                  {submitting
                    ? "Submitting..."
                    : `Donate ${isValidSelectedAmount ? `₹${selectedAmount.toLocaleString("en-IN")}` : ""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function BuildSchoolLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F96D2F] via-[#FA6F30] to-[#F1872B] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-4 animate-pulse bg-orange-500 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
            <path d="M18 5v16" />
            <path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" />
            <path d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11" />
            <path d="M6 5v16" />
            <circle cx="12" cy="9" r="2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        <p className="text-gray-500">Please wait while we load the campaign</p>
      </div>
    </div>
  );
}

export default function BuildSchool() {
  return (
    <Suspense fallback={<BuildSchoolLoading />}>
      <BuildSchoolContent />
    </Suspense>
  );
}
