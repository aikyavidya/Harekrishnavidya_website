"use client";

import Link from "next/link";
import Image from "next/image";
import akshayaBanner from "../../public/images/updated_akshaya_banner.jpg";
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

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useRef, useState, useEffect } from "react";
import useUTM from "../utils/useUTM";
import { motion } from "framer-motion";
import { ScaleIn, SlideIn } from "./AnimationProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";

export default function HeroSection() {
  const { appendUTMToUrl, handleDonateClick } = useUTM();

  const heroRef = useRef(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hkv_home_banner_url");
    }
    return null;
  });

  useEffect(() => {
    const fetchHomeBanner = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home-banner/get`);
        const data = await response.json();
        if (data && data.url) {
          const resolvedUrl = data.url.startsWith("http")
            ? data.url
            : `${API_BASE_URL}${data.url}`;
          setBannerUrl(resolvedUrl);
          if (typeof window !== "undefined") {
            localStorage.setItem("hkv_home_banner_url", resolvedUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching home banner:", error);
      }
    };

    fetchHomeBanner();
  }, []);

  const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-orange-500/90 hover:bg-orange-600 text-white p-1.5 md:p-2.5 rounded-full transition-all cursor-pointer block xl:hidden shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
      </button>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-orange-500/90 hover:bg-orange-600 text-white p-1.5 md:p-2.5 rounded-full transition-all cursor-pointer block xl:hidden shadow-lg"
      >
        <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
      </button>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    fade: false,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    pauseOnHover: false,
    appendDots: (dots: any) => (
      <div style={{ position: "absolute", bottom: "30px", width: "100%" }}>
        <ul style={{ margin: "0px", display: "flex", justifyContent: "center", gap: "10px" }}> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors duration-300 slick-custom-dot cursor-pointer" />
    )
  };

  const bannerSrc = bannerUrl || akshayaBanner.src;
  const carouselSlides = [bannerSrc, bannerSrc, bannerSrc];

  return (
    <>
      <div ref={heroRef}>
        {/* Hero Section */}
        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col gap-2 relative overflow-hidden">
          <div className="w-full relative rounded-xl overflow-hidden mb-2">
            {/* <Slider {...sliderSettings} className="w-full">
              {carouselSlides.map((slide, index) => (
                <div key={index} className="w-full outline-none">
                  <div 
                    className="w-full h-[300px] sm:h-[400px] bg-[length:100%_100%] bg-no-repeat bg-center"
                    style={{ backgroundImage: `url(${slide})` }}
                  />
                </div>
              ))}
            </Slider> */}
            <Link href="/donation#annadan-seva" onClick={handleDonateClick} className="cursor-pointer block w-full outline-none">
              <img
                src={carouselSlides[0]}
                alt="Hero Banner"
                className="w-full h-auto block"
              // className="w-full max-h-[80vh] object-contain mx-auto"
              />
            </Link>
          </div>

          {/* Container for cards */}
          <div className=" mb:bottom-10 left-0 right-0 flex flex-col-reverse  px-4  gap-4">
            {/* Karma Insights Box */}
            <div className="text-black p-4 md:p-6 shadow-xl w-full md:w-[400px] lg:w-[420px] flex flex-col justify-center items-center gap-4 rounded-3xl bg-[rgba(237,242,247,0.80)] backdrop-blur-md">
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
            <SlideIn direction="up" delay={0.2} className="text-[#2C2C2C] shadow-xl flex w-full md:w-[400px] lg:w-[515px] px-4 md:px-[35px] py-4 md:py-[26px] justify-center items-center rounded-3xl bg-[rgba(237,242,247,0.80)] backdrop-blur-md">
              <div className="w-full text-center md:text-left">
                <h3 className="text-lg  font-semibold mb-2">
                  Nourish a Life. Uplift a Soul.
                </h3>
                <p className="text-sm text-[#2C2C2C]/80 mb-4">
                  Your support delivers food, education, and
                  <br className="hidden md:block" />
                  hope to those who need it most.
                </p>
                <div className="flex justify-evenly    gap-2 mt-4">
                  <Link href={appendUTMToUrl("/donation#annadan-seva")} onClick={handleDonateClick}>
                    <button className="btn-interactive flex flex-1 items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white cursor-pointer font-semibold px-4 py-3 rounded-lg shadow-md">
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

        <section
          className="hidden md:block relative text-white w-full overflow-hidden"
        >
          <Link href="/donation#annadan-seva" onClick={handleDonateClick} className="cursor-pointer block w-full md:aspect-[16/7] min-[1025px]:h-[100vh] min-[1025px]:aspect-auto">
            <img
              src={carouselSlides[0]}
              alt="Hero Banner"
              className="w-full h-full md:object-cover md:object-center min-[1025px]:object-fill block"
            />
          </Link>
          <style dangerouslySetInnerHTML={{
            __html: `
            .slick-dots li.slick-active .slick-custom-dot {
              background-color: #f97316 !important;
              transform: scale(1.25);
            }
          `}} />
          {/* Container for cards */}
          <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-10 left-1 right-1 flex flex-col md:flex-row md:items-stretch md:justify-between gap-4 md:gap-3 lg:gap-6 px-4 md:px-6 lg:px-4 z-10">
            {/* Karma Insights Box */}
            <SlideIn direction="left" duration={0.8} className="text-black p-4 md:p-2 lg:p-6 mb-0 shadow-xl w-full md:w-[220px] md:h-[165px] lg:w-[400px] lg:h-[250px] xl:w-[400px] xl:h-[250px] flex flex-col justify-center gap-4 md:gap-2 lg:gap-4 rounded-3xl bg-[rgba(237,242,247,0.80)] backdrop-blur-md mx-auto md:mx-0 hover-lift isolate">
              <div className="flex items-center justify-center md:justify-center flex-wrap gap-2">
                <div className="flex items-center gap-1 px-3 py-2 md:px-1.5 md:py-0.5 bg-[#F9F9F9] rounded-full shadow-md text-black font-semibold text-base md:text-[9px] lg:text-lg">
                  <Image src={img9} alt="Star Icon" width={20} height={20} />
                  Welfare Insights
                </div>
              </div>

              <div className="flex items-center md:justify-center lg:justify-center gap-6 md:gap-3 lg:gap-12 xl:gap-24">
                <div className="text-center">
                  <p className="text-2xl md:text-sm lg:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    800K
                  </p>
                  <p className="text-sm md:text-[8px] lg:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Meals <br /> Served
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-sm lg:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    50K
                  </p>
                  <p className="text-sm md:text-[8px] lg:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Children&#39;s <br /> Educated
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-2 md:mt-0 flex-wrap gap-2 md:gap-1 md:justify-center">
                <div className="flex -space-x-3 md:-space-x-1.5">
                  {[k3, k1, k4, k5, k2].map((src, idx) => (
                    <motion.div
                      key={idx}
                      className={`relative w-8 h-8 md:w-5 md:h-5 lg:w-8 lg:h-8 rounded-full border-2 border-white z-[${5 - idx}] animate-float-delay-${idx % 3 + 1}`}
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
                <span className="ml-2 md:ml-0.5 text-gray-700 font-semibold italic text-xs md:text-[8px] lg:text-sm">
                  5000+ Donors around the world
                </span>
              </div>
            </SlideIn>

            {/* CTA Box */}
            <SlideIn direction="right" duration={0.8} delay={0.2} className="absolute md:static text-[#2C2C2C] shadow-xl flex flex-col w-full md:w-[220px] md:h-[165px] lg:w-[400px] lg:h-[250px] xl:w-[400px] xl:h-[250px] px-4 md:p-2 lg:p-6 xl:p-8 justify-center items-center rounded-3xl bg-[rgba(237,242,247,0.80)] backdrop-blur-md mx-auto md:mx-0 hover-lift isolate">
              <div className="w-full text-center md:text-center lg:text-left">
                <h3 className="text-lg md:text-[10px] lg:text-xl font-semibold mb-2 md:mb-0.5 lg:mb-2">
                  Nourish a Life. Uplift a Soul.
                </h3>
                <p className="text-md md:text-[8px] lg:text-md text-[#2C2C2C]/80 mb-4 md:mb-1.5 lg:mb-4 leading-normal">
                  Your support delivers food, education, and
                  <br className="hidden md:block" />
                  hope to those who need it most.
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-center md:flex-row md:justify-center lg:flex-row sm:space-x-2 md:space-x-1.5 lg:space-x-4 gap-2 md:gap-1.5 lg:gap-2 mt-4 md:mt-1 lg:mt-4">
                  <Link href={appendUTMToUrl("/donation#annadan-seva")} onClick={handleDonateClick} className="w-full md:w-auto">
                    <button className="btn-interactive w-full md:w-auto flex items-center justify-center gap-2 md:gap-1 bg-blue-900 hover:bg-blue-800 text-white cursor-pointer font-semibold px-4 py-3 md:px-1.5 md:py-1 lg:px-4 lg:py-3 rounded-lg shadow-md text-sm md:text-[8px] lg:text-base">
                      <Image
                        src={Heart}
                        alt="Donate Icon"
                        width={20}
                        height={20}
                        className="w-6 h-6 md:w-3.5 md:h-3.5 lg:w-6 lg:h-6"
                      />
                      Donate Now
                    </button>
                  </Link>
 
                  <Link href="/about-us" className="w-full md:w-auto">
                    <button className="btn-interactive w-full md:w-auto flex justify-center items-center gap-2 md:gap-1 bg-white hover:bg-gray-100 cursor-pointer font-semibold px-4 py-3 md:px-1.5 md:py-1 lg:px-4 lg:py-3 text-black rounded-lg shadow-md hover-lift text-sm md:text-[8px] lg:text-base">
                      <Image
                        src={info}
                        alt="Info Icon"
                        width={20}
                        height={30}
                        className="w-6 h-6 md:w-3.5 md:h-3.5 lg:w-6 lg:h-6"
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
      <section className="flex flex-col justify-center items-center md:items-center w-full px-4 md:px-0 lg:mx-4 my-10 lg:my-16">
        <ScaleIn duration={0.7} className="text-center">
          <h2 className="mb-1 text-[28px] sm:text-[42px] lg:text-[48px] font-extrabold leading-tight sm:leading-[120%] text-[#2C2C2C] drop-shadow-sm">
            Give Nourishment, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 animate-gradient-shift">Give Knowledge</span>, Give Hope
          </h2>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium leading-[160%] text-gray-600 mt-4 drop-shadow-sm max-w-2xl mx-auto">
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
