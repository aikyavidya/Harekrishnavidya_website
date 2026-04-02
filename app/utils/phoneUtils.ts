// Phone number utilities for donation forms

export interface PhoneNumberInfo {
  countryCode: string;
  nationalNumber: string;
  formattedNumber: string;
  isValid: boolean;
}

/**
 * Format phone number based on citizen type
 */
export const formatPhoneNumber = (
  phoneNumber: string | number, 
  citizenType: 'indian' | 'foreign'
): string => {
  const cleanNumber = String(phoneNumber).replace(/\D/g, '');
  
  if (citizenType === 'indian') {
    // For Indian numbers, assume +91 if not provided
    if (cleanNumber.length === 10) {
      return `+91${cleanNumber}`;
    } else if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
      return `+${cleanNumber}`;
    } else if (cleanNumber.startsWith('+91') && cleanNumber.length === 13) {
      return cleanNumber;
    }
    // Default to +91 for Indian numbers
    return `+91${cleanNumber.slice(-10)}`;
  } else {
    // For foreign numbers, try to detect country code
    if (cleanNumber.startsWith('+')) {
      return cleanNumber;
    } else if (cleanNumber.length >= 10) {
      // Assume it's a valid international number
      return `+${cleanNumber}`;
    }
    return cleanNumber;
  }
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (
  phoneNumber: string | number, 
  citizenType: 'indian' | 'foreign'
): boolean => {
  const cleanNumber = String(phoneNumber).replace(/\D/g, '');
  
  if (citizenType === 'indian') {
    // Indian numbers should be 10 digits (excluding country code)
    return cleanNumber.length === 10 && /^[6-9]\d{9}$/.test(cleanNumber);
  } else {
    // Foreign numbers should be at least 7 digits
    return cleanNumber.length >= 7;
  }
};

/**
 * Get phone number info for API submission
 */
export const getPhoneNumberInfo = (
  phoneNumber: string | number, 
  citizenType: 'indian' | 'foreign'
): PhoneNumberInfo => {
  const formattedNumber = formatPhoneNumber(phoneNumber, citizenType);
  const isValid = validatePhoneNumber(phoneNumber, citizenType);
  
  return {
    countryCode: formattedNumber.startsWith('+') ? formattedNumber.slice(1, 3) : '91',
    nationalNumber: formattedNumber.replace(/^\+?\d{1,3}/, ''),
    formattedNumber,
    isValid
  };
};

/**
 * Display phone number in user-friendly format
 */
export const displayPhoneNumber = (
  phoneNumber: string | number, 
  citizenType: 'indian' | 'foreign'
): string => {
  const cleanNumber = String(phoneNumber).replace(/\D/g, '');
  
  if (citizenType === 'indian') {
    // Format Indian numbers as XXX-XXX-XXXX
    if (cleanNumber.length === 10) {
      return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    }
  }
  
  return cleanNumber;
};
