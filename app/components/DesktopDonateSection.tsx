"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Utensils, HeartHandshake } from "lucide-react";
import useUTM from "../utils/useUTM";

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
  bgColor: string;         // Used for Card Container
  containerBgColor: string; // Paragraph box background
  mainBgClass: string;      // Faded background for the whole section
  link: string;
  themeClass: string;
  activeButtonClass: string;
};

/* DONATE-SECTION-STYLE-REVERT: delete this entire block to revert to previous color styling */
const tabs: TabData[] = [
  {
    id: "annadaan",
    title: "Annadaan",
    intro: "No child should have to study on an empty stomach. Through Annadaan, we serve warm, wholesome meals every day.",
    detail: "Bringing not just nourishment, but love, care, and the strength to dream. Every plate we serve carries hope, every meal we provide builds stronger foundations for education, and every child we feed gets one step closer to breaking the cycle of poverty through knowledge and opportunity.",
    icon: <Utensils size={24} />,
    image: fest1,
    bgColor: "#fed7aa", // orange-200
    containerBgColor: "bg-orange-100/50",
    mainBgClass: "lg:bg-orange-50",
    link: "/donation#annadan-seva",
    themeClass: "text-orange-500",
    activeButtonClass: "bg-orange-600 hover:bg-orange-700"
  },
  {
    id: "vidyadaan",
    title: "Vidya Daan",
    intro: "Education is the light that breaks the darkness of poverty. Through free tuition, we give children the chance to learn and thrive.",
    detail: "We provide comprehensive educational support, study materials, and guidance to underprivileged students. Your contribution ensures that financial constraints do not hinder a child's right to quality education and a brighter future.",
    icon: <GraduationCap size={24} />,
    image: edu1,
    bgColor: "#bfdbfe", // blue-200
    containerBgColor: "bg-blue-100/50",
    mainBgClass: "lg:bg-blue-50",
    link: "/donation#vidya-dana-seva",
    themeClass: "text-blue-500",
    activeButtonClass: "bg-blue-600 hover:bg-blue-700"
  },
  {
    id: "generalseva",
    title: "General Seva",
    intro: "Support our mission to provide food, education, and care to those in need. Your contribution brings hope and changes lives.",
    detail: "General Seva encompasses various initiatives including temple maintenance, community welfare, and emergency relief programs. By supporting General Seva, you enable us to direct resources where they are needed most urgently, ensuring sustainable and impactful service to society.",
    icon: <HeartHandshake size={24} />,
    image: value,
    bgColor: "#bbf7d0", // green-200
    containerBgColor: "bg-green-100/50",
    mainBgClass: "lg:bg-green-50",
    link: "/donation#sponsor-a-child",
    themeClass: "text-green-500",
    activeButtonClass: "bg-green-600 hover:bg-green-700"
  }
];

export default function DesktopDonateSection() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const { appendUTMToUrl, handleDonateClick } = useUTM();

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <motion.div 
      className={`hidden lg:block w-full rounded-2xl p-12 relative overflow-hidden transition-colors duration-500 ${currentTab.mainBgClass}`}
    >
      {/* DONATE-DESKTOP-COLOR-SWAP-REVERT: delete this block to revert desktop color styling */}
      {/* DONATE-SECTION-REVERT: delete this entire block and restore previous 3-card layout to revert */}
      <div className="grid grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
        {/* Left Column (Vertical Nav) */}
        <div className="col-span-5 flex flex-col justify-start pt-4">
          <h2 className="text-[36px] sm:text-[42px] lg:text-[48px] font-extrabold text-[#2C2C2C] drop-shadow-sm leading-tight mb-4">
            Donate for the Noble <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 animate-gradient-shift">Cause</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-base pr-4">
            Support our mission to provide food, education, and care to those in need. Your contribution brings hope and changes lives.
          </p>

          <div className="flex flex-col gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isExpanded = isActive || hoveredTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`text-left cursor-pointer transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? "bg-white rounded-2xl shadow-sm p-6" 
                      : "p-4 opacity-60 hover:opacity-100 hover:bg-white/40 rounded-2xl"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-1">
                    <div className={`transition-colors duration-300 ${isActive ? tab.themeClass : (hoveredTab === tab.id ? 'text-gray-900' : 'text-gray-500')}`}>
                      {tab.icon}
                    </div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${isExpanded ? 'text-gray-900' : 'text-gray-600'}`}>
                      {tab.title}
                    </h3>
                  </div>
                  
                  {/* The active option's brief intro appears inside the selected left-hand box */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-600 text-sm leading-relaxed mt-3"
                      >
                        {tab.intro}
                        
                        <Link href={appendUTMToUrl(tab.link)} onClick={handleDonateClick} className="self-start mt-4 block">
                          <button className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-colors shadow-sm ${isActive ? tab.activeButtonClass : 'bg-gray-900 hover:bg-black'}`}>
                            <span>Donate Now</span>
                            <ArrowUpRight size={18} />
                          </button>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (Dynamic Content) */}
        <div className="col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-3xl flex flex-col items-start shadow-sm"
              style={{ backgroundColor: currentTab.bgColor }}
            >
              {/* Image Frame with white padding */}
              <div className="bg-white p-3 rounded-2xl w-full mb-6 shadow-sm">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
                  <Image 
                    src={currentTab.image} 
                    alt={currentTab.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>

              {/* Detailed paragraph content directly below the image frame */}
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {currentTab.detail}
              </p>

              {/* Action Button moved to left column */}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
