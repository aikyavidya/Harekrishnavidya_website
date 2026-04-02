"use client";
import React from "react";

import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import useUTM from "../utils/useUTM";
import mobileImg from "../../public/images/mob_navratri.jpg";
import tabletImg from "../../public/images/mob_navratri.jpg";
import desktopImg from "../../public/images/navartri.jpg";

import dig1 from "../../public/dig1.jpg";
import dig2 from "../../public/dig2.jpg";

import edu1 from "../../public/galleryection/education7.jpg";
import fest1 from "../../public/galleryection/food01.jpg";
import value from "../../public/galleryection/food04.jpg";
import yoga1 from "../../public/galleryection/food2.jpg";
import edu2 from "../../public/galleryection/edu2.jpg";
import fest2 from "../../public/galleryection/foodDonation.jpg";
import cul1 from "../../public/galleryection/cul1.jpg";
import edu3 from "../../public/galleryection/education3.jpg";
import Link from "next/link";

const galleryImages = [
  { src: fest1, alt: "Gallery 1" },
  { src: edu1, alt: "Gallery 3" },
  { src: fest2, alt: "Gallery 2" },
  { src: edu3, alt: "Gallery 3" },
  { src: value, alt: "Gallery 3" },
  { src: yoga1, alt: "Gallery 3" },
  { src: edu2, alt: "Gallery 3" },
  { src: cul1, alt: "Gallery 3" },
];

// Data from the image - Food & Health Sponsorship
const foodHealthOptions = [
  { children: 20, amount: 500, description: "Sponsor 20 children for Food & Health" },
  { children: 40, amount: 1000, description: "Sponsor 40 children for Food & Health" },
  { children: 60, amount: 1500, description: "Sponsor 60 children for Food & Health" },
  { children: 80, amount: 2000, description: "Sponsor 80 children for Food & Health" },
];

// Education Sponsorship
const educationOptions = [
  { children: 1, amount: 500, description: "Sponsor Education for 1 Child for One Month" },
  { children: 2, amount: 1000, description: "Sponsor Education for 2 Children for One Month" },
  { children: 3, amount: 1500, description: "Sponsor Education for 3 Children for One Month" },
  { children: 4, amount: 2000, description: "Sponsor Education for 4 Children for One Month" },
];

// Combined Sponsorship
const combinedOptions = [
  { children: 1, amount: 12000, description: "Sponsor Food, Education, Health & Values for 1 Child for 1 Year" },
  { children: 2, amount: 24000, description: "Sponsor Food, Education, Health & Values for 2 Children for 1 Year" },
];

// Helper function to format numbers in Indian style
const formatIndianCurrency = (amount: number) => {
  return amount.toLocaleString("en-IN");
};

function DonationCard({
  description,
  amount,
  borderColor = "blue-900",
}: {
  description: string;
  amount: number;
  borderColor?: string;
}) {
  const { appendUTMToUrl } = useUTM();

  return (
    <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-${borderColor} hover:border-${borderColor}`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${borderColor} via-${borderColor} to-${borderColor}`}></div>
      <div className="p-8 text-center">
        <h3 className="font-bold text-xl mb-3 text-gray-800 leading-tight">
          {description}
        </h3>
        <div className="mb-6">
          <span className="text-3xl font-extrabold text-black">
            ₹ {formatIndianCurrency(amount)}
          </span>
        </div>
        <Link
          href={appendUTMToUrl(
            `/donate?purpose=${encodeURIComponent(description)}&amount=${amount}`
          )}
        >
          <button className={`bg-gradient-to-r from-${borderColor} to-${borderColor} text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer`}>
            Donate Now
          </button>
        </Link>
      </div>
    </div>
  );
}

function AnyAmountCard({ title, purpose, borderColor = "blue-900" }: { title: string; purpose: string; borderColor?: string }) {
  const { appendUTMToUrl } = useUTM();

  return (
    <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-${borderColor}`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${borderColor} via-${borderColor} to-${borderColor}`}></div>
      <div className="p-8 text-center">
        <h3 className="font-bold text-xl mb-3 text-gray-800 leading-tight">
          {title}
        </h3>
        <div className="mb-6">
          <span className="text-2xl font-semibold text-gray-500">
            ------------
          </span>
        </div>
        <Link
          href={appendUTMToUrl(
            `/donate?purpose=${encodeURIComponent(purpose)}`
          )}
        >
          <button className={`bg-gradient-to-r from-${borderColor} to-${borderColor} text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer`}>
            Donate Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function DonationPage() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  return (
    <>
      <div className="relative w-full md:aspect-[16/8] aspect-[4/5] overflow-hidden">
        <Image
          src={isMobile ? mobileImg : isTablet ? tabletImg : desktopImg}
          alt="Donation Banner"
          fill
          className="object-cover lg:px-3"
          priority
        />
        <div className="absolute inset-0 z-10"></div>
      </div>

      <div className="text-center py-10 text-2xl md:text-3xl font-bold md:max-w-6xl mx-auto">
        We are providing{" "}
        <span className="text-orange-500">Free Food, Education </span> and
        Values for life based on Bhagavad-Gita to underprivileged in{" "}
        <span className="text-orange-500"> Rural Areas of India</span>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-10 max-w-6xl mx-auto">
        <div className="flex-1">
          <Image
            src={dig1}
            alt="idji1"
            className="object-contain w-full h-auto"
          />
        </div>
        <div className="flex-1">
          <Image
            src={dig2}
            alt="idji2"
            className="object-contain w-full h-auto"
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="mt-4 md:mt-0 bg-orange-500 text-white text-center py-3 rounded-md max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold">
          Our Trustee Shri Madhu Pandit Dasa
        </h3>
        <p className="text-md mt-1">
          Striving to please spiritual Master Srila Prabhupada, a true visionary
          who wanted to see a hunger free world.
        </p>
      </div>

      {/* Food & Health Sponsorship Section */}
      <div className="bg-white text-center py-8 px-4">
        <button className="bg-gray-200 text-black font-semibold px-4 py-2 rounded-full mb-4 text-[36px]">
          ✧ Food & Health Sponsorship
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold italic">
          Serve Love Through <span className="text-blue-900">Food & Health</span>
        </h2>

        <p className="text-gray-600 mt-2 mb-10 max-w-xl mx-auto">
          &quot;Join our sacred mission to feed hungry souls and provide healthcare. Every meal and medicine you fund brings hope and healing.&quot;
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {foodHealthOptions.map(({ children, amount, description }) => (
            <DonationCard
              key={`food-${children}`}
              description={description}
              amount={amount}
              borderColor="blue-900"
            />
          ))}
          
          {/* Any Amount Card */}
          <AnyAmountCard 
            title="Donate another amount for Food & Health" 
            purpose="Food & Health - Any Amount"
            borderColor="blue-900"
          />
        </div>
      </div>

      {/* Education Sponsorship Section */}
      <div className="bg-white text-center py-8 px-4 text-black">
        <button className="bg-gray-200 text-black font-semibold px-4 py-2 rounded-full mb-6 text-[36px]">
          ✧ Education Sponsorship
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold italic mb-2">
          Gift the Light of <span className="text-orange-500">Learning</span>
        </h2>

        <p className="text-gray-500 max-w-xl mx-auto mb-10">
          &quot;Through your support, children gain not just education, but purpose and inner strength.&quot;
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {educationOptions.map(({ children, amount, description }) => (
            <DonationCard
              key={`education-${children}`}
              description={description}
              amount={amount}
              borderColor="orange-500"
            />
          ))}
          
          {/* Any Amount Card */}
          <AnyAmountCard 
            title="Donate another amount for Education" 
            purpose="Education - Any Amount"
            borderColor="orange-500"
          />
        </div>
      </div>

      {/* Combined Sponsorship Section */}
      <div className="bg-white text-center py-8 px-4 text-black">
        <button className="bg-gray-200 text-black font-semibold px-4 py-2 rounded-full mb-6 text-[36px]">
          ✧ Combined Sponsorship
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold italic mb-2">
          Complete Support for <span className="text-green-600">Holistic Development</span>
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-10">
          &quot;Provide comprehensive support covering food, education, health, and values - everything a child needs to flourish.&quot;
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {combinedOptions.map(({ children, amount, description }) => (
            <DonationCard
              key={`combined-${children}`}
              description={description}
              amount={amount}
              borderColor="green-600"
            />
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-[#EDF2F7]">
        <section className="mt-5 px-4 md:px-10 lg:px-20">
          <div className=" flex items-center justify-center  mt-2">
            <div className="flex flex-col items-center gap-4 w-[523px] text-center text-[--text-dark-charcoal] font-['Urbanist']">
              <h1 className=" text-2xl mt-2 lg:text-[40px] font-extrabold leading-[120%]">
                A glimpse into the lives you&#39;ve <br />
                touched with your{" "}
                <span className="text-[#FF9C5A] italic">kindness</span>
              </h1>
            </div>
          </div>
        </section>
        <section className="px-4 py-6  flex justify-center">
          <div className="max-w-6xl w-full text-center">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((item, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-md "
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    className="  transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* 🔁 Inverted overlay logic: starts dark, fades on hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/10 bg-opacity-60 group-hover:bg-opacity-0 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}