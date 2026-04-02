"use client";

import Image from "next/image";
import { Heart, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DONATION_CONFIG, getApiUrl } from "@/app/config/donation";

interface DonationKit {
  _id: string;
  title: string;
  price: number;
  img: string;
  description: string;
  included: string[];
  highlight: string;
  slug: string;
}

const normalizeImageUrl = (rawUrl: string, baseUrl: string): string => {
  const trimmed = (rawUrl || "").trim();
  if (!trimmed) return trimmed;
  if (/^data:/i.test(trimmed)) return trimmed;

  let baseOrigin = baseUrl;
  let baseHost: string | null = null;
  let baseProtocol: string | null = null;
  try {
    const base = new URL(baseUrl);
    baseOrigin = base.origin;
    baseHost = base.hostname;
    baseProtocol = base.protocol;
  } catch {
    // keep baseUrl as-is if it's not a valid URL
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
        return `${baseOrigin}${u.pathname}${u.search}`;
      }
      if (baseHost && baseProtocol && u.hostname === baseHost && u.protocol !== baseProtocol) {
        return `${baseOrigin}${u.pathname}${u.search}`;
      }
      return trimmed;
    } catch {
      return trimmed;
    }
  }

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  // Prefer /api/uploads so it works behind proxies forwarding only /api/*
  const normalizedPath = path.startsWith("/uploads/") ? `/api${path}` : path;
  return `${baseOrigin}${normalizedPath}`;
};

function DonationKitDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  // Get quantity and total from URL params if available
  const urlQuantity = searchParams?.get('quantity');
  const urlTotal = searchParams?.get('total');

  const [kit, setKit] = useState<DonationKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity] = useState<number>(urlQuantity ? parseInt(urlQuantity) : 1);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Fetch kit data from API
  useEffect(() => {
    const fetchKit = async () => {
      try {
        setLoading(true);
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";
        const res = await fetch(`${API_BASE_URL}/api/donation-kits/slug/${slug}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch donation kit");
        }

        const data = await res.json();

        if (data.success && data.data) {
          setKit({
            ...data.data,
            img: normalizeImageUrl(data.data.img, API_BASE_URL),
          });
          // Set default selected amount based on URL params or kit price
          if (urlTotal) {
            setSelectedAmount(urlTotal);
          } else {
            const defaultTotal = urlQuantity ? data.data.price * parseInt(urlQuantity) : data.data.price;
            setSelectedAmount(defaultTotal.toString());
          }
        } else {
          setError("Donation kit not found");
        }
      } catch (err) {
        console.error("Error fetching donation kit:", err);
        setError("Failed to load donation kit");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchKit();
    }
  }, [slug, urlQuantity, urlTotal]);

  // Generate amount options dynamically based on current quantity (1x, 2x, 5x)
  const generateAmounts = (basePrice: number, currentQuantity: number): string[] => {
    const baseAmount = basePrice * currentQuantity;
    return [
      baseAmount.toString(),
      (baseAmount * 2).toString(),
      (baseAmount * 5).toString(),
    ];
  };

  const amounts = kit ? generateAmounts(kit.price, quantity) : [];

  // Calculate total based on quantity
  const totalAmount = kit ? kit.price * quantity : 0;


  // Update selected amount when quantity changes
  useEffect(() => {
    if (kit && !isCustom) {
      const newTotal = kit.price * quantity;
      setSelectedAmount(newTotal.toString());
    }
  }, [quantity, kit, isCustom]);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only numbers allowed
    if (/^\d*$/.test(value)) {
      setPhone(value);
      setPhoneError(!(value.length === 10 || value.length === 0));
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
        // Redirect to success page or show success message
        router.push(`/donation-success?amount=${amount}&kit=${kit?.title}`);
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
      setPhoneError(true);
      return;
    }

    setPhoneError(false);

    // Validate amount
    const amount = parseFloat(isCustom ? customAmount : selectedAmount || totalAmount.toString());
    if (isNaN(amount) || amount <= 0) {
      setSubmitError("Please enter a valid amount");
      return;
    }

    if (!kit) {
      setSubmitError("Donation kit information is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine seva type based on kit title
      let sevaType = "GENERAL DONATION";
      if (kit.title.toLowerCase().includes("education")) {
        sevaType = DONATION_CONFIG.SEVA_TYPES.VIDHYA_DANA;
      } else if (kit.title.toLowerCase().includes("meal") || kit.title.toLowerCase().includes("nutritious")) {
        sevaType = DONATION_CONFIG.SEVA_TYPES.ANNADAN;
      }

      // Submit donation form to backend
      const donationData = {
        sevaName: kit.title,
        sevaType: sevaType,
        sevaAmount: amount,
        donorName: `${firstName} ${lastName}`.trim(),
        donorEmail: email,
        donorPhone: `+91${phone}`,
        donorType: "Indian Citizen",
        description: message || `Donation for ${kit.title} - ${quantity} kit(s)`,
        campaign: "donation-kit",
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
        description: kit.title,
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading donation kit...</p>
        </div>
      </main>
    );
  }

  if (error || !kit) {
    return (
      <main className="bg-[#f8f6f3] min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Kit Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The requested donation kit could not be found."}</p>
          <Link
            href="/donation-kit"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Donation Kits
          </Link>
        </div>
      </main>
    );
  }

  const finalAmount = isCustom && customAmount
    ? customAmount
    : selectedAmount
      ? selectedAmount
      : totalAmount.toString();

  return (
    <main className="bg-[#f8f6f3] min-h-screen pb-20">
      {/* Hero Section */}
      <section className="mx-auto">
        <div className="relative overflow-hidden shadow-xl py-14 sm:py-20">
          {/* Background Image */}
          <Image
            src={kit.img}
            alt={kit.title}
            fill
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/60 to-accent/40"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4">
            <button className="flex items-center gap-2 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full text-sm sm:text-base text-primary bg-white font-extrabold backdrop-blur-md border border-white/40">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
              MAKE AN IMPACT
            </button>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mt-4 sm:mt-6 text-white">
              {kit.title}
            </h1>

            <p className="mt-3 sm:mt-6 text-base sm:text-xl md:text-2xl max-w-xl sm:max-w-3xl text-white">
              {kit.description}
            </p>

            {/* Animation Line */}
            <div
              className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="h-1 w-10 sm:w-16 bg-gradient-to-r from-transparent via-white to-white rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white animate-pulse"></div>
              <div className="h-1 w-10 sm:w-16 bg-gradient-to-r from-white via-white to-transparent rounded-full"></div>
            </div>

            {/* Price and Quantity Badge */}
            <div className="flex gap-4 sm:gap-6 md:gap-10 mt-6 flex-wrap justify-center font-bold">
              <button className="px-4 py-2 sm:px-6 sm:py-3 bg-white/20 rounded-xl text-xs sm:text-sm border border-white/40">
                ₹{kit.price.toLocaleString('en-IN')} per kit
              </button>
              <button className="px-4 py-2 sm:px-6 sm:py-3 bg-white/20 rounded-xl text-xs sm:text-sm border border-white/40">
                {quantity} {quantity === 1 ? 'kit' : 'kits'} = ₹{totalAmount.toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="max-w-6xl mx-auto mt-6 sm:mt-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-2 rounded-2xl shadow-lg bg-white p-4 sm:p-6 md:p-8">

          {/* LEFT IMAGE CARD */}
          <div className="relative rounded-xl overflow-hidden 
                  min-h-[260px] sm:min-h-[300px]
                  w-full md:w-[85%]">

            <Image
              src={kit.img}
              width={500}
              height={300}
              alt={kit.title}
              className="w-full h-full object-cover"
              priority
            />

            {/* Donation Amount Badge */}
            <div className="absolute top-3 left-3 sm:left-4 bg-white text-primary 
                  px-3 sm:px-5 py-2 rounded-lg border border-primary/30 shadow-md max-w-[90%]">
              <p className="text-[10px] font-semibold tracking-wide text-[#847062]">
                DONATION AMOUNT
              </p>
              <span className="text-base sm:text-lg font-extrabold block mt-1">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Bottom Info Card */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto 
                  bg-white px-3 py-3 border rounded-lg shadow flex items-start gap-3">
              <span className="text-base bg-primary p-2 rounded-lg">📚</span>
              <div>
                <p className="font-black text-sm sm:text-base">
                  {kit.title}
                </p>
                <p className="text-[11px] sm:text-xs text-[#847062] leading-snug">
                  Support our mission to reach 1000 villages by 2030
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="flex flex-col">

            <span className="text-primary text-xs font-bold py-2 px-4 w-fit rounded-full bg-primary/20">
              COMPLETE PACKAGE
            </span>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-4">
              What&apos;s Included
            </h2>

            <p className="text-[#847062] mt-3 text-sm sm:text-[15px] leading-relaxed sm:leading-loose">
              {kit.description}
            </p>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {kit.included.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border-2 border-gray-100 hover:border-primary transition"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12l3 3 5-6" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium leading-tight">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <p className="text-xs sm:text-sm font-bold text-[#847062]">
              {kit.highlight}
            </p>

            {/* QUANTITY SELECTOR */}
            {/* <div className="border-2 border-primary/40 rounded-xl p-4 bg-white mt-6">
              <p className="text-sm font-bold mb-3">Number of kits</p>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleDecrement}
                  className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-xl text-primary hover:bg-primary hover:text-white transition"
                >
                  –
                </button>

                <span className="text-primary text-2xl font-bold">
                  {quantity}
                </span>

                <button
                  onClick={handleIncrement}
                  className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-xl text-primary hover:bg-primary hover:text-white transition"
                >
                  +
                </button>
              </div>

              <p className="mt-3 font-semibold text-gray-800 text-sm sm:text-base">
                Total:{" "}
                <span className="text-primary font-extrabold">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="max-w-6xl mx-auto mt-10 bg-primary/5 border-2 border-primary/20 rounded-xl px-4 sm:px-6">
        <div className="text-center py-8 sm:py-12">
          <span className="inline-flex items-center bg-white text-orange-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 fill-current" />
            MAKE AN IMPACT
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-4">
            How Your Donation Helps
          </h2>

          <p className="text-[#847062] mt-2 text-sm sm:text-base">
            Every contribution creates lasting change in children&apos;s lives
          </p>

          <div className="bg-white p-5 sm:p-6 mt-8 rounded-xl shadow-md border border-orange-100 flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-6xl mx-auto">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-400 rounded-xl flex items-center justify-center text-white text-2xl">
                💝
              </div>
            </div>
            <div className="flex-1 text-start">
              <span className="bg-orange-100 text-primary px-3 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold">
                SUCCESS STORY
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black mt-2 text-gray-900">
                Real Impact Story
              </h3>
              <div className="flex mt-4 gap-3 sm:gap-4">
                <div className="w-1 bg-orange-400 rounded"></div>
                <p className="text-[#847062] text-sm sm:text-base italic leading-relaxed">
                  Through our Aikya Vidya program, we&apos;ve reached 108 villages and empowered 2,500+ students. Your contribution directly impacts children&apos;s education and well-being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="max-w-6xl mx-auto mt-10 bg-primary/5 border-2 border-primary/20 rounded-xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 py-8 sm:py-12">
          {/* Left Form */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Donation Details</h3>
            <p className="text-sm font-medium text-gray-700 mb-2">Select Amount (₹)</p>

            {/* Amount Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setIsCustom(false);
                  }}
                  className={`border rounded-lg py-2 sm:py-3 text-sm sm:text-base font-semibold transition ${selectedAmount === amount && !isCustom
                    ? "bg-orange-50 border-orange-500 text-orange-600"
                    : "hover:bg-orange-50 hover:border-orange-500"
                    }`}
                >
                  ₹{parseInt(amount).toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <label
              className="flex items-center gap-2 mb-2 cursor-pointer rounded-xl"
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
              <span className="text-sm text-gray-700">Custom Amount</span>
            </label>

            {isCustom && (
              <div className="mb-6 animate-fadeIn">
                <label className="text-sm text-gray-700 font-medium">Enter Custom Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
            )}

            {/* Personal Info */}
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="p-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="p-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="p-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Phone number"
                  className={`p-2 rounded-lg border ${phoneError
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary"
                    } focus:outline-none`}
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  required
                />
                {phoneError && (
                  <span className="text-red-500 text-xs mt-1">
                    Please enter a valid 10-digit phone number
                  </span>
                )}
              </div>

              <div className="flex flex-col mb-6">
                <label className="mb-1 text-sm font-semibold">Message (Optional)</label>
                <textarea
                  placeholder="Message (Optional)"
                  className="p-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none min-h-[90px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-4 rounded-xl font-semibold shadow-md transition text-sm sm:text-base ${isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
              >
                {isSubmitting
                  ? "Processing..."
                  : `Proceed to Payment: ₹${parseInt(finalAmount).toLocaleString("en-IN")}`}
              </button>
            </form>
          </div>

          {/* Right Impact Card */}
          <div className="flex flex-col gap-6">
            <div className="py-8 px-4 sm:px-6 bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] rounded-lg text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white">Your Impact</h3>
              <p className="text-white text-xs sm:text-sm mt-1">
                Supports our mission to reach 1000 villages
              </p>

              <div className="border-2 border-white/30 rounded-xl mt-6 text-white py-2 px-4 max-w-xs sm:max-w-sm mx-auto">
                <h1 className="font-extrabold text-xl sm:text-2xl">1 Kit</h1>
                <p className="text-[10px] sm:text-[12px] mt-1">Will be Donated</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-3xl border-2 border-border p-5 sm:p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">Why Donate With Us?</h3>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm">100% Secure</p>
                  <p className="text-xs text-muted-foreground">Your payment is encrypted and secure</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm">Tax Deductible</p>
                  <p className="text-xs text-muted-foreground">Get 80G certificate for tax benefits</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm">Direct Impact</p>
                  <p className="text-xs text-muted-foreground">100% of donation goes to beneficiaries</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-3xl border-2 border-border p-5 sm:p-6 shadow-sm">
              <h3 className="font-bold mb-3">Our Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Students Empowered</span>
                  <span className="text-lg font-bold text-primary">2,500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Villages Reached</span>
                  <span className="text-lg font-bold text-primary">108</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Working Hours</span>
                  <span className="text-lg font-bold text-primary">2,28,000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DonationKitDetailPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading donation kit...</p>
      </div>
    </div>
  );
}

export default function DonationKitDetailPage() {
  return (
    <Suspense fallback={<DonationKitDetailPageLoading />}>
      <DonationKitDetailPageContent />
    </Suspense>
  );
}

