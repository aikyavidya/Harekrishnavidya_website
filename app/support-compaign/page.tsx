'use client'
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Script from "next/script";
import { DONATION_CONFIG } from "@/app/config/donation";
import { Heart, Facebook, Instagram, Youtube } from "lucide-react";
import { useSearchParams } from "next/navigation";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";

// Declare Razorpay types
declare global {
    interface Window {
        Razorpay: new (options: {
            key: string;
            amount: number;
            currency: string;
            name: string;
            description: string;
            order_id: string;
            handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
            prefill?: { name?: string; email?: string; contact?: string };
            theme?: { color?: string };
            modal?: { ondismiss: () => void };
        }) => { open: () => void };
    }
}

interface SupportCampaignData {
    id: string;
    title: string;
    description: string;
    hostName: string;
    category: string;
    backgroundImage: string;
    raisedAmount: number;
    goalAmount: number;
    supporters: number;
    daysLeft: number;
    avgDonation: number;
    mission: {
        title: string;
        description: string;
    };
    fundUtilization: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    donationOptions: Array<{
        amount: number;
        description: string;
    }>;
    stories: Array<{
        id: number;
        image: string;
        tag: string;
        title: string;
        author: string;
        text: string;
    }>;
    testimonials: Array<{
        name: string;
        role: string;
        quote: string;
        imageSrc: string;
    }>;
    thankYou: {
        title: string;
        description: string;
    };
}

function SupportCampaignContent() {
    const [isMonthlyDonation, setIsMonthlyDonation] = useState(false);
    const [showCustomAmount, setShowCustomAmount] = useState(false);
    const [campaignData, setCampaignData] = useState<SupportCampaignData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Donation state
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [donationError, setDonationError] = useState<string | null>(null);
    const [donationSuccess, setDonationSuccess] = useState(false);

    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    // Fetch campaign data from API
    useEffect(() => {
        const fetchCampaignData = async () => {
            // If NO ID is present, we might want to fetch the default static data or a "featured" one.
            // But the user specifically wants navigation. 
            // Logic: If ID exists, fetch specific. If not, fetch generic (or keep existing logic).
            // The existing endpoint `api/support-campaign` returns a single static structure. 
            // We will try ID first.

            if (id) {
                try {
                    setLoading(true);
                    setError(null);

                    const res = await fetch(
                        `${API_BASE_URL}/api/campaigner-campaigns/${id}`,
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
                        throw new Error(errorData.message || "Failed to fetch campaign data");
                    }

                    const data = await res.json();

                    // Map backend data to frontend structure
                    const mappedData: SupportCampaignData = {
                        id: data.id,
                        title: data.fundraiserName, // Using fundraiserName as title based on campaign-page usage
                        description: data.story,
                        hostName: data.fundraiserName,
                        category: data.category,
                        backgroundImage: data.campaignImage || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format",
                        raisedAmount: data.raisedAmount,
                        goalAmount: data.targetAmount,
                        supporters: data.supporters,
                        daysLeft: 30, // Default or calculate if createdAt available
                        avgDonation: Math.round(data.raisedAmount / (data.supporters || 1)) || 1000,
                        mission: {
                            title: "Our Mission",
                            description: data.story // Reuse story
                        },
                        fundUtilization: [
                            {
                                icon: "education",
                                title: "Direct Aid",
                                description: "Funds go directly to the beneficiary's needs."
                            },
                            {
                                icon: "nutrition",
                                title: "Support Costs",
                                description: "Minimal overheads to ensure delivery."
                            }
                        ],
                        donationOptions: [
                            { amount: 500, description: "Support Cause" },
                            { amount: 1000, description: "Make a Difference" },
                            { amount: 2500, description: "Big Impact" },
                            { amount: 5000, description: "Change a Life" },
                        ],
                        stories: [],
                        testimonials: [],
                        thankYou: {
                            title: "Thank You!",
                            description: "Your support means the world to us."
                        }
                    };

                    setCampaignData(mappedData);
                } catch (err) {
                    console.error("Failed to fetch campaign data", err);
                    setError(err instanceof Error ? err.message : "Failed to fetch campaign data");
                } finally {
                    setLoading(false);
                }
            } else {
                // Fallback to original fetching logic for default/static page
                try {
                    setLoading(true);
                    setError(null);

                    const res = await fetch(
                        `${API_BASE_URL}/api/support-campaign`,
                        {
                            cache: "no-store",
                            headers: {
                                "Cache-Control": "no-cache",
                                "Pragma": "no-cache"
                            }
                        }
                    );

                    if (!res.ok) {
                        throw new Error("Failed to fetch default campaign");
                    }

                    const data = await res.json();
                    setCampaignData(data);
                } catch (err) {
                    console.error("Failed to fetch default campaign", err);
                    setError("Failed to load campaign.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCampaignData();
    }, [id]);

    // Use default values if data is not loaded yet
    const donationOptions = campaignData?.donationOptions || [
        { amount: 500, description: "10 bricks for construction" },
        { amount: 2500, description: "One desk and bench set" },
        { amount: 5000, description: "Classroom materials" },
        { amount: 10000, description: "Library setup" },
    ];

    // Stories are available in campaignData but not used in this component

    const testimonials = campaignData?.testimonials || [
        {
            name: 'Priya Sharma',
            role: 'Campaign Volunteer',
            quote: "I am volunteering to support this initiative. Every contribution brings us closer to our goal of reaching 1000 villages. Thank you for being part of this journey.",
            imageSrc: '/images/lakshmi-devi.jpg',
        },
    ];

    // Check if Razorpay is already loaded (e.g. from another page)
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Razorpay) {
            setIsRazorpayLoaded(true);
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading campaign...</p>
                </div>
            </div>
        );
    }

    if (error || !campaignData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Error: {error || "Failed to load campaign data"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Handle donation amount selection
    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount("");
        setShowCustomAmount(false);
        setDonationError(null);
    };

    // Handle custom amount input
    const handleCustomAmountChange = (value: string) => {
        // Allow only digits, prevent negative and non-numeric characters
        const numericValue = value.replace(/\D/g, "");
        setCustomAmount(numericValue);
        setSelectedAmount(null);
        setDonationError(null);
    };

    // Get final donation amount
    const getDonationAmount = (): number => {
        if (customAmount && parseFloat(customAmount) > 0) {
            return parseFloat(customAmount);
        }
        return selectedAmount || 0;
    };

    // Handle donation submission
    const handleDonate = async () => {
        const amount = getDonationAmount();

        // Validation
        if (amount <= 0) {
            setDonationError("Please select or enter a donation amount");
            return;
        }

        if (amount < DONATION_CONFIG.PAYMENT.MIN_AMOUNT || amount > DONATION_CONFIG.PAYMENT.MAX_AMOUNT) {
            setDonationError(`Amount must be between ₹${DONATION_CONFIG.PAYMENT.MIN_AMOUNT} and ₹${DONATION_CONFIG.PAYMENT.MAX_AMOUNT.toLocaleString()}`);
            return;
        }

        if (!isRazorpayLoaded) {
            setDonationError("Payment gateway is loading. Please wait a moment and try again.");
            return;
        }

        setIsProcessing(true);
        setDonationError(null);
        setDonationSuccess(false);

        try {
            // Step 1: Submit donation form to backend
            // Donor info will be collected by Razorpay payment gateway
            const formData = {
                sevaAmount: amount, // Backend expects sevaAmount
                donorName: "", // Will be collected by Razorpay
                donorEmail: "", // Will be collected by Razorpay
                donorPhone: "", // Will be collected by Razorpay
                description: `Support Campaign: ${campaignData.title}`,
                sevaName: campaignData.title,
                sevaType: "VIDHYA DANA",
                donorType: "individual",
                campaign: campaignData.id,
                isMonthly: isMonthlyDonation,
                notes: `Donation for ${campaignData.title}`,
            };

            const apiBaseUrl = DONATION_CONFIG.API_BASE_URL;
            const submitResponse = await fetch(`${apiBaseUrl}/submit-form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!submitResponse.ok) {
                const errorData = await submitResponse.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to submit donation form");
            }

            const submitData = await submitResponse.json();

            if (!submitData.success || !submitData.order) {
                throw new Error(submitData.message || "Failed to create payment order");
            }

            // Step 2: Initialize Razorpay payment
            const razorpayOptions = {
                key: DONATION_CONFIG.RAZORPAY.KEY_ID,
                amount: submitData.order.amount, // Amount in paise
                currency: submitData.order.currency || "INR",
                name: DONATION_CONFIG.ORGANIZATION.NAME,
                description: `Donation for ${campaignData.title}`,
                order_id: submitData.order.id,
                handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
                    try {
                        // Step 3: Verify payment
                        const verifyResponse = await fetch(`${apiBaseUrl}/verify-payment-form`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                donationId: submitData.donation?.id,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            setDonationSuccess(true);
                            // Reset form
                            setSelectedAmount(null);
                            setCustomAmount("");
                            setIsMonthlyDonation(false);

                            // Show success message
                            alert(`Thank you! Your donation of ₹${amount.toLocaleString("en-IN")} has been processed successfully.`);

                            // Optionally refresh campaign data to update stats
                            window.location.reload();
                        } else {
                            throw new Error(verifyData.message || "Payment verification failed");
                        }
                    } catch (verifyError: unknown) {
                        console.error("Payment verification error:", verifyError);
                        setDonationError(verifyError instanceof Error ? verifyError.message : "Payment verification failed. Please contact support if the amount was deducted.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    // Razorpay will collect donor information
                },
                theme: {
                    color: DONATION_CONFIG.ORGANIZATION.THEME_COLOR,
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        setDonationError("Payment was cancelled");
                    },
                },
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(razorpayOptions);
            razorpay.open();

        } catch (err: unknown) {
            console.error("Donation error:", err);
            setDonationError(err instanceof Error ? err.message : "Failed to process donation. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Load Razorpay Script */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('Razorpay script loaded successfully');
                    setIsRazorpayLoaded(true);
                }}
                onError={() => {
                    console.error('Failed to load Razorpay script');
                    setDonationError('Failed to load payment gateway. Please refresh the page and try again.');
                }}
            />
            <section className="relative overflow-hidden min-h-[60vh] sm:min-h-[70vh] lg:min-h-[calc(100vh-20rem)]">

                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${campaignData.backgroundImage}')` }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20
                  grid items-center min-h-[60vh] sm:min-h-[70vh] lg:min-h-[calc(100vh-10rem)]">

                    {/* LEFT CONTENT */}
                    <div className="space-y-5 sm:space-y-6 lg:space-y-8 text-white
                    text-center lg:text-left">

                        {/* Category Badge */}
                        <span className="inline-block bg-black/30 backdrop-blur-sm
                       px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                            {campaignData.category}
                        </span>

                        {/* Title */}
                        <h1 className="font-display font-bold leading-tight
                     text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                            {campaignData.title}
                        </h1>

                        {/* Description */}
                        <p className="text-white/90 leading-relaxed
                    text-base sm:text-lg md:text-xl max-w-3xl mx-auto lg:mx-0">
                            {campaignData.description}
                        </p>

                        {/* Host */}
                        <div className="flex justify-center lg:justify-start items-center gap-2 text-sm sm:text-base">
                            <span className="font-medium">
                                Hosted by: {campaignData.hostName}
                            </span>
                        </div>

                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-6xl mx-auto px-8 lg:px-8 flex flex-col lg:flex-row gap-8">
                    {/* LEFT CARD (STICKY) */}
                    <div className="w-full lg:w-2/3 rounded-2xl  
      p- space-y-10 overflow-y-auto scrollbar-hide">

                        {/* ===== EXISTING STATS CARD ===== */}
                        <div className="border-2 border-primary/40 bg-white rounded-xl 
                p-5 sm:p-6 lg:p-8">

                            {/* RAISED / GOAL */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0">
                                <div>
                                    <p className="text-xs sm:text-sm font-bold text-[#847062]">
                                        RAISED
                                    </p>
                                    <div className="text-3xl sm:text-4xl font-black text-[#32241B] mt-2">
                                        ₹{(campaignData.raisedAmount / 1000).toFixed(0)}K
                                    </div>
                                </div>

                                <div className="sm:text-end">
                                    <p className="text-xs sm:text-sm font-semibold text-[#847062]">
                                        GOAL
                                    </p>
                                    <div className="text-lg sm:text-2xl font-bold mt-2">
                                        ₹{(campaignData.goalAmount / 1000).toFixed(0)}K
                                    </div>
                                </div>
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="mt-5 sm:mt-6">
                                <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                (campaignData.raisedAmount / campaignData.goalAmount) * 100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* FUNDED / TO GO */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 sm:mt-6 gap-2">
                                <p className="text-xs sm:text-sm font-bold text-[#32241B]">
                                    {Math.min(
                                        (campaignData.raisedAmount / campaignData.goalAmount) * 100,
                                        100
                                    ).toFixed(0)}
                                    % Funded
                                </p>

                                <p className="text-xs sm:text-sm sm:text-end font-bold text-[#847062]">
                                    ₹{((campaignData.goalAmount - campaignData.raisedAmount) / 1000).toFixed(0)}K
                                    {" "}to go
                                </p>
                            </div>

                            {/* STATS */}
                            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 
                  divide-y sm:divide-y-0 sm:divide-x divide-[#F5D8B8]">

                                {/* Supporters */}
                                <div className="text-center py-4 sm:py-0">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#32241B]">
                                        {campaignData.supporters}
                                    </h2>
                                    <p className="text-[10px] sm:text-xs mt-1 uppercase tracking-wide">
                                        Supporters
                                    </p>
                                </div>

                                {/* Days Left */}
                                <div className="text-center py-4 sm:py-0">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#32241B]">
                                        {campaignData.daysLeft}
                                    </h2>
                                    <p className="text-[10px] sm:text-xs mt-1 uppercase tracking-wide">
                                        Days Left
                                    </p>
                                </div>

                                {/* Avg Donation */}
                                <div className="text-center py-4 sm:py-0">
                                    <h2 className="text-xl sm:text-3xl font-extrabold text-[#32241B]">
                                        ₹{campaignData.avgDonation.toLocaleString()}
                                    </h2>
                                    <p className="text-[10px] sm:text-xs mt-1 uppercase tracking-wide">
                                        Avg. Donation
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* ===== NEW SECTION: WHY THIS CAMPAIGN MATTERS ===== */}

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-xl flex items-center justify-center">
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
                                <h2 className="text-3xl font-black text-[#2D1B0F]">{campaignData.mission.title}</h2>

                                <p className=" text-sm text-[#847062]
 mt-1">Why this initiative exists</p>
                            </div>
                        </div>
                        {/* PROBLEM BOX */}
                        <div className="mt-6 bg-red-50 p-5 rounded-xl border-2 border-primary/40">
                            <p className="text-sm leading-relaxed">
                                {campaignData.mission.description}
                            </p>
                        </div>

                        {/* ===== FUND UTILIZATION BREAKDOWN ===== */}
                        <div className="mt-12 sm:mt-16 lg:mt-20">
                            {/* Heading */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                                        <path d="M20 3v4" />
                                        <path d="M22 5h-4" />
                                        <path d="M4 17v2" />
                                        <path d="M5 18H3" />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="text-2xl sm:text-3xl lg:text:3xl font-black text-[#2D1B0F]">
                                        How Your Support Helps
                                    </h2>
                                    <p className="text-sm sm:text-sm text-[#847062] mt-1">
                                        Direct impact on children&apos;s lives
                                    </p>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                                {campaignData.fundUtilization.map((item, index) => {
                                    const getIcon = (iconType: string) => {
                                        switch (iconType) {
                                            case "education":
                                                return (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className="w-6 h-6 sm:w-7 sm:h-7 text-white"
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
                                                );
                                            case "development":
                                                return (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M12 7v14" />
                                                        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                                                    </svg>
                                                );
                                            case "nutrition":
                                                return (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                        <circle cx="9" cy="7" r="4" />
                                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                    </svg>
                                                );
                                            default:
                                                return (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                                                        <circle cx="12" cy="8" r="6" />
                                                    </svg>
                                                );
                                        }
                                    };

                                    return (
                                        <div
                                            key={index}
                                            className="flex gap-4 p-5 sm:p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                                {getIcon(item.icon)}
                                            </div>

                                            <div>
                                                <p className="font-bold text-sm sm:text-base text-[#2D1B0F]">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs sm:text-sm text-[#847062] mt-1 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Community Voices */}
                        <div className="mt-16">
                            <div className="gap-6 mt-8 " >
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={index}
                                        // Background and border style to mimic the card
                                        className="bg-blue/24 p-6 rounded-xl shadow-md  border-2 border-blue-200  flex flex-col"
                                    >
                                        <div className="flex items-center mb-4">
                                            {/* Image Container */}
                                            <div className="w-16 h-16 rounded-full overflow-hidden mr-4 relative border-2 border-[#f5e0d3]">
                                                <Image
                                                    src={testimonial.imageSrc}
                                                    alt={testimonial.name}
                                                    layout="fill"
                                                    objectFit="cover"
                                                // Optional: Add a placeholder while loading
                                                // placeholder="blur"
                                                // blurDataURL="..." 
                                                />
                                            </div>
                                            <div>
                                                {/* Name */}
                                                <p className="text-lg font-bold text-[#443026]">{testimonial.name}</p>
                                                {/* Role/Village */}
                                                <p className="text-sm text-[#847062]">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        {/* Quote */}
                                        <blockquote className="text-sm italic text-[#847062] leading-relaxed mt-2">
                                            &quot;{testimonial.quote}&quot;
                                        </blockquote>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/*  THANK YOU SECTION */}
                        <div className="mt-16 sm:mt-20 border-2 border-orange-200 bg-[#fffaf6] p-6 sm:p-10 rounded-xl text-center">

                            {/* Icon */}
                            <div className="w-12 h-12 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                                <Heart className="w-6 h-6 text-white fill-white" />
                            </div>

                            {/* Heading */}
                            <h2 className="text-2xl sm:text-3xl font-black text-[#32241B] mt-4">
                                {campaignData.thankYou.title}
                            </h2>

                            {/* Description */}
                            <p className="text-sm sm:text-base text-[#847062] mt-3 max-w-2xl mx-auto">
                                {campaignData.thankYou.description}
                            </p>

                            {/* Divider */}
                            <div className="w-full border-t border-orange-200 my-6"></div>

                            {/* Share Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-wrap">
                                <span className="font-bold text-[#32241B]">Share:</span>

                                {/* YouTube */}
                                <a
                                    href="http://www.youtube.com/@HarekrishnaVidya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-red-300 rounded-xl bg-red-50 hover:bg-red-100 transition text-red-700 text-sm sm:text-base"
                                >
                                    <Youtube className="w-5 h-5" />
                                    YouTube
                                </a>

                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/people/Hare-Krishna-Vidya/pfbid05sv1xecw33n1XMN9WmiSoUNLmiQGf1xVwnW7znm2CaTcpShPSPjBKQZ2i1E9uqqpl/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition text-blue-700 text-sm sm:text-base"
                                >
                                    <Facebook className="w-5 h-5" />
                                    Facebook
                                </a>

                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com/harekrishnavidya_official/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-pink-300 rounded-xl bg-pink-50 hover:bg-pink-100 transition text-pink-700 text-sm sm:text-base"
                                >
                                    <Instagram className="w-5 h-5" />
                                    Instagram
                                </a>
                            </div>
                        </div>

                    </div>
                    {/* RIGHT DONATION BOX */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white shadow-md rounded-2xl p-8 border-2 border-primary/40  
        overflow-y-auto scrollbar-hide lg:sticky lg:top-24">
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
                            <h2 className="text-center text-[#2D1B0F] text-2xl font-black mt-4">Make Your Donation</h2>
                            <p className="text-center text-sm text-[#847062] mt-2">Every contribution counts</p>

                            {/* Amount Selection */}
                            <p className="font-black mt-6">Select Amount</p>
                            <div className="mt-4 space-y-3">
                                {donationOptions.map((option, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleAmountSelect(option.amount)}
                                        className={`border rounded-xl p-4 cursor-pointer hover:border-orange-500 transition ${selectedAmount === option.amount
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <p className="font-semibold text-lg">₹{option.amount.toLocaleString("en-IN")}</p>
                                        <p className="text-gray-600 text-sm">{option.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Custom Amount Option */}
                            <div
                                onClick={() => {
                                    setShowCustomAmount(!showCustomAmount);
                                    if (!showCustomAmount) {
                                        setSelectedAmount(null);
                                    }
                                }}
                                className="border-2 mt-6 border-orange-400 bg-orange-50 text-center py-3 rounded-xl font-black text-sm cursor-pointer transition hover:bg-orange-100"
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
                                        placeholder="Enter amount"
                                        min={DONATION_CONFIG.PAYMENT.MIN_AMOUNT}
                                        max={DONATION_CONFIG.PAYMENT.MAX_AMOUNT}
                                        value={customAmount}
                                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                                        onWheel={(e) => {
                                            // Prevent changing value using mouse scroll
                                            e.currentTarget.blur();
                                        }}
                                        onKeyDown={(e) => {
                                            // Prevent invalid keys (minus, plus, exponent, arrows changing value)
                                            if (
                                                ["e", "E", "+", "-", ","].includes(e.key) ||
                                                e.key === "ArrowUp" ||
                                                e.key === "ArrowDown"
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="w-full p-2 bg-transparent outline-none border-2 border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Monthly Donation Toggle */}
                            {/* <div className="flex items-center mt-4 border-2 border-orange-50 rounded-xl p-4 bg-orange-50">
                                <label
                                    htmlFor="monthly-donation-toggle"
                                    className="text-sm font-semibold text-gray-700 mr-2 flex-1"
                                >
                                    Monthly Donation (eNACH)
                                </label>
                                <input
                                    id="monthly-donation-toggle"
                                    type="checkbox"
                                    checked={isMonthlyDonation}
                                    onChange={() => setIsMonthlyDonation(!isMonthlyDonation)}
                                    className="w-5 h-5 rounded cursor-pointer"
                                />
                            </div> */}

                            {/* Error Message */}
                            {donationError && (
                                <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                                    <p className="text-sm text-red-600">{donationError}</p>
                                </div>
                            )}

                            {/* Success Message */}
                            {donationSuccess && (
                                <div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                                    <p className="text-sm text-green-600">Thank you for your donation!</p>
                                </div>
                            )}

                            {/* Donate Button */}
                            <div className="mt-8">
                                <button
                                    onClick={handleDonate}
                                    disabled={isProcessing || !isRazorpayLoaded}
                                    className={`w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-4 rounded-xl font-semibold text-lg transition ${isProcessing || !isRazorpayLoaded
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:from-orange-600 hover:to-orange-500 hover:shadow-lg"
                                        }`}
                                >
                                    {isProcessing
                                        ? "Processing..."
                                        : `Donate ₹${getDonationAmount() > 0 ? getDonationAmount().toLocaleString("en-IN") : ""}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function SupportCampaignLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading campaign...</p>
            </div>
        </div>
    );
}

export default function SupportCampaign() {
    return (
        <Suspense fallback={<SupportCampaignLoading />}>
            <SupportCampaignContent />
        </Suspense>
    );
}
