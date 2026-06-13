"use client";

import React from "react";

export default function SponsorshipsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <h1 className="text-[36px] sm:text-[42px] lg:text-[48px] font-extrabold text-[#2C2C2C] drop-shadow-sm mb-6">
          Sponsorships
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Support our mission through various sponsorship opportunities. 
          We are currently updating this page with more details. 
          Please check back soon!
        </p>
        <div className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors cursor-pointer">
          Contact Us for Details
        </div>
      </div>
    </div>
  );
}
