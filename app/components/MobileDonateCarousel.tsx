"use client";
import React, { useRef, useState, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight, GraduationCap, Utensils, HeartHandshake } from "lucide-react";
import useUTM from "../utils/useUTM";
import { useLanguage } from "./LanguageProvider";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import edu1 from "../../public/galleryection/edu1.jpg";
import fest1 from "../../public/galleryection/fest1.jpg";
import value from "../../public/GalleryImages/Values/value15.jpg";

type TabData = {
  id: string;
  title: string;
  intro: string;
  detail: string;
  icon: React.ReactNode;
  image: StaticImageData;
  imagePosition?: string;
  bgColor: string;         // Main section background
  containerBgColor: string; // Right column container background
  link: string;
  themeClass: string;
};

/* DONATE-SECTION-STYLE-REVERT: delete this entire block to revert to previous color styling */
const tabs: TabData[] = [
  {
    id: "annadaan",
    title: "Annadaan",
    intro: "No child should have to study on an empty stomach. Through Annadaan, we serve warm, wholesome meals every day.",
    detail: "Bringing not just nourishment, but love, care, and the strength to dream. Every plate we serve carries hope, every meal we provide builds stronger foundations for education, and every child we feed gets one step closer to breaking the cycle of poverty through knowledge and opportunity.",
    icon: <Utensils size={20} />,
    image: fest1,
    bgColor: "#fed7aa", // orange-200
    containerBgColor: "bg-orange-100/50",
    link: "/donation#annadan-seva",
    themeClass: "text-orange-500"
  },
  {
    id: "vidyadaan",
    title: "Vidya Daan",
    intro: "Education is the light that breaks the darkness of poverty. Through free tuition, we give children the chance to learn and thrive.",
    detail: "We provide comprehensive educational support, study materials, and guidance to underprivileged students. Your contribution ensures that financial constraints do not hinder a child's right to quality education and a brighter future.",
    icon: <GraduationCap size={20} />,
    image: edu1,
    bgColor: "#bfdbfe", // blue-200
    containerBgColor: "bg-blue-100/50",
    link: "/donation#vidya-dana-seva",
    themeClass: "text-blue-500"
  },
  {
    id: "generalseva",
    title: "General Seva",
    intro: "Support our mission to provide food, education, and care to those in need. Your contribution brings hope and changes lives.",
    detail: "General Seva encompasses various initiatives including temple maintenance, community welfare, and emergency relief programs. By supporting General Seva, you enable us to direct resources where they are needed most urgently, ensuring sustainable and impactful service to society.",
    icon: <HeartHandshake size={20} />,
    image: value,
    bgColor: "#bbf7d0", // green-200
    containerBgColor: "bg-green-100/50",
    link: "/donation#sponsor-a-child",
    themeClass: "text-green-500"
  }
];

export default function MobileDonateCarousel() {
  const { appendUTMToUrl, handleDonateClick } = useUTM();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const { t } = useLanguage();

  const localizedTabs = tabs.map(tab => {
    if (tab.id === "annadaan") return { ...tab, title: t("donate.tabs.annadaan.title"), intro: t("donate.tabs.annadaan.shortDesc"), detail: t("donate.tabs.annadaan.longDesc") };
    if (tab.id === "vidyadaan") return { ...tab, title: t("donate.tabs.vidyaDaan.title"), intro: t("donate.tabs.vidyaDaan.shortDesc"), detail: t("donate.tabs.vidyaDaan.longDesc") };
    if (tab.id === "generalseva") return { ...tab, title: t("donate.tabs.generalSeva.title"), intro: t("donate.subheading"), detail: t("donate.tabs.generalSeva.desc") };
    return tab;
  });

  const handleNext = useCallback(() => {
    if (swiperRef.current) swiperRef.current.slideNext();
  }, []);

  const handlePrev = useCallback(() => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  }, []);

  return (
    <div className="lg:hidden w-full relative overflow-hidden py-6">
      {/* DONATE-MOBILE-REVERT: delete this entire block to revert to previous mobile layout */}
      
      {/* Header */}
      <div className="px-4 sm:px-6 mb-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#2C2C2C] drop-shadow-sm leading-tight mb-3">
          {t("donate.headingLine1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 animate-gradient-shift">{t("donate.headingLine2")}</span>
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-[400px]">
          {t("donate.subheading")}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="w-full pl-4 sm:pl-6 overflow-visible">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1.15}
          spaceBetween={16}
          breakpoints={{
            768: {
              slidesPerView: 1.25,
              spaceBetween: 24,
            },
            1024: {
              spaceBetween: 32,
            }
          }}
          loop={true}
          grabCursor={true}
          touchMoveStopPropagation={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full overflow-visible"
        >
          {localizedTabs.map((tab, idx) => (
            <SwiperSlide key={`${tab.id}-${idx}`} className="h-auto flex flex-col pb-2">
              <div className="w-full flex flex-col h-full gap-4 shrink-0">
                
                {/* Image Card (Top) */}
                <div
                  className="w-full rounded-[2rem] p-3 sm:p-4 flex flex-col shadow-sm"
                  style={{ backgroundColor: tab.bgColor }}
                >
                  {/* Image Frame with white padding */}
                  <div className="bg-white p-2 rounded-[1.5rem] w-full mb-4 shadow-sm relative aspect-[16/10] overflow-hidden shrink-0">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={tab.image}
                        alt={tab.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <Link href={appendUTMToUrl(tab.link)} onClick={handleDonateClick} className="self-end shrink-0 mb-1">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0279BC] text-white rounded-lg text-sm font-medium hover:bg-[#026299] shadow-sm">
                      <span>{t("nav.donateNow")}</span>
                      <ArrowUpRight size={16} />
                    </button>
                  </Link>
                </div>

                {/* Content Box (Bottom) */}
                <div className={`p-4 sm:p-5 rounded-2xl ${tab.containerBgColor} flex flex-col flex-1 shadow-sm`}>
                  <div className="flex items-center gap-3 mb-3 shrink-0">
                    <div className={tab.themeClass}>
                      {tab.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {tab.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-800 text-sm font-medium leading-relaxed mb-3 shrink-0">
                    {tab.intro}
                  </p>
                  
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    {tab.detail}
                  </p>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-6 px-4">
        <button 
          onClick={handlePrev} 
          className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 text-gray-700"
          aria-label={t("donate.prevSlide")}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {localizedTabs.map((_, idx) => (
            <button
              key={idx}
              onClick={() => swiperRef.current?.slideToLoop(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-4 bg-gray-800" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext} 
          className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 text-gray-700"
          aria-label={t("donate.nextSlide")}
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
