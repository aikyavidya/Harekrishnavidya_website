"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Shield, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { DONATION_CONFIG, getApiUrl } from "@/app/config/donation";

interface GeneralSupportData {
    hero: {
        badgeText: string;
        title: string;
        subtitle: string;
        backgroundImage: string;
        heroButtons: string[];
    };
    details: {
        image: string;
        donationAmountText: string;
        title: string;
        description: string;
        packageBadge: string;
        sectionTitle: string;
        sectionDescription: string;
        includedItems: string[];
        qualityNote: string;
    };
    impact: {
        badgeText: string;
        heading: string;
        subheading: string;
        impactPoints: string[];
        successStory: {
            label: string;
            heading: string;
            text: string;
        };
    };
    form: {
        donationDetails: {
            title: string;
            amountLabel: string;
            customAmountLabel: string;
            customAmountInputLabel: string;
            customAmountPlaceholder: string;
        };
        personalInformation: {
            title: string;
            fields: Array<{
                name: string;
                label: string;
                placeholder: string;
                type: string;
                required: boolean;
                maxLength?: number;
            }>;
        };
        amountOptions: string[];
        defaultAmount: string;
        submitButton: {
            text: string;
            defaultAmount: string;
        };
    };
    impactCard: {
        title: string;
        description: string;
        impactText: string;
        impactSubtext: string;
    };
    trustIndicators: {
        title: string;
        items: Array<{
            icon: string;
            title: string;
            description: string;
        }>;
    };
    stats: Array<{
        label: string;
        value: string;
    }>;
}

export default function Page() {
    const router = useRouter();
    const [selectedAmount, setSelectedAmount] = useState<string | null>("500");
    const [isCustom, setIsCustom] = useState(false);
    const [customAmount, setCustomAmount] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState(false);
    const [data, setData] = useState<GeneralSupportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const API_BASE_URL =
                    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";
                const res = await fetch(`${API_BASE_URL}/api/general-support`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch general support data");
                }

                const response = await res.json();

                if (response.success && response.data) {
                    setData(response.data);
                    setSelectedAmount(response.data.form.defaultAmount);
                    // Initialize form data
                    const initialFormData: Record<string, string> = {};
                    response.data.form.personalInformation.fields.forEach((field: { name: string; label: string; placeholder: string; type: string; required: boolean; maxLength?: number }) => {
                        initialFormData[field.name] = "";
                    });
                    setFormData(initialFormData);
                }
            } catch (err) {
                console.error("Error fetching general support data:", err);
            } finally {
                setLoading(false);
            }

        };

        fetchData();

    }, []);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
            setIsRazorpayLoaded(true);
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const amounts = data?.form.amountOptions || ["500", "1000", "2500", "5000"];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Only numbers allowed
        if (/^\d*$/.test(value)) {
            setPhone(value);

            setError(!(value.length === 10 || value.length === 0));
        }
    };

    // Verify payment after Razorpay success
    const verifyPayment = async (
        paymentResponse: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
        },
        donationId: string,
        amount: number
    ) => {
        try {
            const verifyRes = await fetch(getApiUrl('/verify-payment-form'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                    donationId,
                }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
                // Redirect to donate page with success parameters
                router.push(`/donate?payment=success&donationId=${donationId}&amount=${amount}&kit=General Support`);
            } else {
                setSubmitError(verifyData.message || DONATION_CONFIG.ERRORS.VERIFICATION_FAILED);
            }
        } catch (err) {
            console.error('Payment verification error:', err);
            setSubmitError(DONATION_CONFIG.ERRORS.VERIFICATION_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);

        // Validate phone number
        if (phone.length !== 10) {
            setError(true);
            setSubmitError("Please enter a valid 10-digit phone number");
            return;
        }

        setError(false);

        // Validate form fields
        const firstName = formData.firstName || "";
        const lastName = formData.lastName || "";
        const email = formData.email || "";

        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setSubmitError("Please fill in all required fields");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSubmitError("Please enter a valid email address");
            return;
        }

        // Validate amount
        const amount = parseFloat(isCustom && customAmount ? customAmount : selectedAmount || "0");
        if (isNaN(amount) || amount <= 0) {
            setSubmitError("Please enter a valid amount");
            return;
        }

        if (amount < DONATION_CONFIG.PAYMENT.MIN_AMOUNT || amount > DONATION_CONFIG.PAYMENT.MAX_AMOUNT) {
            setSubmitError(`Amount must be between ₹${DONATION_CONFIG.PAYMENT.MIN_AMOUNT} and ₹${DONATION_CONFIG.PAYMENT.MAX_AMOUNT}`);
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit donation form to backend
            const donationData = {
                sevaName: data?.hero.title || "General Support",
                sevaType: DONATION_CONFIG.SEVA_TYPES.GENERAL,
                sevaAmount: amount,
                donorName: `${firstName} ${lastName}`.trim(),
                donorEmail: email,
                donorPhone: `+91${phone}`,
                donorType: "Indian Citizen",
                description: formData.message || `Donation for General Support`,
                campaign: "general-support",
            };

            const response = await fetch(getApiUrl('/submit-form'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || DONATION_CONFIG.ERRORS.FORM_VALIDATION);
            }

            // Initialize Razorpay payment
            if (!isRazorpayLoaded || !(window as unknown as { Razorpay: unknown }).Razorpay) {
                setSubmitError('Payment gateway is loading. Please wait a moment and try again.');
                setIsSubmitting(false);
                return;
            }

            const options = {
                key: DONATION_CONFIG.RAZORPAY.KEY_ID,
                amount: result.order.amount,
                currency: result.order.currency,
                name: DONATION_CONFIG.ORGANIZATION.NAME,
                description: data?.hero.title || "General Support",
                order_id: result.order.id,
                handler: (paymentResponse: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    verifyPayment(paymentResponse, result.donation.id, amount);
                },
                prefill: {
                    name: donationData.donorName,
                    email: donationData.donorEmail,
                    contact: donationData.donorPhone,
                },
                theme: {
                    color: DONATION_CONFIG.ORGANIZATION.THEME_COLOR,
                },
                modal: {
                    ondismiss: () => {
                        setIsSubmitting(false);
                    },
                },
            };

            const rzp = new (window as unknown as { Razorpay: new (options: unknown) => { open: () => void } }).Razorpay(options);
            rzp.open();
        } catch (err: unknown) {
            console.error('Donation submission error:', err);
            setSubmitError(err instanceof Error ? err.message : DONATION_CONFIG.ERRORS.NETWORK_ERROR);
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="bg-[#f8f6f3] min-h-screen pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </main>
        );
    }

    if (!data) {
        return (
            <main className="bg-[#f8f6f3] min-h-screen pb-20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Failed to load data. Please try again later.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#f8f6f3] min-h-screen pb-20 ">
            {/* ---------------- TOP HERO SECTION ---------------- */}
            <section className="mx-auto">
                <div className="relative overflow-hidden shadow-xl bg-primary-200">

                    {/* Background Image */}
                    <Image
                        src={data.hero.backgroundImage}
                        alt={data.hero.title}
                        width={1200}
                        height={420}
                        className="w-full h-[260px] sm:h-[330px] md:h-[420px] object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/50 to-accent/60"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">

                        {/* Top Button */}
                        <button className="flex items-center gap-2 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full text-sm sm:text-base text-primary bg-white font-extrabold backdrop-blur-md border border-white/40">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
                            {data.hero.badgeText}
                        </button>

                        {/* Heading */}
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mt-4 sm:mt-6">
                            {data.hero.title}
                        </h1>

                        {/* Sub Text */}
                        <p className="mt-3 sm:mt-6 text-base sm:text-xl md:text-2xl max-w-xl sm:max-w-2xl">
                            {data.hero.subtitle}
                        </p>

                        {/* Animated Line */}
                        <div
                            className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 animate-fade-in"
                            style={{ animationDelay: "300ms" }}
                        >
                            <div className="h-1 w-10 sm:w-16 bg-gradient-to-r from-transparent via-white to-white rounded-full"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white animate-pulse"></div>
                            <div className="h-1 w-10 sm:w-16 bg-gradient-to-r from-white via-white to-transparent rounded-full"></div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 sm:gap-6 md:gap-10 mt-6 flex-wrap justify-center font-bold">
                            {data.hero.heroButtons.map((button, index) => (
                                <button key={index} className="px-4 py-2 sm:px-6 sm:py-3 bg-white/20 rounded-xl text-xs sm:text-sm border border-white/40">
                                    {button}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* ---------------- DETAILS SECTION ---------------- */}
            <section className="max-w-6xl mx-auto mt-10">
                <div className="grid md:grid-cols-2 gap-6 rounded-2xl shadow-lg bg-white p-6 sm:p-8">

                    {/* LEFT IMAGE CARD */}
                    <div className="relative rounded-xl overflow-hidden min-h-[300px]">
                        <Image
                            src={data.details.image}
                            width={700}
                            height={500}
                            alt="Donation Card"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute text-start justify-start top-0 left-5 pl- bg-white text-primary px-6 sm:px-10 py-3 rounded-xl border border-primary/30 shadow-lg mt-5" >
                            <p className="text-xs sm:text-xs font-semibold tracking-wide text-[#847062]">
                                DONATION AMOUNT
                            </p>

                            <span className="text-lg sm:text-xl font-extrabold block mt-1">
                                {data.details.donationAmountText}
                            </span>
                        </div>


                        <div className="absolute bottom-4 left-4 bg-white px-4 py-5 border  rounded-xl shadow-md flex items-center space-x-2">
                            <span className="text-lg bg-primary p-2 rounded-xl">📚</span>
                            <div className="flex flex-col text-left">
                                <p className="font-black text-xl">{data.details.title}</p>
                                <p className="text-sm text-[#847062]">
                                    {data.details.description}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT DETAILS */}
                    <div className="">
                        <p className="text-primary/100 text-xs font-bold py-3 px-3 w-40 rounded-full bg-primary/20">{data.details.packageBadge}</p>
                        <h2 className="text-2xl sm:text-3xl font-extrabold mt-4">
                            {data.details.sectionTitle}
                        </h2>

                        <p className="text-[#847062] mt-3 text-[15px] leading-loose">
                            {data.details.sectionDescription}
                        </p>

                        {/* FEATURES GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 font-bold">
                            {data.details.includedItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 p-5 rounded-xl border-2 border-gray-100 
                 group hover:border-primary transition-colors duration-300"
                                >
                                    {/* Icon (same size for all) */}
                                    <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-primary to-accent 
                      rounded-xl flex items-center justify-center shadow-md 
                      group-hover:scale-110 transition-transform">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-5 h-5 text-white"
                                        >
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="m9 12 2 2 4-4"></path>
                                        </svg>
                                    </div>

                                    {/* Text */}
                                    <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <hr className="mt-4 text-[#847062]" />
                        <p className="text-[14px] font-bold text-[#847062] mt-4">
                            {data.details.qualityNote}
                        </p>
                    </div>
                </div>
            </section>
            <section className="max-w-6xl mx-auto mt-10 p-5 sm:p-8 bg-primary/5 border-2 border-primary/20 rounded-xl">

                <div className="text-center py-8 sm:py-12">

                    {/* Badge */}
                    <span className="inline-flex items-center bg-white text-orange-600 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 fill-current" />
                        {data.impact.badgeText}
                    </span>

                    {/* Heading */}
                    <h2 className="text-2xl sm:text-4xl font-extrabold mt-4">
                        {data.impact.heading}
                    </h2>

                    {/* Sub heading */}
                    <p className="text-[#847062] mt-2 text-sm sm:text-base">
                        {data.impact.subheading}
                    </p>

                    {/* Impact Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                        {data.impact.impactPoints.map((text, index) => (
                            <div
                                key={index}
                                className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border flex gap-4 items-start hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="bg-orange-500 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center font-bold text-sm sm:text-base">
                                    {index + 1}
                                </div>
                                <p className="text-gray-700 text-sm sm:text-base font-medium">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Real Impact Story Box */}
                    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-orange-100 flex flex-col sm:flex-row gap-6 mt-12 sm:mt-16">

                        {/* Icon */}
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-400 rounded-xl flex items-center justify-center text-white text-2xl">
                                💝
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-start">

                            {/* Label */}
                            <span className="bg-orange-100 text-primary px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold">
                                {data.impact.successStory.label}
                            </span>

                            {/* Heading */}
                            <h3 className="text-lg sm:text-2xl font-black mt-2 text-gray-900">
                                {data.impact.successStory.heading}
                            </h3>

                            {/* Paragraph */}
                            <div className="flex mt-4 gap-3 sm:gap-4">
                                <div className="w-1 bg-orange-400 rounded"></div>
                                <p className="text-[#847062] text-sm sm:text-base italic leading-relaxed">
                                    {data.impact.successStory.text}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* Donation Form Section */}
            <section className="max-w-6xl mx-auto mt-10 bg-primary/5 border-2 border-primary/20 rounded-xl px-4 sm:px-6">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8  py-8 sm:py-12">

                    {/* LEFT FORM */}
                    <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-lg shadow-sm border">

                        {/* Donation Details */}
                        <h3 className="text-lg sm:text-xl font-semibold mb-4">{data.form.donationDetails.title}</h3>
                        <p className="text-sm font-medium text-gray-700 mb-2">{data.form.donationDetails.amountLabel}</p>

                        {/* Amount Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                            {amounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => {
                                        setSelectedAmount(amount);
                                        setIsCustom(false);
                                    }}
                                    className={`border rounded-lg py-3 font-semibold text-sm transition 
                ${selectedAmount === amount && !isCustom
                                            ? "bg-orange-50 border-orange-500 text-orange-600"
                                            : "hover:bg-orange-50 hover:border-orange-500"
                                        }`}
                                >
                                    ₹{amount}
                                </button>
                            ))}
                        </div>

                        {/* Custom Amount */}
                        <label
                            className="flex items-center gap-2 mb-3 cursor-pointer"
                            onClick={() => {
                                setIsCustom(true);
                                setSelectedAmount(null);
                            }}
                        >
                            <input
                                type="radio"
                                name="amount"
                                checked={isCustom}
                                onChange={() => {
                                    setIsCustom(true);
                                    setSelectedAmount(null);
                                }}
                                className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-700">{data.form.donationDetails.customAmountLabel}</span>
                        </label>

                        {isCustom && (
                            <div className="mb-6 animate-fadeIn">
                                <label className="text-sm text-gray-700 font-medium">{data.form.donationDetails.customAmountInputLabel}</label>
                                <input
                                    type="number"
                                    placeholder={data.form.donationDetails.customAmountPlaceholder}
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                                />
                            </div>
                        )}

                        {/* Personal Information */}
                        <h3 className="text-lg sm:text-xl font-semibold mb-3">{data.form.personalInformation.title}</h3>

                        {submitError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{submitError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                {data.form.personalInformation.fields
                                    .filter(field => field.name === "firstName" || field.name === "lastName")
                                    .map((field) => (
                                        <div key={field.name}>
                                            <label className="mb-1 text-sm font-semibold">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <input
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                className="p-2 rounded border border-gray-300 w-full focus:border-primary focus:outline-none"
                                                required={field.required}
                                            />
                                        </div>
                                    ))}
                            </div>

                            {data.form.personalInformation.fields
                                .filter(field => field.name === "email")
                                .map((field) => (
                                    <div key={field.name} className="mb-4">
                                        <label className="mb-1 text-sm font-semibold">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            value={formData[field.name] || ""}
                                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                            className="p-2 rounded border border-gray-300 w-full focus:border-primary focus:outline-none"
                                            required={field.required}
                                        />
                                    </div>
                                ))}

                            {data.form.personalInformation.fields
                                .filter(field => field.name === "phone")
                                .map((field) => (
                                    <div key={field.name} className="mb-4">
                                        <label className="mb-1 text-sm font-semibold">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            className={`p-2 rounded border w-full ${error ? "border-red-500" : "border-gray-300 focus:border-primary"
                                                } focus:outline-none`}
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            maxLength={field.maxLength}
                                            required={field.required}
                                        />
                                        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
                                    </div>
                                ))}

                            {data.form.personalInformation.fields
                                .filter(field => field.name === "message")
                                .map((field) => (
                                    <div key={field.name} className="mb-6">
                                        <label className="mb-1 text-sm font-semibold">
                                            {field.label} {!field.required && <span className="text-gray-500">(Optional)</span>}
                                        </label>
                                        <textarea
                                            placeholder={field.placeholder}
                                            value={formData[field.name] || ""}
                                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                            className="p-2 rounded border border-gray-300 w-full focus:border-primary focus:outline-none min-h-[90px] resize-none"
                                        ></textarea>
                                    </div>
                                ))}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl font-semibold shadow-md transition text-sm sm:text-base ${isSubmitting
                                    ? "bg-orange-400 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                                    } text-white`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        {data.form.submitButton.text}
                                        {isCustom && customAmount
                                            ? customAmount
                                            : selectedAmount
                                                ? selectedAmount
                                                : data.form.submitButton.defaultAmount}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col gap-6">

                        {/* Highlight Card */}
                        <div className="py-8 px-4 sm:px-6 bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] rounded-lg text-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-white fill-white" />
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{data.impactCard.title}</h3>
                            <p className="text-white text-sm sm:text-base">{data.impactCard.description}</p>

                            <div className="border-2 border-white/30 rounded-xl mt-6 text-white py-3 px-5 max-w-xs mx-auto">
                                <h1 className="font-extrabold text-xl sm:text-2xl">{data.impactCard.impactText}</h1>
                                <p className="text-[10px] sm:text-xs mt-1">{data.impactCard.impactSubtext}</p>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="bg-white rounded-3xl border p-6 space-y-4">
                            <h3 className="font-bold text-lg">{data.trustIndicators.title}</h3>

                            {data.trustIndicators.items.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    {item.icon === "CheckCircle" ? (
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    ) : item.icon === "Shield" ? (
                                        <Shield className="w-5 h-5 text-primary" />
                                    ) : (
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    )}
                                    <div>
                                        <p className="font-semibold text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="bg-white rounded-3xl border p-6">
                            <h3 className="font-bold mb-4">Our Impact</h3>

                            <div className="space-y-3">
                                {data.stats.map((stat, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span className="text-gray-500">{stat.label}</span>
                                        <span className="text-lg font-bold text-primary">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </main>
    );
}
