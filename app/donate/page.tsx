"use client";
import { useState, Suspense, useEffect } from "react";
import { useLanguage } from "../components/LanguageProvider";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
// import Image from 'next/image';
// import upi_qr from "../../public/images/upi_qr 1.png";
// import PhoneInput from '../components/PhoneInput';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: number;
  isPhoneValid: boolean;
  citizenType: string;
  customAmount?: string;
  wantsMahaPrasadam: boolean;
  wants80G: boolean;
  areaOfStay: string;
  address: string;
  houseApartment: string;
  village: string;
  district: string;
  state: string;
  pinCode: string;
  landmark: string;
  panNumber: string;
  locality: string;
  country: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  citizenType?: string;
  customAmount?: string;
  areaOfStay?: string;
  address?: string;
  houseApartment?: string;
  village?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  landmark?: string;
  panNumber?: string;
  locality?: string;
  country?: string;
}

import {
  DONATION_CONFIG,
  getApiUrl,
  validateDonationAmount,
  getSevaType as getSevaTypeConfig
} from '../config/donation';
import { formatPhoneNumber, validatePhoneNumber } from '../utils/phoneUtils';
import DonationSuccess from '../components/DonationSuccess';
import useUTM from '../utils/useUTM';

// Define Razorpay interfaces
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayWindow {
  Razorpay: new (options: RazorpayOptions) => {
    open(): void;
  };
}

function DonatePageLoading() {
  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonatePageContent() {
  const { t, language } = useLanguage();

  const resolvePurposeDisplay = (purpose: string | null, lang: string) => {
    if (!purpose) return purpose;
    if (lang !== "te") return purpose;
    const plower = purpose.trim().toLowerCase();
    
    if (plower === "annadan seva - any amount") return "అన్నదాన సేవ - ఏదైనా మొత్తం";
    if (plower === "food & health - any amount") return "ఆహారం & ఆరోగ్యం - ఏదైనా మొత్తం";
    if (plower === "education - any amount") return "విద్య - ఏదైనా మొత్తం";
    if (plower === "sponsor education of 1 entire village for 1 month") return "1 నెల పాటు మొత్తం గ్రామం విద్యను స్పాన్సర్ చేయండి";
    if (plower === "sponsor education of 1 entire village for 1 whole year") return "1 పూర్తి సంవత్సరం పాటు మొత్తం గ్రామం విద్యను స్పాన్సర్ చేయండి";
    
    const feedMatch = plower.match(/^feed (\d+) children$/);
    if (feedMatch) return feedMatch[1] + " మంది పిల్లలకు ఆహారం అందించండి";
    
    const sponsorFoodEdMatch = plower.match(/^sponsor (\d+) child(ren)? - food and education$/);
    if (sponsorFoodEdMatch) return sponsorFoodEdMatch[1] + " మంది పిల్లలకు స్పాన్సర్ చేయండి - ఆహారం మరియు విద్య";
    
    const sponsorEdMatch = plower.match(/^sponsor (\d+) children education$/);
    if (sponsorEdMatch) return sponsorEdMatch[1] + " మంది పిల్లల విద్యకు స్పాన్సర్ చేయండి";
    
    console.warn("Unmapped purpose value for display translation:", purpose);
    return purpose;
  };

  const searchParams = useSearchParams();
  const purpose = searchParams.get("purpose");
  const amount = searchParams.get("amount");
  const { utm } = useUTM(); // Get UTM parameters

  const isAnyAmountDonation =
    !amount && purpose && purpose.includes("Any Amount");

  const [localityOptions, setLocalityOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: 0,
    isPhoneValid: false,
    citizenType: "",
    customAmount: "0",
    wantsMahaPrasadam: false,
    wants80G: false,
    areaOfStay: "",
    address: "",
    houseApartment: "",
    village: "",
    district: "",
    state: "",
    pinCode: "",
    landmark: "",
    panNumber: "",
    locality: "",
    country: "",
  });

  // Calculate current donation amount
  const getCurrentDonationAmount = (): number => {
    if (isAnyAmountDonation) {
      const customAmountValue = parseFloat(
        formData.customAmount?.replace(/[^\d.]/g, "") || "0"
      );
      return isNaN(customAmountValue) ? 0 : customAmountValue;
    } else {
      const amountValue = parseFloat(amount || "0");
      return isNaN(amountValue) ? 0 : amountValue;
    }
  };

  // Check if 80G should be disabled (amount < 500)
  const is80GDisabled = getCurrentDonationAmount() < 500;

  // Check if Maha Prasadam should be disabled (amount < 300)
  const isMahaPrasadamDisabled = getCurrentDonationAmount() < 300;

  // Effect to uncheck 80G or Maha Prasadam if amount becomes less than their respective thresholds
  useEffect(() => {
    const currentAmount = isAnyAmountDonation
      ? parseFloat(formData.customAmount?.replace(/[^\d.]/g, "") || "0")
      : parseFloat(amount || "0");
      
    if (!isNaN(currentAmount)) {
      if (currentAmount < 500 && formData.wants80G) {
        setFormData((prev) => ({
          ...prev,
          wants80G: false,
          panNumber: "", // Clear PAN number when 80G is unchecked
        }));
      }
      
      if (currentAmount < 300 && formData.wantsMahaPrasadam) {
        setFormData((prev) => ({
          ...prev,
          wantsMahaPrasadam: false,
        }));
      }
    }
  }, [formData.customAmount, amount, formData.wants80G, formData.wantsMahaPrasadam, isAnyAmountDonation]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [donationDetails, setDonationDetails] = useState<{
    sevaName: string;
    amount: number;
    donorName: string;
    paymentId?: string;
    donorEmail?: string;
  } | undefined>(undefined);
  const [emailStatus, setEmailStatus] = useState<{
    sent: boolean;
    message: string;
  } | undefined>(undefined);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [pendingDonationData, setPendingDonationData] = useState<{
    donationData: {
      sevaAmount: number;
      donorName: string;
      donorEmail: string;
      donorPhone: string;
      description: string;
      sevaType: string;
      donorType: string;
    };
    result: {
      order: {
        id: string;
        amount: number;
        currency: string;
      };
      donation: {
        id: string;
        sevaName: string;
        donorName: string;
        donorEmail: string;
      };
    };
  } | null>(null);

  // ====================================================================
  // 🔑 KEY FUNCTION: Shows Razorpay-like UI after PayU payment success
  // ====================================================================
  // This function is responsible for displaying the success UI that matches Razorpay
  // Function to verify PayU payment (called after redirect from PayU)
  // This matches the Razorpay verification flow exactly
  const verifyPayUPayment = async (donationId: string, txnid?: string) => {
    try {
      console.log('Verifying PayU payment...', { donationId, txnid });

      const response = await fetch(getApiUrl('/verify-payu-payment'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donationId,
          txnid: txnid
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('PayU payment verified successfully:', result);
        console.log('Email status:', { sent: result.emailSent, message: result.emailMessage });

        // ✅ PART 1: Set donation details (same structure as Razorpay)
        // This populates the data shown in the success modal
        setDonationDetails({
          sevaName: result.donation.sevaName,
          amount: result.donation.amount,
          donorName: result.donation.donorName,
          paymentId: result.donation.paymentId,
          donorEmail: result.donation.donorEmail
        });

        // ✅ PART 2: Set email status if provided by backend (same as Razorpay)
        // This shows email receipt status in the success modal
        if (result.emailSent !== undefined && result.emailMessage) {
          setEmailStatus({
            sent: result.emailSent,
            message: result.emailMessage
          });
        }

        // ✅ PART 3: SHOW SUCCESS UI - This triggers the DonationSuccess component to appear!
        // Same as Razorpay: setShowSuccess(true) displays the modal overlay
        setShowSuccess(true);
        setShowError(false);
        setIsSubmitting(false);
      } else {
        throw new Error(result.message || DONATION_CONFIG.ERRORS.VERIFICATION_FAILED);
      }
    } catch (error) {
      console.error('Error verifying PayU payment:', error);
      setErrorMessage(error instanceof Error ? error.message : DONATION_CONFIG.ERRORS.VERIFICATION_FAILED);
      setShowError(true);
      setShowSuccess(false);
      setIsSubmitting(false);
    }
  };

  // ====================================================================
  // 🔑 KEY TRIGGER: Detects PayU payment success and triggers UI display
  // ====================================================================
  // Check for payment success in URL params (PayU callback)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const paymentStatus = searchParams.get('payment');
      const paymentMethod = searchParams.get('paymentMethod');
      const donationId = searchParams.get('donationId');
      const txnid = searchParams.get('txnid');

      // ✅ PART 4: When PayU redirects back with success URL params, detect it here
      // If PayU payment was successful, verify it
      if (paymentStatus === 'success' && paymentMethod === 'payu' && donationId) {
        console.log('PayU payment success detected, verifying...');

        // Show loading state immediately (matching Razorpay UX)
        setIsSubmitting(true);
        setShowError(false);

        // Clean up URL params immediately to hide them
        window.history.replaceState({}, '', window.location.pathname);

        // ✅ PART 5: This calls verifyPayUPayment() which sets showSuccess=true
        // Then verify payment and show success popup (same as Razorpay)
        await verifyPayUPayment(donationId, txnid || undefined);
      }

      // Also handle payment failed/error cases
      if (paymentStatus === 'failed' || (paymentStatus === 'error' && paymentMethod === 'payu')) {
        const errorReason = searchParams.get('reason') || 'Payment failed';
        setErrorMessage(errorReason === 'verification_failed'
          ? 'Payment verification failed. Please contact support if the amount was deducted.'
          : errorReason === 'processing_error'
            ? 'There was an error processing your payment. Please contact support.'
            : 'Payment could not be processed. Please try again.');
        setShowError(true);
        setShowSuccess(false);
        setIsSubmitting(false);

        // Clean up URL params
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    checkPaymentStatus();

  }, [searchParams]);

  // Check if Razorpay is loaded
  useEffect(() => {
    const checkRazorpayLoaded = () => {
      if (typeof window !== 'undefined' && (window as unknown as RazorpayWindow).Razorpay) {
        setIsRazorpayLoaded(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkRazorpayLoaded()) {
      return;
    }

    // If not loaded, check periodically
    const interval = setInterval(() => {
      if (checkRazorpayLoaded()) {
        clearInterval(interval);
      }
    }, 100);

    // Clear interval after 10 seconds to avoid infinite checking
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);


  // Improved helper to format amounts with correct commas
  const formatAmount = (value: string | number) => {
    // Convert to string and remove any existing formatting
    const cleanValue = String(value).replace(/[^\d.]/g, "");
    const num = parseFloat(cleanValue);

    // Return original value if not a valid number
    if (isNaN(num) || cleanValue === "") return value;

    // Format based on citizen type
    if (formData.citizenType === "indian") {
      // Custom Indian numbering system (lakhs and crores)
      const [integerPart, decimalPart] = cleanValue.split('.');
      const lastThree = integerPart.slice(-3);
      const remaining = integerPart.slice(0, -3);
      const formattedRemaining = remaining ? remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') : '';
      const formattedInteger = formattedRemaining ? `${formattedRemaining},${lastThree}` : lastThree;
      return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    } else {
      // International numbering system (thousands, millions)
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 4) {
      newErrors.fullName = "Full name must be at least 4 characters";
    }
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = "Invalid Email ID";
    }

    if (!formData.phoneNumber || formData.phoneNumber === 0) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber, formData.citizenType as 'indian' | 'foreign')) {
      newErrors.phoneNumber = formData.citizenType === 'indian'
        ? "Please enter a valid 10-digit Indian phone number"
        : "Please enter a valid phone number";
    }

    if (!formData.citizenType) {
      newErrors.citizenType = "Please select citizen type";
    }
    if (isAnyAmountDonation) {
      if (!formData.customAmount || !formData.customAmount.trim()) {
        newErrors.customAmount = "Please enter the amount you want to donate";
      } else {
        const amountValue = parseFloat(
          formData.customAmount.replace(/[^\d.]/g, "")
        );
        if (isNaN(amountValue) || amountValue <= 0) {
          newErrors.customAmount = "Please enter a valid amount greater than 0";
        } else if (!validateDonationAmount(amountValue)) {
          newErrors.customAmount = DONATION_CONFIG.ERRORS.INVALID_AMOUNT;
        }
      }
    }

    // Validate address fields if Maha Prasadam OR 80G is selected
    if (formData.wantsMahaPrasadam || formData.wants80G) {
      if (!formData.houseApartment.trim()) {
        newErrors.houseApartment = "Address is required";
      } else if (formData.houseApartment.trim().length < 5) {
        newErrors.houseApartment = "Address must be at least 5 characters";
      }
      if (!formData.address.trim()) {
        newErrors.address = "Street / Area / Locality is required";
      } else if (formData.address.trim().length < 5) {
        newErrors.address = "Street / Area / Locality must be at least 5 characters";
      }
      if (!formData.village.trim()) {
        newErrors.village = "City/Village is required";
      } else if (formData.village.trim().length < 2) {
        newErrors.village = "City/Village must be at least 2 characters";
      }
      if (!formData.district.trim()) {
        newErrors.district = "District is required";
      } else if (formData.district.trim().length < 2) {
        newErrors.district = "District must be at least 2 characters";
      }
      if (!formData.state.trim()) {
        newErrors.state = "Please select a State / UT";
      }
      if (!formData.pinCode.trim()) {
        newErrors.pinCode = "PIN Code is required";
      } else if (!/^\d{6}$/.test(formData.pinCode)) {
        newErrors.pinCode = "PIN Code must be exactly 6 digits";
      }
      if (!formData.locality.trim()) {
        newErrors.locality = "Locality/Area is required";
      }
      if (!formData.country.trim()) {
        newErrors.country = "Country is required";
      }
    }

    // Validate 80G eligibility (amount must be >= 500)
    if (formData.wants80G) {
      const currentAmount = getCurrentDonationAmount();
      if (currentAmount < 500) {
        // Show error on customAmount if it's a custom amount donation, otherwise show general error
        if (isAnyAmountDonation) {
          newErrors.customAmount = "80G Tax Exemption is available only for donations of ₹500 or more";
        }
        // Uncheck 80G if amount is less than 500
        setFormData((prev) => ({
          ...prev,
          wants80G: false,
          panNumber: "",
        }));
      } else {
        // Validate PAN if 80G is selected and amount is valid
        if (!formData.panNumber.trim()) {
          newErrors.panNumber = "PAN Number is required for 80G Tax Exemption";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
          newErrors.panNumber = "Please enter a valid PAN number (e.g., ABCDE1234F)";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPincodeDetails = async (pincode: string) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0] && data[0].Status === "Success") {
        const postOffices = data[0].PostOffice;
        if (postOffices && postOffices.length > 0) {
          const firstPO = postOffices[0];
          
          handleInputChange({ target: { name: 'village', value: firstPO.Block || firstPO.District || firstPO.Region } } as any);
          handleInputChange({ target: { name: 'district', value: firstPO.District } } as any);
          handleInputChange({ target: { name: 'state', value: firstPO.State } } as any);
          handleInputChange({ target: { name: 'country', value: firstPO.Country } } as any);

          const areaNames = postOffices.map((po: any) => po.Name);
          setLocalityOptions(areaNames);

          if (areaNames.length > 0) {
            handleInputChange({ target: { name: 'locality', value: areaNames[0] } } as any);
          }
        }
      } else {
        setLocalityOptions([]);
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      setLocalityOptions([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Only allow valid phone numbers
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      const numValue = numericValue ? parseInt(numericValue) : 0;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else if (name === "customAmount") {
      // Allow only numbers and one decimal point
      const numericValue = value.replace(/[^\d.]/g, "");
      const parts = numericValue.split(".");
      // Ensure only one decimal point
      const formattedValue =
        parts.length > 2
          ? parts[0] + "." + parts.slice(1).join("")
          : numericValue;
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === "wantsMahaPrasadam" || name === "wants80G") {
      // Handle checkboxes for Maha Prasadam and 80G
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "pinCode") {
      // Only allow 6 digits for PIN code
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      
      if (numericValue.length === 6) {
        fetchPincodeDetails(numericValue);
      } else if (numericValue.length < 6) {
        setLocalityOptions([]);
      }
    } else if (name === "panNumber") {
      // Format PAN number (uppercase, alphanumeric only)
      const formattedValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Helper function to determine seva type from purpose
  const getSevaType = (purpose: string | null) => {
    if (!purpose) return "VIDHYA DANA";
    if (purpose.toLowerCase().includes("annadan")) return "ANNADAN SEVA";
    if (
      purpose.toLowerCase().includes("vidhya") ||
      purpose.toLowerCase().includes("education")
    )
      return "VIDHYA DANA";
    return "GENERAL DONATION";
  };

  // Function to handle payment gateway selection
  const handlePaymentGatewaySelection = async (gateway: 'razorpay' | 'payu') => {
    if (!pendingDonationData) return;

    // Prevent multiple simultaneous requests
    if (isSubmitting) {
      console.warn('Payment already in progress');
      return;
    }

    setShowPaymentDialog(false);
    setIsSubmitting(true);

    try {
      if (gateway === 'payu') {
        await processPayUPayment(pendingDonationData.donationData);
      } else {
        await processRazorpayPayment(pendingDonationData.result, pendingDonationData.donationData);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Payment failed. Please try again.';

      // Check if it's a rate limiting error
      if (errorMsg.includes('Too many requests') || errorMsg.includes('rate limit')) {
        setErrorMessage('Too many payment requests. Please wait 60 seconds and try again.');
      } else {
        setErrorMessage(errorMsg);
      }

      setShowError(true);
      setIsSubmitting(false);
    }
  };

  // Function to process Razorpay payment
  const processRazorpayPayment = async (result: {
    order: {
      id: string;
      amount: number;
      currency: string;
    };
    donation: {
      id: string;
      sevaName: string;
      donorName: string;
      donorEmail: string;
    };
  }, donationData: {
    sevaAmount: number;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    description: string;
    sevaType: string;
    donorType: string;
  }) => {
    const options = {
      key: DONATION_CONFIG.RAZORPAY.KEY_ID,
      amount: result.order.amount,
      currency: result.order.currency,
      name: DONATION_CONFIG.ORGANIZATION.NAME,
      description: result.donation.sevaName,
      order_id: result.order.id,
      handler: function (paymentResponse: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        console.log('Payment successful:', paymentResponse);
        verifyPayment(paymentResponse, result.donation.id);
      },
      prefill: {
        name: result.donation.donorName,
        email: result.donation.donorEmail,
        contact: donationData.donorPhone
      },
      theme: {
        color: DONATION_CONFIG.ORGANIZATION.THEME_COLOR
      },
      modal: {
        ondismiss: function () {
          setIsSubmitting(false);
        }
      }
    };

    // Check if Razorpay is loaded
    if (!isRazorpayLoaded || !((window as unknown as RazorpayWindow).Razorpay)) {
      setErrorMessage('Payment gateway is loading. Please wait a moment and try again.');
      setShowError(true);
      setIsSubmitting(false);
      return;
    }

    const rzp = new (window as unknown as RazorpayWindow).Razorpay(options);
    rzp.open();
  };

  // Function to process PayU payment
  const processPayUPayment = async (donationData: {
    sevaAmount: number;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    description: string;
    sevaType: string;
    donorType: string;
  }) => {
    try {
      // Validate amount before sending
      if (!donationData.sevaAmount || donationData.sevaAmount < 1) {
        throw new Error('Amount must be at least ₹1');
      }

      // Ensure amount is a valid number (not string with formatting)
      const amount = parseFloat(String(donationData.sevaAmount));
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount. Please enter a valid donation amount.');
      }

      // Get donationId from pendingDonationData (we have it from submit-form)
      const donationId = pendingDonationData?.result?.donation?.id;

      const response = await fetch(getApiUrl('/create-payu-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Send as number, backend will format it
          firstname: donationData.donorName.trim(),
          email: donationData.donorEmail.trim(),
          phone: donationData.donorPhone.trim(),
          productinfo: donationData.description,
          sevaType: donationData.sevaType,
          donorType: donationData.donorType,
          donationId: donationId // Pass donationId so backend can link payment
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Create and submit PayU form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = result.payuUrl;
        form.target = '_blank';

        // Add all PayU form fields
        Object.keys(result.payuData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(result.payuData[key]); // Ensure value is string
          form.appendChild(input);
        });

        // Open PayU in same window instead of new tab
        // This allows proper redirect back to the page
        form.target = '_self';

        document.body.appendChild(form);
        form.submit();

        // Remove form after a short delay
        setTimeout(() => {
          if (form.parentNode) {
            document.body.removeChild(form);
          }
        }, 1000);
      } else {
        throw new Error(result.message || 'Failed to create PayU order');
      }
    } catch (error) {
      console.error('PayU payment error:', error);

      let errorMessage = 'PayU payment failed. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Check for specific errors
        if (error.message.includes('Too many requests') || error.message.includes('rate limit')) {
          errorMessage = 'Too many payment requests. Please wait 60 seconds before trying again.';
        } else if (error.message.includes('Invalid amount')) {
          errorMessage = 'Please enter a valid donation amount (minimum ₹1).';
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }

      setErrorMessage(errorMessage);
      setShowError(true);
      setIsSubmitting(false);
    }
  };

  // Function to verify payment with Razorpay
  const verifyPayment = async (paymentResponse: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }, donationId: string) => {
    try {
      console.log('Verifying payment...');

      const response = await fetch(getApiUrl('/verify-payment-form'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          donationId: donationId
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('Payment verified successfully:', result);
        console.log('Email status:', { sent: result.emailSent, message: result.emailMessage });
        setDonationDetails({
          sevaName: result.donation.sevaName,
          amount: result.donation.amount,
          donorName: result.donation.donorName,
          paymentId: result.donation.paymentId,
          donorEmail: result.donation.donorEmail
        });

        // Set email status if provided by backend
        if (result.emailSent !== undefined && result.emailMessage) {
          setEmailStatus({
            sent: result.emailSent,
            message: result.emailMessage
          });
        }

        setShowSuccess(true);
        setShowError(false);

      } else {
        throw new Error(result.message || DONATION_CONFIG.ERRORS.VERIFICATION_FAILED);
      }

    } catch (error) {
      console.error('Error verifying payment:', error);
      setErrorMessage(DONATION_CONFIG.ERRORS.VERIFICATION_FAILED);
      setShowError(true);
      setShowSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);
    setErrorMessage("");

    if (!validateForm()) {
      setIsSubmitting(false);

      // React equivalent of Vue's $nextTick — double requestAnimationFrame pattern.
      // 1st rAF: waits for React to commit the new error state to the DOM.
      // 2nd rAF: waits for the browser to PAINT the committed DOM (layout is now stable).
      // Only after both frames do we read getBoundingClientRect() — so positions are final.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const errorFieldIds = [
            'customAmount', 'fullName', 'phoneNumber', 'email',
            'citizenType', 'houseApartment', 'village', 'district',
            'state', 'pinCode', 'panNumber', 'locality', 'country'
          ];
          for (const fieldId of errorFieldIds) {
            const el = document.getElementById(fieldId);
            if (el) {
              // Pixel-precise scroll: avoids scrollIntoView's layout recalculations.
              // headerOffset accounts for the sticky navbar so the field isn't hidden behind it.
              const headerOffset = 80;
              const elementPosition = el.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'instant' // 'instant' fires the header scroll-listener once, not 60× per second
              });
              break;
            }
          }
        });
      });

      return;
    }

    try {
      // Prepare donation data
      const finalAmount = isAnyAmountDonation
        ? parseFloat(formData.customAmount?.replace(/[^\d.]/g, "") || "0")
        : parseFloat(amount || "0");

      const donationData = {
        sevaName: purpose || "General Donation",
        sevaType: getSevaType(purpose),
        sevaAmount: finalAmount,
        donorName: formData.fullName,
        donorEmail: formData.email.trim() || "anonymous@harekrishnavidya.org",
        donorPhone: formatPhoneNumber(formData.phoneNumber, formData.citizenType as 'indian' | 'foreign'),
        donorType: formData.citizenType === "indian" ? "Indian Citizen" : "Foreign Citizen",
        description: `Donation for ${purpose || "General Donation"}`,
        campaign: purpose || "General Campaign",
        // UTM Parameters
        utmSource: utm.utm_source || null,
        utmMedium: utm.utm_medium || null,
        utmCampaign: utm.utm_campaign || null,
        utmTerm: utm.utm_term || null,
        utmContent: utm.utm_content || null,
        // Address fields for Maha Prasadam and 80G
        wantsMahaPrasadam: formData.wantsMahaPrasadam,
        wants80G: formData.wants80G,
        areaOfStay: formData.areaOfStay,
        address: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.address : null,
        houseApartment: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.houseApartment : null,
        village: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.village : null,
        district: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.district : null,
        state: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.state : null,
        pinCode: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.pinCode : null,
        landmark: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.landmark : null,
        panNumber: formData.wants80G ? formData.panNumber : null,
        locality: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.locality : null,
        country: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.country : null
      };

      console.log('Submitting donation form:', donationData);

      // Submit form to backend
      const response = await fetch(getApiUrl('/submit-form'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });

      const result = await response.json();

      if (result.success) {
        console.log('Form submitted successfully:', result);

        // Store donation data and show payment gateway selection popup
        setPendingDonationData({ donationData, result });
        setShowPaymentDialog(true);
        setIsSubmitting(false);

      } else {
        throw new Error(result.message || DONATION_CONFIG.ERRORS.FORM_VALIDATION);
      }

    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      setErrorMessage(DONATION_CONFIG.ERRORS.NETWORK_ERROR + ' ' + (error instanceof Error ? error.message : 'Unknown error'));
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sevaType = getSevaTypeConfig(purpose);

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
          setErrorMessage('Failed to load payment gateway. Please refresh the page and try again.');
          setShowError(true);
        }}
      />

      <div className="min-h-screen bg-white flex items-center justify-center pt-4 pb-9 px-4">
        <div
          className={`max-w-4xl w-full rounded-lg px-6 py-10 text-center`}
        >
          {/* Summary Box */}
          <div className="bg-gray-100 rounded-xl shadow-md border border-gray-100 p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* SEVA NAME */}
              <div className="py-2 md:py-0">
                <p className="text-xs font-semibold text-gray-500 tracking-wider mb-1">{"SEVA NAME"}</p>
                <p className="font-bold text-gray-900">{resolvePurposeDisplay(purpose, language) || "General Donation"}</p>
              </div>
              {/* SEVA TYPE */}
              <div className="py-2 md:py-0">
                <p className="text-xs font-semibold text-gray-500 tracking-wider mb-1">{"SEVA TYPE"}</p>
                <p className="font-bold text-gray-900">{resolvePurposeDisplay(sevaType, language)}</p>
              </div>
              {/* SEVA AMOUNT */}
              <div className="py-2 md:py-0">
                <p className="text-xs font-semibold text-gray-500 tracking-wider mb-1">{"SEVA AMOUNT"}</p>
                <p className="font-bold text-[#D32F2F] text-xl">
                  {isAnyAmountDonation
                    ? `₹ ${formatAmount(formData.customAmount ?? '0')}`
                    : `₹ ${amount ? formatAmount(amount) : "0"}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 🔑 KEY UI COMPONENT: This is the actual Razorpay-like success modal */}
          {/* ==================================================================== */}
          {/* ✅ PART 6: When showSuccess=true (set by verifyPayUPayment), this renders */}
          {/* This is the SAME component used by Razorpay - ensuring identical UI/UX */}
          {/* Success Message */}
          {showSuccess && (
            <DonationSuccess
              donationDetails={donationDetails}
              emailSent={emailStatus?.sent}
              emailMessage={emailStatus?.message}
              onClose={() => {
                setShowSuccess(false);
                setDonationDetails(undefined);
                setEmailStatus(undefined);
                // Reset form
                setFormData({
                  fullName: "",
                  email: "",
                  phoneNumber: 0,
                  isPhoneValid: false,
                  citizenType: "",
                  customAmount: "0",
                  wantsMahaPrasadam: false,
                  wants80G: false,
                  areaOfStay: "",
                  address: "",
                  houseApartment: "",
                  village: "",
                  district: "",
                  state: "",
                  pinCode: "",
                  landmark: "",
                  panNumber: "",
                  locality: "",
                  country: "",
                });
              }}
            />
          )}

          {/* Error Message */}
          {showError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <p className="font-semibold">❌ Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">

            {/* Seva Amount — only shown for 'any amount' donations */}
            {isAnyAmountDonation && (
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Seva Amount (₹)<span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="customAmount"
                    type="text"
                    name="customAmount"
                    value={formData.customAmount}
                    onChange={handleInputChange}
                    placeholder="Enter donation amount"
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.customAmount ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                  />
                  {errors.customAmount && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                  )}
                </div>
                {errors.customAmount && (
                  <p className="text-red-600 text-sm mt-1">{errors.customAmount}</p>
                )}
              </div>
            )}

            {/* Normal Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Donor Name */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Donor Name<span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={"Your Name"}
                    required={true}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.fullName ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                  />
                  {errors.fullName && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                  )}
                </div>
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Mobile Number<span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="phoneNumber"
                    value={formData.phoneNumber === 0 ? "" : formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={"Your Phone Number"}
                    min={1000000000}
                    max={9999999999}
                    required={true}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.phoneNumber ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                  />
                  {errors.phoneNumber && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                  )}
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  E-Mail ID
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={false}
                    placeholder={"Your Email"}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.email ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

            </div>

            {/* Payment Option */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Payment Option<span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="citizenType"
                    value="indian"
                    checked={formData.citizenType === "indian"}
                    onChange={handleInputChange}
                    className="accent-blue-700"
                  />Indian Citizen</label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="citizenType"
                    value="foreign"
                    checked={formData.citizenType === "foreign"}
                    onChange={handleInputChange}
                    className="accent-blue-700"
                  />Foreign Citizen</label>
              </div>
              {errors.citizenType && (
                <p className="text-red-600 text-sm mt-1">{errors.citizenType}</p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="text-sm space-y-2">
              {formData.citizenType === "indian" && (
                <label className={`flex items-start gap-2 ${isMahaPrasadamDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <input
                    type="checkbox"
                    name="wantsMahaPrasadam"
                    checked={formData.wantsMahaPrasadam}
                    onChange={handleInputChange}
                    disabled={isMahaPrasadamDisabled}
                    className="accent-blue-700 mt-1 disabled:cursor-not-allowed"
                  />
                  <span>
                    I wish to receive Maha Prasadam
                    {isMahaPrasadamDisabled && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1">
                        Maha Prasadam is available only for donations of ₹500 or above
                      </p>
                    )}
                  </span>
                </label>
              )}
              <label className={`flex items-start gap-2 ${is80GDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <input
                  type="checkbox"
                  name="wants80G"
                  checked={formData.wants80G}
                  onChange={handleInputChange}
                  disabled={is80GDisabled}
                  className="accent-blue-700 mt-1 disabled:cursor-not-allowed"
                />
                <span>
                  I wish to receive 80G Tax Exemption
                  {is80GDisabled && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">
                      80G Tax Exemption is available only for donations of ₹500 or above
                    </p>
                  )}
                  <p className="text-[11px] text-black font-semibold mt-1">
                    (As per Finance Act 80G)
                  </p>
                </span>
              </label>
            </div>

            {/* Address Fields - Show when Maha Prasadam OR 80G is selected */}
            {((formData.wantsMahaPrasadam && formData.citizenType === "indian") || formData.wants80G) && (
              <div className="mt-6 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
                  Address Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">

                  {/* PAN Number Field - Show only when 80G is selected */}
                  {(formData.wantsMahaPrasadam || formData.wants80G) && (
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">
                        PAN Number<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your PAN number (e.g., ABCDE1234F)"
                        maxLength={10}
                        required={formData.wants80G}
                        className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white uppercase ${errors.panNumber ? 'border-2 border-[#D32F2F]' : 'border-gray-300'}`}
                      />
                      {errors.panNumber && (
                        <p className="text-red-600 text-sm mt-1">{errors.panNumber}</p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        Format: 5 letters + 4 numbers + 1 letter (e.g., ABCDE1234F)
                      </p>
                    </div>
                  )}

                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      House / Apartment / Building No.<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="houseApartment"
                        type="text"
                        name="houseApartment"
                        value={formData.houseApartment}
                        onChange={handleInputChange}
                        placeholder="House / Apartment / Building No."
                        required={formData.wantsMahaPrasadam || formData.wants80G}
                        className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.houseApartment ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                      />
                      {errors.houseApartment && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                      )}
                    </div>
                    {errors.houseApartment && (
                      <p className="text-red-600 text-sm mt-1">{errors.houseApartment}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Street / Area / Locality<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street / Area / Locality"
                        required={formData.wantsMahaPrasadam || formData.wants80G}
                        className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.address ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                      />
                      {errors.address && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                      )}
                    </div>
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      PIN Code<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="pinCode"
                        type="text"
                        inputMode="numeric"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        placeholder={"Enter 6-digit PIN code"}
                        maxLength={6}
                        required={formData.wantsMahaPrasadam || formData.wants80G}
                        className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.pinCode ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                      />
                      {errors.pinCode && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                      )}
                    </div>
                    {errors.pinCode && (
                      <p className="text-red-600 text-sm mt-1">{errors.pinCode}</p>
                    )}
                  </div>

                  {localityOptions.length > 0 && (
                    <>
                      {/* Locality/Area */}
                      <div>
                        <label className="block text-sm font-bold text-black mb-1">
                          Locality/Area<span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          {localityOptions.length === 0 ? (
                            <input
                              type="text"
                              value=""
                              disabled
                              readOnly
                              placeholder={"Enter PIN code first"}
                              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white text-gray-400 cursor-not-allowed"
                            />
                          ) : (
                            <select
                              name="locality"
                              value={formData.locality}
                              onChange={handleInputChange}
                              required={formData.wantsMahaPrasadam || formData.wants80G}
                              className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.locality ? 'border-2 border-[#D32F2F] pr-10' : 'border-gray-300'}`}
                            >
                              <option value="">Select Locality/Area</option>
                              {localityOptions.map((area, index) => (
                                <option key={index} value={area}>{area}</option>
                              ))}
                            </select>
                          )}
                          {errors.locality && (
                            <span className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                          )}
                        </div>
                        {errors.locality && (
                          <p className="text-red-600 text-sm mt-1">{errors.locality}</p>
                        )}
                      </div>

                      {/* District */}
                      <div>
                        <label className="block text-sm font-bold text-black mb-1">
                          District<span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder="District name"
                            required={formData.wantsMahaPrasadam || formData.wants80G}
                            className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.district ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                          />
                          {errors.district && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                          )}
                        </div>
                        {errors.district && (
                          <p className="text-red-600 text-sm mt-1">{errors.district}</p>
                        )}
                      </div>

                      {/* State — dropdown with all 28 States + 8 UTs alphabetically */}
                      <div>
                        <label className="block text-sm font-bold text-black mb-1">
                          State<span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required={formData.wantsMahaPrasadam || formData.wants80G}
                          className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.state ? 'border-2 border-[#D32F2F] pr-10' : 'border-gray-300'}`}
                        >
                          <option value="">Select State / UT</option>
                          <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">Himachal Pradesh</option>
                          <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Ladakh">Ladakh</option>
                          <option value="Lakshadweep">Lakshadweep</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Puducherry">Puducherry</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                        {errors.state && (
                          <span className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                        )}
                        </div>
                        {errors.state && (
                          <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-bold text-black mb-1">
                          Country<span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Country"
                            required={formData.wantsMahaPrasadam || formData.wants80G}
                            className={`w-full px-4 py-2 rounded-md border focus:outline-none bg-white ${errors.country ? 'border-2 border-[#D32F2F] pr-8' : 'border-gray-300'}`}
                          />
                          {errors.country && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#D32F2F] bg-white text-[#D32F2F] text-xs font-bold pointer-events-none">!</span>
                          )}
                        </div>
                        {errors.country && (
                          <p className="text-red-600 text-sm mt-1">{errors.country}</p>
                        )}
                      </div>
                    </>
                  )}

                </div>
              </div>
            )}

            {/* Donate Now Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full cursor-pointer ${isSubmitting ? "bg-gray-400" : "bg-[#0B3954] hover:bg-[#0B3954]/90"
                } text-white font-bold py-2 rounded-md transition-colors`}
            >
              {isSubmitting ? "Processing..." : "DONATE NOW"}
            </button>
          </form>
        </div>
      </div>

      {/* Payment Gateway Selection Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              💳 Choose Payment Method
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Select your preferred payment gateway to complete the donation
            </p>

            <div className="space-y-4">
              {/* Razorpay Option */}
              <button
                onClick={() => {
                  if (pendingDonationData?.result?.order) {
                    console.log('Razorpay selected');
                    handlePaymentGatewaySelection('razorpay');
                  }
                }}
                disabled={!pendingDonationData?.result?.order}
                className={`w-full p-4 border-2 rounded-lg transition-all text-left ${!pendingDonationData?.result?.order
                  ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  : "border-blue-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${!pendingDonationData?.result?.order ? "border-gray-400" : "border-blue-500"
                      }`}>
                      {pendingDonationData?.result?.order && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Razorpay</div>
                      <div className="text-sm text-gray-600">Cards, UPI, Net Banking</div>
                    </div>
                  </div>
                  {!pendingDonationData?.result?.order && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold uppercase">
                      Unavailable
                    </span>
                  )}
                </div>
              </button>

              {/* PayU Option - Always visible */}
              <button
                onClick={() => {
                  console.log('PayU selected');
                  handlePaymentGatewaySelection('payu');
                }}
                className="w-full p-4 border-2 border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left cursor-pointer"
                style={{ display: 'block' }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">PayU</div>
                    <div className="text-sm text-gray-600">Cards, UPI, Wallets</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 text-center ">
              <button
                onClick={() => {
                  setShowPaymentDialog(false);
                  setPendingDonationData(null);
                  setIsSubmitting(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const DonatePage = () => {
  return (
    <Suspense fallback={<DonatePageLoading />}>
      <DonatePageContent />
    </Suspense>
  );
};

export default DonatePage;
