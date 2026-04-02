// components/PhoneInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  minLength: number;
  maxLength: number;
  format?: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  error?: string;
  className?: string;
}

const countries: Country[] = [
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', minLength: 10, maxLength: 10, format: 'XXXXX XXXXX' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', minLength: 10, maxLength: 11, format: 'XXXX XXX XXXX' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', minLength: 9, maxLength: 9, format: 'XXX XXX XXX' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', minLength: 10, maxLength: 12, format: 'XXX XXXXXXXX' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', minLength: 9, maxLength: 9, format: 'XX XX XX XX XX' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', minLength: 10, maxLength: 11, format: 'XXX XXXX XXXX' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳', minLength: 11, maxLength: 11, format: 'XXX XXXX XXXX' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', minLength: 10, maxLength: 11, format: 'XX XXXXX XXXX' },
  { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺', minLength: 10, maxLength: 10, format: 'XXX XXX XX XX' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', minLength: 9, maxLength: 9, format: 'XX XXX XXXX' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽', minLength: 10, maxLength: 10, format: 'XXX XXX XXXX' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷', minLength: 10, maxLength: 11, format: 'XX XXXX XXXX' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', minLength: 9, maxLength: 11, format: 'XXX XXX XXXX' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', minLength: 9, maxLength: 9, format: 'XXX XX XX XX' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', minLength: 9, maxLength: 9, format: 'XX XXX XXXX' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪', minLength: 8, maxLength: 9, format: 'XXX XXX XXX' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', minLength: 9, maxLength: 9, format: 'XX XXX XX XX' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', minLength: 8, maxLength: 8, format: 'XXXX XXXX' },
  { name: 'UAE', code: 'AE', dialCode: '+971', flag: '🇦🇪', minLength: 9, maxLength: 9, format: 'XX XXX XXXX' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', minLength: 9, maxLength: 9, format: 'XX XXX XXXX' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷', minLength: 8, maxLength: 11, format: 'XXX XXXX XXXX' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭', minLength: 8, maxLength: 9, format: 'XX XXX XXXX' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾', minLength: 9, maxLength: 10, format: 'XX XXX XXXX' },
];

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, error, className = '' }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search query
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  // Parse initial value if provided
  useEffect(() => {
    if (value && !phoneNumber) {
      // Try to parse the initial value
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.substring(country.dialCode.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value, phoneNumber]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validate phone number
  const validatePhoneNumber = (number: string, country: Country): boolean => {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length >= country.minLength && cleanNumber.length <= country.maxLength;
  };

  // Format phone number according to country format
  const formatPhoneNumber = (number: string, country: Country): string => {
    const cleanNumber = number.replace(/\D/g, '');
    if (!country.format) return cleanNumber;
    
    let formatted = '';
    let numberIndex = 0;
    
    for (let i = 0; i < country.format.length && numberIndex < cleanNumber.length; i++) {
      if (country.format[i] === 'X') {
        formatted += cleanNumber[numberIndex];
        numberIndex++;
      } else {
        formatted += country.format[i];
      }
    }
    
    return formatted;
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery('');
    
    // Re-validate with new country
    const fullNumber = `${country.dialCode} ${phoneNumber}`;
    const isValid = validatePhoneNumber(phoneNumber, country);
    onChange(fullNumber, isValid);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleanInput = input.replace(/\D/g, '');
    
    // Limit input to max length for selected country
    if (cleanInput.length <= selectedCountry.maxLength) {
      const formatted = formatPhoneNumber(cleanInput, selectedCountry);
      setPhoneNumber(formatted);
      
      const fullNumber = `${selectedCountry.dialCode} ${formatted}`;
      const isValid = validatePhoneNumber(cleanInput, selectedCountry);
      onChange(fullNumber, isValid);
    }
  };

  return (
    <div className={className}>
     
      
      <div className="relative">
        <div className={`flex border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}>
          
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-r border-gray-300 rounded-l-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[120px]"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden w-[180px]">
                {/* Search Input */}
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                
                {/* Country List */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-orange-50 focus:outline-none focus:bg-orange-50 text-left"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="flex-1 text-sm">{country.name}</span>
                        <span className="text-sm text-gray-500 font-mono">{country.dialCode}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder={`Enter ${selectedCountry.minLength}-${selectedCountry.maxLength} digit number`}
            className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none bg-white"
          />
        </div>

        {/* Helper Text */}
        <div className="mt-1 flex justify-between text-xs">
          
          {/* <span className={`${phoneNumber.replace(/\D/g, '').length >= selectedCountry.minLength && phoneNumber.replace(/\D/g, '').length <= selectedCountry.maxLength ? 'text-green-600' : 'text-gray-400'}`}>
            {phoneNumber.replace(/\D/g, '').length}/{selectedCountry.maxLength}
          </span> */}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;