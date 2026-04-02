"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DONATION_CONFIG, getApiUrl } from "@/app/config/donation";
import { useParams } from "next/navigation";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";

const getBackendApiUrl = (endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

interface FundUtilizationItem {
    name: string;
    percentage: number;
    amount: number;
    description: string;
}

interface CampaignImpact {
    classrooms: number;
    students: string;
    teachers: number;
    duration: string;
}

interface Campaign {
    id: string; // Updated to match API response
    _id?: string;
    slug?: string;
    title: string;
    description: string;
    image: string;
    goalAmount: number;
    raisedAmount: number;
    supporters: number;
    deadline: string;
    category?: string;
    campaignImpact?: CampaignImpact;
    fundUtilization?: FundUtilizationItem[];
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

const CampaignDetail = () => {
    const params = useParams();
    const id = params?.id as string;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCustomAmount, setShowCustomAmount] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

    const donationOptions = [
        { amount: 500, description: "Small Contribution" },
        { amount: 2500, description: "Medium Contribution" },
        { amount: 5000, description: "Significant Impact" },
        { amount: 10000, description: "Major Support" },
    ];

    // Fetch campaign data from API
    useEffect(() => {
        const fetchCampaign = async () => {
            if (!id) return;

            try {
                setLoading(true);

                const res = await fetch(
                    getBackendApiUrl(`/api/campaigns/${id}`),
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

                const data = await res.json();
                console.log("Campaign data received:", data);
                setCampaign(data);
            } catch (err) {
                console.error("Failed to fetch campaign", err);
                // Set campaign to null to show loading/error state
                setCampaign(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [id]);

    // Calculate progress percentage
    const progressPercentage = campaign
        ? Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
        : 0;

    // Calculate days left
    const daysLeft = campaign?.deadline
        ? Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    // Format currency
    const formatCurrency = (amount: number) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    // Handle donation submission
    const handleDonate = async () => {
        if (!campaign || !selectedAmount) {
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
                    notes: `Campaign Donation - ${campaign.title}`,
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
                description: campaign.title,
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
                                    sevaName: campaign.title,
                                    sevaType: DONATION_CONFIG.SEVA_TYPES.VIDHYA_DANA, // Defaulting to this, can be adjusted
                                    donorType: "individual",
                                    isAnonymous: true,
                                    description: `Donation for campaign: ${campaign.title}`,
                                    campaign: campaign.id,
                                    notes: `Campaign Donation - ${campaign.title}`,
                                    // Minimal donor info so backend validation always passes
                                    donorName: "Campaign Donor",
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

                        // 5) Update campaign totals
                        if (campaign.id) {
                            const updateRes = await fetch(
                                getBackendApiUrl("/api/campaigns/donate"),
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        campaignId: campaign.id,
                                        amount: selectedAmount,
                                    }),
                                }
                            );

                            const updateData = await updateRes.json().catch(() => ({}));

                            if (updateRes.ok && updateData.campaign) {
                                // Map the updated campaign response to match our interface
                                const updated = updateData.campaign;
                                setCampaign(prev => prev ? {
                                    ...prev,
                                    raisedAmount: updated.raisedAmount,
                                    supporters: updated.supporters
                                } : null);
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
                    campaign: id, // store campaign id in razorpay notes
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
            if (!isRazorpayLoaded) {
                setSubmitting(false);
            }
        }
    };

    // Handle custom amount input
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomAmount(value);
        if (value) {
            setSelectedAmount(Number(value));
        }
    };

    const stories = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            tag: "Education",
            title: "First Girl From Her Village to Attend Classes",
            author: "Asha · Student, Age 12",
            text: `Asha walks 3 kilometers daily to our center. She's now teaching her siblings and dreams of becoming a teacher.`,
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            tag: "Nutrition",
            title: "How One Meal Changed Everything",
            author: "Ravi’s Family · Beneficiary",
            text: `Nutritious meals helped Ravi focus in school. His grades improved & his mother says it gave him hope.`,
        },
    ];

    const testimonials = [
        {
            name: 'Lakshmi Devi',
            role: 'Parent, Community Member',
            quote: "My children currently study under a tree. This school will change their lives forever. Thank you for giving them hope.",
            imageSrc: '/images/lakshmi-devi.jpg',
        },
        {
            name: 'Ravi Kumar',
            role: 'Village Sarpanch',
            quote: "This is the biggest development our village has seen in decades. Education is the key to breaking the cycle of poverty.",
            imageSrc: '/images/ravi-kumar.jpg',
        },
    ];

    if (!id) return null;

    return (
        <>
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
                                Campaign
                            </span>

                            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-display font-bold leading-tight">
                                {loading ? "Loading..." : campaign?.title}
                            </h1>

                            <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                {loading
                                    ? "Loading campaign details..."
                                    : campaign?.description}
                            </p>

                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                <span className="text-sm sm:text-base font-medium text-white">
                                    ISKCON Initiative
                                </span>
                            </div>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">

                                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60 z-10 rounded-2xl sm:rounded-3xl" />

                                    {campaign?.image ? (
                                        <Image
                                            src={campaign.image}
                                            width={800}
                                            height={400}
                                            alt={campaign.title || "Campaign Image"}
                                            className="object-cover w-full h-auto"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                            {loading ? "Loading..." : "No Image Available"}
                                        </div>
                                    )}

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
                    <div className="w-full lg:w-2/3 rounded-2xl space-y-10 overflow-y-auto scrollbar-hide">

                        {/* STATS CARD */}
                        <div className="border-2 border-primary/40 rounded-lg shadow-md">
                            <div className="bg-white rounded-lg p-5 sm:p-6 lg:p-8">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-[#847062]">
                                            AMOUNT RAISED
                                        </p>
                                        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FA6B2E] mt-2">
                                            {loading ? "..." : campaign ? formatCurrency(campaign.raisedAmount) : "₹0"}
                                        </div>
                                    </div>

                                    <div className="sm:text-end">
                                        <p className="text-xs sm:text-sm font-semibold text-[#847062]">
                                            Goal
                                        </p>
                                        <div className="text-xl sm:text-2xl font-bold mt-2">
                                            {loading ? "..." : campaign ? formatCurrency(campaign.goalAmount) : "₹0"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="w-full h-4 sm:h-5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 transition-all duration-300"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                    <p className="text-sm font-bold text-primary mt-4 sm:mt-6">
                                        {loading ? "..." : `${Math.round(progressPercentage)}% Funded`}
                                    </p>

                                    <p className="text-sm font-semibold text-[#847062] sm:text-end sm:mt-6">
                                        {loading
                                            ? "..."
                                            : campaign
                                                ? `${formatCurrency(Math.max(0, campaign.goalAmount - campaign.raisedAmount))} to go`
                                                : "₹0 to go"}
                                    </p>
                                </div>

                                <div className="mt-6 border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="bg-orange-50 p-4 rounded-xl flex items-center gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
                                        </div>
                                        <div>
                                            <p className="text-lg sm:text-xl font-black">
                                                {loading ? "..." : campaign?.supporters || 0}
                                            </p>
                                            <p className="text-[#847062] text-sm">Supporters</p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 p-4 rounded-xl flex items-center gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                        </div>
                                        <div>
                                            <p className="text-lg sm:text-xl font-black">
                                                {loading ? "..." : daysLeft}
                                            </p>
                                            <p className="text-[#847062] text-sm">Days Left</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center text-sm text-gray-700 text-center">
                                    <span className="flex items-center gap-2">🛡 Verified Campaign</span>
                                    <span className="flex items-center gap-2">✔ 80G Tax Benefit</span>
                                </div>

                            </div>
                        </div>

                        {/* WHY THIS MATTERS */}
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
                                <h2 className="text-3xl font-black text-[#2D1B0F] ">About This Campaign</h2>
                                <p className="text-[#847060] text-sm mt-1">Make a difference today</p>
                            </div>
                        </div>

                        <div className="mt-6 border-2 border-primary/40 bg-white p-6 rounded-lg">
                            <p className="text-[#847060] text-sm leading-relaxed">
                                {campaign?.description}
                            </p>
                        </div>

                        {/* IMPACT SECTION - Placeholder if data not available */}
                        {campaign?.campaignImpact && (
                            <div className="mt-12">
                                <h2 className="text-3xl font-black text-[#2D1B0F]">Campaign Impact</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    {/* Render impact cards dynamically if data exists */}
                                </div>
                            </div>
                        )}

                        <div className="mt-16">
                            <h2 className="text-4xl text-[#2D1B0F] font-black">Real Stories From the Ground</h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
                                {stories.map((story) => (
                                    <Card key={story.id} className="group transition-all duration-300 border-2 border-primary/40 hover:shadow-lg overflow-hidden">
                                        <div className="relative h-56 overflow-hidden">
                                            <Image src={story.image} alt={story.title} width={400} height={224} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <Badge className="absolute top-4 left-4 bg-primary text-white backdrop-blur-md text-xs font-bold px-3 py-1.5 shadow-lg z-20">{story.tag}</Badge>
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-bold text-foreground mb-2">{story.title}</h3>
                                            <p className="text-sm mb-2 text-[#847060]">{story.author}</p>
                                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 text-[#847060]">&quot;{story.text}&quot;</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT DONATION BOX */}
                    <div className="w-full h-vh lg:w-1/3">
                        <div className="bg-white shadow-md rounded-lg p-8 border-2 border-primary/40 max-h-auto overflow-y-auto scrollbar-hide lg:sticky lg:top-24">
                            <div className="w-12 h-12 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-white block" fill="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>

                            <h2 className="text-center text-[#2D1B0F] text-2xl font-black mt-4">Make Your Donation</h2>
                            <p className="text-center text-sm text-[#847062] mt-2">Every contribution counts</p>

                            <p className="font-black mt-6">Select Amount</p>
                            <div className="mt-4 space-y-3">
                                {donationOptions.map((option, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setSelectedAmount(option.amount);
                                            setShowCustomAmount(false);
                                        }}
                                        className={`border rounded-xl p-4 cursor-pointer ${selectedAmount === option.amount ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
                                    >
                                        <p className="font-semibold text-lg">₹{option.amount}</p>
                                        <p className="text-gray-600 text-sm">{option.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div onClick={() => setShowCustomAmount(!showCustomAmount)} className="border-2 mt-6 border-orange-400 bg-orange-50 text-center py-3 rounded-xl font-black text-sm cursor-pointer transition">
                                Custom Amount
                            </div>

                            <div className={`mt-3 overflow-hidden transition-all duration-300 ${showCustomAmount ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className="border-2 border-orange-300 rounded-xl p-1 bg-gray-50 mt-2 text-[#847062]">
                                    <input type="number" placeholder="Enter amount" value={customAmount} onChange={handleCustomAmountChange} className="w-full p-2 bg-transparent outline-none border-2 border-gray-200 rounded-xl" />
                                </div>
                            </div>

                            {/* <div className="flex items-center mt-2  border-2 border-orange-50 rounded-xl p-6 bg-orange-50 ">
                                <label className="text-sm font-semibold text-gray-700 mr-2 ">
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


                            <div className="mt-8">
                                <button
                                    onClick={handleDonate}
                                    disabled={!selectedAmount || submitting || loading}
                                    className="w-full bg-orange-500 text-white py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                                >
                                    {submitting ? "Submitting..." : `Donate ${selectedAmount ? `₹${selectedAmount.toLocaleString('en-IN')}` : ""}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CampaignDetail;
