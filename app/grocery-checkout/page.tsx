"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Script from "next/script";
import { ShoppingBasket } from "lucide-react";
import { DONATION_CONFIG, getApiUrl } from "@/app/config/donation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";

const getBackendApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

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
  modal?: {
    ondismiss: () => void;
  };
}

interface RazorpayWindow {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
  };
}

interface GroceryItem {
  name: string;
  amount: string;
  price: number;
  icon: string;
  description: string;
  quantity: number;
}

function GroceryCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedItems, setSelectedItems] = useState<GroceryItem[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Load selection by ID from backend (no localStorage)
  useEffect(() => {
    const selectionId = searchParams.get("selectionId");

    if (!selectionId) {
      setSelectedItems([]);
      return;
    }

    const fetchSelection = async () => {
      try {
        const res = await fetch(
          getBackendApiUrl(`/api/grocery/selections/${selectionId}`)
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to load selection");
        }

        const data = await res.json();

        if (!data.success || !data.data?.items) {
          throw new Error("Invalid selection response from server");
        }

        setSelectedItems(data.data.items);
      } catch (error) {
        console.error("Failed to fetch grocery selection:", error);
        setSelectedItems([]);
      }
    };

    fetchSelection();
  }, [searchParams]);

  if (selectedItems.length === 0) {
    return (
      <div className=" flex items-center justify-center bg-orange-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <ShoppingBasket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Items Selected</h2>
          <p className="text-gray-500 mb-6">Please select groceries to donate first</p>
          <button
            onClick={() => router.replace("/grocery-donation")}
            className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600"
          >
            Go to Grocery Donation
          </button>
        </div>
      </div>
    );
  }

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const processingFee = Math.round(subtotal * 0.02);
  const total = subtotal + processingFee;
  const totalQuantity = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    if (phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      setSubmitting(false);
      return;
    }

    try {
      // 1) Create main donation + Razorpay order using generic donation API
      const donorName = `${firstName} ${lastName}`.trim();

      const donationPayload = {
        sevaName: "Grocery Donation",
        sevaType: DONATION_CONFIG.SEVA_TYPES.ANNADAN,
        sevaAmount: total,
        donorName,
        donorEmail: email,
        donorPhone: `+91${phone}`,
        donorType: "Indian Citizen",
        description:
          message ||
          `Grocery donation - ${totalQuantity} item(s): ` +
          selectedItems
            .map((item) => `${item.name} x ${item.quantity}`)
            .join(", "),
        campaign: "grocery-donation",
      };

      const submitRes = await fetch(getApiUrl("/submit-form"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationPayload),
      });

      const submitData = await submitRes.json();

      if (!submitRes.ok || !submitData.success) {
        throw new Error(
          submitData.message ||
          "Failed to start payment. Please try again."
        );
      }

      const { order, donation } = submitData;

      // 2) Ensure Razorpay script is loaded
      if (
        !isRazorpayLoaded ||
        typeof window === "undefined" ||
        !(window as unknown as RazorpayWindow).Razorpay
      ) {
        setSubmitError(
          "Payment gateway is still loading. Please wait a moment and try again."
        );
        setSubmitting(false);
        return;
      }

      // 3) Open Razorpay checkout
      const options: RazorpayOptions = {
        key: DONATION_CONFIG.RAZORPAY.KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: DONATION_CONFIG.ORGANIZATION.NAME,
        description: donation.sevaName || "Grocery Donation",
        order_id: order.id,
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            // 4) Verify payment on backend
            const verifyRes = await fetch(
              getApiUrl("/verify-payment-form"),
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  donationId: donation.id,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              console.error("Payment verification failed:", verifyData);
              setSubmitError(
                verifyData.message ||
                "Payment verification failed. Please contact support if the amount was deducted."
              );
              setSubmitting(false);
              return;
            }

            // 5) Record grocery donation details in grocery collection
            try {
              const groceryDonationPayload = {
                firstName,
                lastName,
                email,
                phone: `+91${phone}`,
                message,
                items: selectedItems,
                subtotal,
                processingFee,
                totalAmount: total,
                paymentStatus: "completed",
                paymentId:
                  verifyData.donation?.paymentId ||
                  response.razorpay_payment_id,
                paymentMethod: "razorpay",
              };

              const groceryRes = await fetch(
                getBackendApiUrl("/api/grocery/donate"),
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(groceryDonationPayload),
                }
              );

              const groceryData = await groceryRes
                .json()
                .catch(() => ({}));

              if (!groceryRes.ok || !groceryData.success) {
                console.error(
                  "Failed to record grocery donation:",
                  groceryData
                );
              }
            } catch (groceryError) {
              console.error(
                "Error while recording grocery donation:",
                groceryError
              );
            }

            alert(
              `Thank you! Your donation of ₹${total.toLocaleString(
                "en-IN"
              )} has been received.`
            );
            router.push("/");
          } catch (err) {
            console.error("Error after Razorpay success handler:", err);
            setSubmitError(
              "Payment succeeded but we could not complete the donation. Please contact support with your payment details."
            );
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: donorName,
          email,
          contact: `+91${phone}`,
        },
        theme: {
          color: DONATION_CONFIG.ORGANIZATION.THEME_COLOR,
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const rzp = new (window as unknown as RazorpayWindow).Razorpay(
        options
      );
      rzp.open();
    } catch (err: any) {
      console.error("Failed to submit donation:", err);
      setSubmitError(
        err.message || "Failed to submit donation. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
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
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT: Items + Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Items */}
          <div className="bg-white rounded-xl shadow p-6 border">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
              <ShoppingBasket className="text-orange-600 w-6 h-6" />
              Your Donation Items
            </h2>

            {selectedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4 last:mb-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.amount} - {item.description} <br />
                      ₹{item.price.toLocaleString("en-IN")} per unit
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="font-bold text-orange-600">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow p-6 border">
            <h2 className="text-xl font-bold mb-4">Your Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="firstName" className="mb-1 font-semibold">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    required
                    className="border p-2 rounded w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="mb-1 font-semibold">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    required
                    className="border p-2 rounded w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 font-semibold">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="border p-2 rounded w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="mb-1 font-semibold">
                  Phone
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  required
                  maxLength={10}
                  className={`border p-2 rounded w-full ${phoneError ? "border-red-500" : ""
                    }`}
                  value={phone}
                  onChange={(e) => {
                    // Allow only digits
                    const value = e.target.value.replace(/\D/g, "");

                    if (value.length <= 10) {
                      setPhone(value);
                    }

                    // Live validation
                    if (value.length !== 10) {
                      setPhoneError("Phone number must be exactly 10 digits");
                    } else {
                      setPhoneError(null);
                    }
                  }}
                />

                {phoneError && (
                  <span className="text-sm text-red-600 mt-1">
                    {phoneError}
                  </span>
                )}
              </div>


              <div className="flex flex-col">
                <label htmlFor="message" className="mb-1 font-semibold">Message (optional)</label>
                <textarea
                  id="message"
                  placeholder="Message"
                  className="border p-2 rounded w-full min-h-[100px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-4">
                  <p className="text-sm font-semibold">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition-all ${submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {submitting ? "Submitting..." : `Complete Donation of ₹${total.toLocaleString("en-IN")}`}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl shadow p-6 border">
            <h2 className="text-xl font-bold mb-4">Donation Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee (2%)</span>
                <span>₹{processingFee.toLocaleString("en-IN")}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Donation</span>
                <span className="text-orange-600">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded p-4 mt-4">
              <h4 className="font-bold text-orange-800 mb-2">Your Impact:</h4>
              <ul className="text-orange-900 text-sm space-y-1">
                <li>• {totalQuantity} {totalQuantity > 1 ? "items" : "item"} donated</li>
                <li>• Helps nourish underprivileged children</li>
                <li>• 100% tax deductible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding for mobile */}
      <div className="pb-20 lg:pb-0"></div>
    </div>
  );
}

function GroceryCheckoutLoading() {
  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
        <ShoppingBasket className="w-16 h-16 mx-auto text-gray-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        <p className="text-gray-500">Please wait while we load your checkout</p>
      </div>
    </div>
  );
}

export default function GroceryCheckout() {
  return (
    <Suspense fallback={<GroceryCheckoutLoading />}>
      <GroceryCheckoutContent />
    </Suspense>
  );
}
