"use client";

import Link from "next/link";
import Image from "next/image";
import akshayaBanner from "../../public/images/akshaya_banner.jpg";
import homeImg from "../../public/images/img1.png";
import homeImg2 from "../../public/images/home_banner.png";
import tab_banner from "../../public/images/tab_home_banner.png";
import img9 from "../../public/images/img9.png";
import k3 from "../../public/images/Group_1.png";
import k1 from "../../public/images/Group_2.png";
import k4 from "../../public/images/Group_3.png";
import k5 from "../../public/images/Group_4.png";
import k2 from "../../public/images/Group_5.png";
import Heart from "../../public/images/Heart.png";
import info from "../../public/images/info.png";

import { useState, useEffect, useRef } from "react";
import useUTM from "../utils/useUTM";
import { motion } from "framer-motion";
import { ScaleIn, SlideIn } from "./AnimationProvider";

export default function HeroSection() {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const { appendUTMToUrl } = useUTM();

  const heroRef = useRef(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch("https://api.harekrishnavidya.org/api/home-banner/get");
        const data = await response.json();
        if (data.url) {
          const fullUrl = data.url.startsWith("http")
            ? data.url
            : `https://api.harekrishnavidya.org${data.url}`;
          setBannerUrl(fullUrl);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };
    fetchBanner();
  }, []);

  return (
    <>
      <div ref={heroRef}>
        {/* Hero Section */}
        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col gap-2 relative overflow-hidden">
        {/* ✅ Mobile banner */}
        <motion.div
          className="bg-cover bg-top text-white w-full rounded-xl overflow-hidden h-[300px] block sm:hidden"
          style={{ backgroundImage: `url(${akshayaBanner.src})` }}
        />

        {/* ✅ Tablet banner */}
        <motion.div
          className="bg-cover bg-top text-white w-full rounded-xl overflow-hidden h-[400px] hidden sm:block md:hidden"
          style={{ backgroundImage: `url(${akshayaBanner.src})` }}
        />

          {/* Container for cards */}
          <div className=" mb:bottom-10 left-0 right-0 flex flex-col-reverse  px-4  gap-4">
            {/* Karma Insights Box */}
            <div className="text-black p-4 md:p-6 shadow-xl w-full md:w-[400px] lg:w-[420px] flex flex-col justify-center items-center gap-4 border border-orange-500 rounded-3xl bg-[rgba(237,242,247,0.80)] backdrop-blur-md">
              <div className="flex items-center justify-between flex-wrap  gap-2">
                <div className="flex items-center  gap-2 px-3 py-2 bg-[#F9F9F9] rounded-full shadow-md  text-black font-semibold text-base ">
                  <Image
                    src={img9}
                    alt="Star Icon"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  Welfare Insights
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:gap-20  md:gap-10">
                <div className="text-center">
                  <p className="text-2xl md:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    800K
                  </p>
                  <p className="text-sm md:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Meals <br /> Served
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    50K
                  </p>
                  <p className="text-sm md:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Children&#39;s Educated
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-2 flex-wrap gap-2">
                <div className="flex -space-x-3">
                  {[k3, k1, k4, k5, k2].map((src, idx) => (
                    <motion.div
                      key={idx}
                      className={`relative w-8 h-8 rounded-full border-2 border-white z-[${5 - idx}] animate-float-delay-${idx % 3 + 1}`}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                    >
                      <Image
                        src={src}
                        alt={`donor-${idx}`}
                        fill
                        className="rounded-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="ml-2 text-gray-700 font-semibold italic text-xs md:text-sm">
                  5000+ Donors around the world
                </span>
              </div>
            </div>

            {/* CTA Box */}
            <SlideIn direction="up" delay={0.2} className="text-white shadow-xl flex w-full md:w-[400px] lg:w-[515px] px-4 md:px-[35px] py-4 md:py-[26px] justify-center items-center rounded-3xl border border-orange-600 bg-gray-400 backdrop-blur-md">
              <div className="w-full text-center md:text-left">
                <h3 className="text-lg  font-semibold mb-2">
                  Nourish a Life. Uplift a Soul.
                </h3>
                <p className="text-sm text-white/80 mb-4">
                  Your support delivers food, education, and
                  <br className="hidden md:block" />
                  hope to those who need it most.
                </p>
                <div className="flex justify-evenly    gap-2 mt-4">
                  <Link href={appendUTMToUrl("/donation")}>
                    <button className="btn-interactive flex flex-1 items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-semibold px-4 py-3 rounded-lg shadow-md animate-pulse-glow">
                      <Image
                        src={Heart}
                        alt="Donate Icon"
                        width={20}
                        height={20}
                        className="w-6 h-6"
                      />
                      Donate Now
                    </button>
                  </Link>
                  <Link href="/about-us">
                    <button className="btn-interactive flex w-full justify-center items-center gap-2 bg-white hover:bg-gray-100 cursor-pointer font-semibold px-4 py-3 text-black rounded-lg shadow-md hover-lift">
                      <Image
                        src={info}
                        alt="Info Icon"
                        width={20}
                        height={30}
                        className="w-6 h-6"
                      />
                      About Us
                    </button>
                  </Link>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>

        {/* Desktop Layout */}
        <section
          className="hidden md:block relative text-white w-full overflow-hidden h-[600px] lg:h-[700px] xl:h-[800px]"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${akshayaBanner.src})` }}
          />
          {/* Container for cards */}
          <div className="absolute bottom-12 md:bottom-20 lg:bottom-32 xl:bottom-40 left-1 right-1 flex flex-col md:flex-col lg:flex-row md:items-center lg:items-start md:gap-6 lg:gap-40 px-4 md:px-8 lg:px-4 z-10">
            {/* Karma Insights Box */}
            <SlideIn direction="left" duration={0.8} className="text-black p-4 md:p-4 mb-0 shadow-xl w-full md:max-w-[500px] xl:w-[300px] flex flex-col gap-4 rounded-3xl bg-[rgba(237,242,247,0.80)] backdrop-blur-md mx-auto lg:mx-0 hover-lift isolate">
              <div className="flex items-center justify-center md:justify-center flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#F9F9F9] rounded-full shadow-md text-black font-semibold text-base md:text-lg">
                  <Image src={img9} alt="Star Icon" width={20} height={20} />
                  Welfare Insights
                </div>
              </div>

              <div className="flex items-center  gap-6 xl:gap-24">
                <div className="text-center">
                  <p className="text-2xl md:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    800K
                  </p>
                  <p className="text-sm md:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Meals <br /> Served
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    50K
                  </p>
                  <p className="text-sm md:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Children&#39;s <br /> Educated
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-2 flex-wrap gap-2">
                <div className="flex -space-x-3">
                  {[k3, k1, k4, k5, k2].map((src, idx) => (
                    <motion.div
                      key={idx}
                      className={`relative w-8 h-8 rounded-full border-2 border-white z-[${5 - idx}] animate-float-delay-${idx % 3 + 1}`}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                    >
                      <Image
                        src={src}
                        alt={`donor-${idx}`}
                        fill
                        className="rounded-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="ml-2 text-gray-700 font-semibold italic text-xs md:text-sm">
                  5000+ Donors around the world
                </span>
              </div>
            </SlideIn>

            {/* CTA Box */}
            <SlideIn direction="right" duration={0.8} delay={0.2} className="absolute xl:right-6 text-white shadow-xl flex w-full md:max-w-[500px] lg:w-[380px] px-4 md:px-6 py-4 md:py-6 lg:py-8 xl:py-10 justify-center items-center rounded-3xl border border-black bg-black/10 backdrop-blur-md mx-auto lg:mx-0 hover-lift isolate">
              <div className="w-full text-center md:text-left">
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Nourish a Life. Uplift a Soul.
                </h3>
                <p className="text-md text-white/80 mb-4">
                  Your support delivers food, education, and
                  <br className="hidden md:block" />
                  hope to those who need it most.
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-center md:justify-start md:space-x-4 gap-2 mt-4">
                  <Link href={appendUTMToUrl("/donation")}>
                    <button className="btn-interactive w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-semibold px-4 py-3 rounded-lg shadow-md animate-pulse-glow">
                      <Image
                        src={Heart}
                        alt="Donate Icon"
                        width={20}
                        height={20}
                        className="w-6 h-6"
                      />
                      Donate Now
                    </button>
                  </Link>

                  <Link href="/about-us">
                    <button className="btn-interactive w-full flex justify-center items-center gap-2 bg-white hover:bg-gray-100 cursor-pointer font-semibold px-4 py-3 text-black rounded-lg shadow-md hover-lift">
                      <Image
                        src={info}
                        alt="Info Icon"
                        width={20}
                        height={30}
                        className="w-6 h-6"
                      />
                      About Us
                    </button>
                  </Link>
                </div>
              </div>
            </SlideIn>
          </div>
        </section>
      </div>

      {/* Section Below Hero */}
      <section className="flex flex-col justify-center items-center md:items-center w-full lg:mx-4 p-4 mt-8">
        <ScaleIn duration={0.7} className="text-center">
          <h2 className="mb-1 text-[36px] sm:text-[42px] lg:text-[48px] italic font-extrabold leading-[120%] font-['Urbanist'] text-[#2C2C2C] drop-shadow-sm">
            Give Nourishment, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 animate-gradient-shift">Give Knowledge</span>, Give Hope
          </h2>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] italic font-medium leading-[160%] text-gray-600 font-['Urbanist'] mt-4 drop-shadow-sm max-w-2xl mx-auto">
            <span className="text-orange-500 font-bold px-1 py-0.5 rounded-md bg-orange-50 inline-block mr-1">
              Decide the path
            </span>
            of your kindness — Your help leads to hope and transformation
          </p>
        </ScaleIn>
      </section>
    </>
  );
}
