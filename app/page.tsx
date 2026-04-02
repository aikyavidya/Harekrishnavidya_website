"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUTM from "@/app/utils/useUTM";

const HomePage = () => {
  const router = useRouter();
  const { appendUTMToUrl } = useUTM();

  useEffect(() => {
    // Always redirect to donation page as the default homepage
    const donationUrl = appendUTMToUrl("/donation");
    router.push(donationUrl);
  }, [router, appendUTMToUrl]);

  // Show a loading screen while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C398E] mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Redirecting to donation page...</p>
      </div>
    </div>
  );
};

export default HomePage;
