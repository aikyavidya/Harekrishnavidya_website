"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUTM from "../../utils/useUTM";

export default function UDonationsPage() {
  const router = useRouter();
  const { utm } = useUTM();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Only redirect if we have UTM parameters and haven't redirected yet
    if (utm.utm_source && isRedirecting) {
      const params = new URLSearchParams();
      
      // Add UTM parameters
      if (utm.utm_source) params.set("utm_source", utm.utm_source);
      if (utm.utm_medium) params.set("utm_medium", utm.utm_medium);
      if (utm.utm_campaign) params.set("utm_campaign", utm.utm_campaign);
      if (utm.utm_term) params.set("utm_term", utm.utm_term);
      if (utm.utm_content) params.set("utm_content", utm.utm_content);

      const queryString = params.toString();
      const redirectUrl = queryString ? `/donation?${queryString}` : "/donation";
      
      setIsRedirecting(false);
      router.replace(redirectUrl);
    }
  }, [router, utm, isRedirecting]);

  // If no UTM parameters, show the donation page directly
  if (!utm.utm_source) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to donation page...</p>
      </div>
    </div>
  );
}
