import { useState, useEffect, useCallback } from 'react';

// UTM parameter interface
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

// Hook return interface
export interface UseUTMReturn {
  utm: UTMParams;
  appendUTMToUrl: (url: string) => string;
  clearUTM: () => void;
  hasUTM: boolean;
}

// LocalStorage key for UTM parameters
const UTM_STORAGE_KEY = 'iskcon_utm_params';

// Helper function to get UTM parameters from URL
const getUTMFromURL = (searchParams: URLSearchParams): UTMParams => {
  const utm: UTMParams = {};

  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  utmKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value) {
      utm[key as keyof UTMParams] = value;
    }
  });

  return utm;
};

// Helper function to save UTM parameters to localStorage
const saveUTMToStorage = (utm: UTMParams): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    } catch (error) {
      console.warn('Failed to save UTM parameters to localStorage:', error);
    }
  }
};

// Helper function to get UTM parameters from localStorage
const getUTMFromStorage = (): UTMParams => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(UTM_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to get UTM parameters from localStorage:', error);
      return {};
    }
  }
  return {};
};

// Helper function to clear UTM parameters from localStorage
const clearUTMFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(UTM_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear UTM parameters from localStorage:', error);
    }
  }
};

// Helper function to append UTM parameters to a URL
const appendUTMToURL = (url: string, utm: UTMParams): string => {
  if (!utm || Object.keys(utm).length === 0) {
    return url;
  }

  try {
    // Handle both relative and absolute URLs
    let urlObj: URL;

    // If url is already a full URL, parse it and extract only the pathname and search
    if (url.startsWith('http://') || url.startsWith('https://')) {
      urlObj = new URL(url);
      // Reset to use only pathname and search, ignoring the origin
      const pathAndSearch = urlObj.pathname + urlObj.search;
      // Create a new URL object using the current origin to ensure we get the right base
      urlObj = new URL(pathAndSearch, typeof window !== 'undefined' ? window.location.origin : 'https://harekrishnavidya.org');
    } else {
      // For relative URLs, use the current origin
      urlObj = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://harekrishnavidya.org');
    }

    // Add UTM parameters to the URL
    Object.entries(utm).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value);
      }
    });

    // Return pathname, search params, and hash (fragment)
    return urlObj.pathname + urlObj.search + urlObj.hash;
  } catch (error) {
    console.warn('Failed to append UTM parameters to URL:', error);
    return url;
  }
};

/**
 * React hook for managing UTM parameters across the user journey
 * 
 * Features:
 * - Automatically captures UTM parameters from URL on first load
 * - Stores UTM parameters in localStorage for persistence
 * - Provides helper functions to append UTM parameters to any URL
 * - TypeScript-friendly with proper interfaces
 * 
 * @returns {UseUTMReturn} Object containing UTM data and helper functions
 * 
 * @example
 * ```tsx
 * const { utm, appendUTMToUrl, clearUTM, hasUTM } = useUTM();
 * 
 * // Check if UTM parameters exist
 * console.log(utm); // { utm_source: "AIKYA", utm_medium: "SMS", utm_campaign: "HYD" }
 * 
 * // Append UTM parameters to a URL
 * const checkoutUrl = appendUTMToUrl('/donate?purpose=Food&amount=100');
 * // Result: "/donate?purpose=Food&amount=100&utm_source=AIKYA&utm_medium=SMS&utm_campaign=HYD"
 * 
 * // Clear UTM parameters
 * clearUTM();
 * ```
 */
export const useUTM = (): UseUTMReturn => {
  const [utm, setUtm] = useState<UTMParams>({});
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  // Initialize searchParams on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Use window.location.search instead of useSearchParams for SSR safety
        setSearchParams(new URLSearchParams(window.location.search));
      } catch (error) {
        console.warn('Failed to initialize search params:', error);
      }
    }
  }, []);

  // Initialize UTM parameters on component mount
  useEffect(() => {
    if (!searchParams) return;

    // Get UTM parameters from URL
    const urlUTM = getUTMFromURL(searchParams);

    // Get UTM parameters from localStorage
    const storedUTM = getUTMFromStorage();

    let finalUTM: UTMParams;

    // If URL has UTM parameters, use them and save to localStorage
    if (Object.keys(urlUTM).length > 0) {
      finalUTM = urlUTM;
      saveUTMToStorage(urlUTM);
    } else {
      // If URL doesn't have UTM parameters, use stored ones
      finalUTM = storedUTM;
    }

    setUtm(finalUTM);
  }, [searchParams]);

  // Function to append UTM parameters to any URL
  const appendUTMToUrl = useCallback((url: string): string => {
    return appendUTMToURL(url, utm);
  }, [utm]);

  // Function to clear UTM parameters
  const clearUTM = useCallback((): void => {
    clearUTMFromStorage();
    setUtm({});
  }, []);

  // Check if UTM parameters exist
  const hasUTM = Object.keys(utm).length > 0;

  return {
    utm,
    appendUTMToUrl,
    clearUTM,
    hasUTM,
  };
};

// Export the hook as default for easier imports
export default useUTM;
