import React from 'react';
import Link from 'next/link';
import useUTM from '../utils/useUTM';

interface DonationSuccessProps {
  donationDetails?: {
    sevaName: string;
    amount: number;
    donorName: string;
    paymentId?: string;
    donorEmail?: string;
  };
  emailSent?: boolean;
  emailMessage?: string;
  onClose?: () => void;
}

const DonationSuccess: React.FC<DonationSuccessProps> = ({ 
  donationDetails, 
  emailSent,
  emailMessage,
  onClose 
}) => {
  const { appendUTMToUrl } = useUTM();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg 
            className="w-8 h-8 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Thank You for Your Donation!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your generous contribution will make a real difference in the lives of those in need.
        </p>

        {/* Donation Details */}
        {donationDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Donation Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Seva:</span>
                <span className="font-medium">{donationDetails.sevaName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₹{donationDetails.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donor:</span>
                <span className="font-medium">{donationDetails.donorName}</span>
              </div>
              {donationDetails.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium text-xs">{donationDetails.paymentId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">What&apos;s Next?</h4>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            {emailSent ? (
              <>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Receipt email sent to {donationDetails?.donorEmail}
                </li>
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Your receipt is ready for download/printing</li>
                <li>• For 80G tax exemption, use the receipt from email</li>
              </>
            ) : (
              <>
                <li>• You&apos;ll receive a confirmation email shortly</li>
                <li>• Your donation receipt will be sent within 24 hours</li>
                <li>• For 80G tax exemption, please check your email</li>
              </>
            )}
          </ul>
          
          {/* Email Status Message */}
          {emailMessage && (
            <div className={`mt-3 p-2 rounded text-xs ${
              emailSent 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {emailMessage}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href={appendUTMToUrl("/donation")}
            className="flex-1 bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Make Another Donation
          </Link>
          
          <Link 
            href="/"
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default DonationSuccess;
