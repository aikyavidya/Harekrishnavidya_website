"use client";
import { useState, Suspense, useEffect } from "react";
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
  address: string;
  houseApartment: string;
  village: string;
  district: string;
  state: string;
  pinCode: string;
  landmark: string;
  panNumber: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  citizenType?: string;
  customAmount?: string;
  address?: string;
  houseApartment?: string;
  village?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  landmark?: string;
  panNumber?: string;
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
  const searchParams = useSearchParams();
  const purpose = searchParams.get("purpose");
  const amount = searchParams.get("amount");
  const { utm } = useUTM(); // Get UTM parameters

  const isAnyAmountDonation =
    !amount && purpose && purpose.includes("Any Amount");

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: 0,
    isPhoneValid: false,
    citizenType: "",
    customAmount: "",
    wantsMahaPrasadam: false,
    wants80G: false,
    address: "",
    houseApartment: "",
    village: "",
    district: "",
    state: "",
    pinCode: "",
    landmark: "",
    panNumber: "",
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

  // Effect to uncheck 80G if amount becomes less than 500
  useEffect(() => {
    const currentAmount = isAnyAmountDonation
      ? parseFloat(formData.customAmount?.replace(/[^\d.]/g, "") || "0")
      : parseFloat(amount || "0");
    if (!isNaN(currentAmount) && currentAmount < 500 && formData.wants80G) {
      setFormData((prev) => ({
        ...prev,
        wants80G: false,
        panNumber: "", // Clear PAN number when 80G is unchecked
      }));
    }
  }, [formData.customAmount, amount, formData.wants80G, isAnyAmountDonation]);

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
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
        newErrors.houseApartment = "House/Apartment number is required";
      }
      if (!formData.village.trim()) {
        newErrors.village = "Village/City is required";
      }
      if (!formData.district.trim()) {
        newErrors.district = "District is required";
      }
      if (!formData.state.trim()) {
        newErrors.state = "State is required";
      }
      if (!formData.pinCode.trim()) {
        newErrors.pinCode = "PIN code is required";
      } else if (!/^\d{6}$/.test(formData.pinCode)) {
        newErrors.pinCode = "PIN code must be 6 digits";
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
          newErrors.panNumber = "PAN number is required for 80G tax exemption";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
          newErrors.panNumber = "Please enter a valid PAN number (e.g., ABCDE1234F)";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        ondismiss: function() {
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
        donorEmail: formData.email,
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
        address: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.address : null,
        houseApartment: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.houseApartment : null,
        village: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.village : null,
        district: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.district : null,
        state: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.state : null,
        pinCode: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.pinCode : null,
        landmark: (formData.wantsMahaPrasadam || formData.wants80G) ? formData.landmark : null,
        panNumber: formData.wants80G ? formData.panNumber : null
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
          className={`bg-[#FF6800] max-w-xl w-full rounded-lg px-6 py-10 shadow-xl text-center`}
        >
          {/* Seva Tags */}
          <div className="flex flex-col items-center justify-center mb-1">
            {/* SEVA NAME */}
            <div className="mb-4 text-center">
              <div className="bg-blue-900 text-white text-sm font-semibold px-4 py-2 rounded-lg inline-block">
                SEVA NAME 
              </div> 
              <h2 className="text-lg font-semibold text-black mt-2">
                {purpose || "General Donation"}
              </h2>
            </div>

            {/* SEVA TYPE */}
            <div className="mb-4 text-center">
              <div className="bg-blue-900 text-white text-sm font-semibold px-4 py-2 rounded-lg inline-block mb-2">
                SEVA TYPE
              </div>
              <p className="text-lg font-bold text-black">{sevaType}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-blue-900 text-white text-sm font-semibold px-4 py-2 rounded-lg inline-block mb-2">
              SEVA AMOUNT
            </div>
            <p className="text-xl font-bold text-white">
              {isAnyAmountDonation ? (
                <input
                  type="text"
                  name="customAmount"
                  value={formData.customAmount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="w-32 text-center bg-transparent border-b border-white focus:outline-none text-white placeholder-white"
                />
              ) : (
                `₹ ${amount ? formatAmount(amount) : "0"}`
              )}
            </p>
            {errors.customAmount && (
              <p className="text-red-600 text-sm mt-1">{errors.customAmount}</p>
            )}
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
                  customAmount: "",
                  wantsMahaPrasadam: false,
                  wants80G: false,
                  address: "",
                  houseApartment: "",
                  village: "",
                  district: "",
                  state: "",
                  pinCode: "",
                  landmark: "",
                  panNumber: "",
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
            {/* Donor Name */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Donor Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your Name"
                required={true}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white"
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Mobile Number<span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber === 0 ? "" : formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Your Phone Number"
                min={1000000000}
                max={9999999999}
                required={true}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {errors.phoneNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                E-Mail ID<span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required={true}
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
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
                  />
                  Indian Citizen
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="citizenType"
                    value="foreign"
                    checked={formData.citizenType === "foreign"}
                    onChange={handleInputChange}
                    className="accent-blue-700"
                  />
                  Foreign Citizen
                </label>
              </div>
              {errors.citizenType && (
                <p className="text-red-600 text-sm mt-1">{errors.citizenType}</p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="text-sm space-y-2">
              {formData.citizenType === "indian" && (
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="wantsMahaPrasadam"
                    checked={formData.wantsMahaPrasadam}
                    onChange={handleInputChange}
                    className="accent-blue-700" 
                  />
                  I would like to receive Maha Prasadam (Only within India)
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
                      ⚠️ 80G Tax Exemption is available only for donations of ₹500 or more.
                    </p>
                  )}
                  <p className="text-[11px] text-black font-semibold mt-1">
                    Finance Act 2021 has made it mandatory to upload the details
                    of donations collected by all those organisations collecting
                    donations which qualify for 80G deduction in Form No. 10BD.
                    The PAN and Address are mandatory details to be uploaded.
                  </p>
                </span>
              </label>
            </div>

            {/* Address Fields - Show when Maha Prasadam OR 80G is selected */}
            {((formData.wantsMahaPrasadam && formData.citizenType === "indian") || formData.wants80G) && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
                  📍 Address
                </h3>
                <div className="space-y-4">
                  {/* Address */}
                  {/* <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Address<span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address"
                      required={formData.wantsMahaPrasadam || formData.wants80G}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white h-20 resize-none"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                    )}
                  </div> */}

                  {/* House/Apartment and Village in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">
                        House/Apartment No.<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="houseApartment"
                        value={formData.houseApartment}
                        onChange={handleInputChange}
                        placeholder="House/Apartment number"
                        required={formData.wantsMahaPrasadam || formData.wants80G}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white"
                      />
                      {errors.houseApartment && (
                        <p className="text-red-600 text-sm mt-1">{errors.houseApartment}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">
                        Village/City<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleInputChange}
                        placeholder="Village or City"
                        required={formData.wantsMahaPrasadam || formData.wants80G}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white"
                      />
                      {errors.village && (
                        <p className="text-red-600 text-sm mt-1">{errors.village}</p>
                      )}
                    </div>
                  </div>

                  {/* District and State in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">
                        District<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="District"
                        required={formData.wantsMahaPrasadam || formData.wants80G}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white"
                      />
                      {errors.district && (
                        <p className="text-red-600 text-sm mt-1">{errors.district}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">
                        State<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        required={formData.wantsMahaPrasadam || formData.wants80G}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      PIN Code<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      required={formData.wantsMahaPrasadam || formData.wants80G}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white"
                    />
                    {errors.pinCode && (
                      <p className="text-red-600 text-sm mt-1">{errors.pinCode}</p>
                    )}
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Nearby landmark (optional)"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white"
                    />
                    {errors.landmark && (
                      <p className="text-red-600 text-sm mt-1">{errors.landmark}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PAN Number Field - Show only when 80G is selected */}
            {formData.wants80G && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 text-center">
                  🆔 PAN Details for 80G Tax Exemption
                </h3>
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
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white uppercase"
                  />
                  {errors.panNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.panNumber}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    Format: 5 letters + 4 numbers + 1 letter (e.g., ABCDE1234F)
                  </p>
                </div>
              </div>
            )}

            {/* Donate Now Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full cursor-pointer ${
                isSubmitting ? "bg-gray-400" : "bg-[#0B3954] hover:bg-[#0B3954]/90"
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
                className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                  !pendingDonationData?.result?.order 
                    ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed" 
                    : "border-blue-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                      !pendingDonationData?.result?.order ? "border-gray-400" : "border-blue-500"
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
