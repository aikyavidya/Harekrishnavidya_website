"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import HeroSection from "@/app/components/HeroSection";
import { SlideIn, ScaleIn, StaggerContainer, StaggerItem } from "../components/AnimationProvider";
import Image from "next/image";
import React, { useState, useEffect } from "react";
//import isk2 from "../public/images/isk2c.png";
//import image150 from "../public/images/image-150.png";
//import image160 from "../public/images/image-160.png";
//import image170 from "../public/images/image-170.png";
//import ik from "../public/images/ik.png";
import edu1 from "../../public/galleryection/edu1.jpg";
import fest1 from "../../public/galleryection/fest1.jpg";
import value from "../../public/galleryection/val1.jpg";
import yoga1 from "../../public/galleryection/yoga.jpg";
import edu2 from "../../public/galleryection/edu2.jpg";
import fest2 from "../../public/galleryection/fest2.jpg";
import cul1 from "../../public/galleryection/cul1.jpg";
import edu3 from "../../public/galleryection/edu3.jpg";

//import MobileTestimonial from "../app/components/MobileTestimonial";

import CardCarousel from "../components/CardCarousel";
import CausesSection from "../components/CauseSection";
import useUTM from "../utils/useUTM";

const TESTIMONIALS_API = "https://api.harekrishnavidya.org/api/testimonials/";

type ApiTestimonial = {
  _id: string;
  fullName: string;
  location?: string;
  testimonialText: string;
  photo?: string;
};

type CardData = {
  id: string | number;
  name: string;
  location: string;
  text: string;
  avatar?: string;
};

const HomePage = () => {
  const { appendUTMToUrl } = useUTM();
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(TESTIMONIALS_API);
        const data: ApiTestimonial[] = await res.json();
        const mapped: CardData[] = (Array.isArray(data) ? data : []).map(
          (t) => ({
            id: t._id,
            name: t.fullName || "",
            location: t.location || "",
            text: t.testimonialText || "",
            avatar: t.photo ? `https://api.harekrishnavidya.org/uploads/testimonials/${t.photo}` : undefined,
          })
        );
        setCardData(mapped);
      } catch {
        setCardData([]);
      } finally {
        setTestimonialsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

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

  return (
    <main className="bg-white max-w-7xl mx-auto text-gray-800">
      <HeroSection />

      <section className="py-1 px-4 md:px-10 lg:px-10">
        {/* ---------------------------denation form-------------------  */}
        <section className="max-w-6xl mx-auto">
          <div className=" bg-blue-50 rounded-lg shadow-sm p-2 lg:p-16 relative overflow-hidden">
            {/* Decorative small star / scribble at top center */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:items-center item-start sm:item-center  px-4 sm:px-6 md:px-8">
              {/* Left content */}
              <SlideIn direction="left" duration={0.8} className="lg:pr-10 text-center lg:text-left">
                <h2 className="text-3xl sm:text-5xl md:text-5xl font-extrabold text-[#07133a] leading-tight mb-4 sm:mb-6">
                  Donate for cause
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-sm md:text-start w-[300px] sm:w-[500px] sm:text-base">
                  Support our mission to provide food, education, and care to
                  those  <br />in need. Your contribution brings hope and changes lives
                </p>

                <Link href={appendUTMToUrl("/donation")}>
                  <button
                    aria-label="View More"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-medium shadow-md bg-[#1C398E] hover:bg-[#fb923c] hover:scale-[1.01] transition-transform cursor-pointer"
                  >
                    Donate now
                  </button>
                </Link>
              </SlideIn>

              {/* Right testimonial stack */}
              <CausesSection className="my-4 sm:my-1 px-2 sm:px-4" />
            </div>
          </div>
        </section>
        {/* ---------------------------phn -------------------  */}
        <section
          style={{
            display: "flex",
            width: "1100px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            margin: "0 auto",
          }}
        >
          {/* <Image
            src={pic2}
            alt="Donation Journey Layout"
            width={1337}
            height={768}
            style={{ borderRadius: "40px", width: "100%", height: "auto" }}
          /> */}
        </section>
        {/* ------------------------impact------------------ */}

        <section className="py-6 px-4 md:px-10 lg:px-20">
          <div className="flex items-center justify-center bg-white py-6">
            <ScaleIn className="flex flex-col items-center gap-4 w-[523px] text-center text-[--text-dark-charcoal] font-['Urbanist']">
              <p className="bg-[#F7F7F8] rounded-full px-2 py-1 text-2xl lg:text-[36px] font-semibold border-none hover-lift cursor-default inline-block">
                ✦ Testimonials
              </p>
              <h1 className="text-2xl lg:text-[40px] font-extrabold leading-[120%]">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 italic animate-gradient-shift">Impact</span> in
                Their Words
              </h1>
              <p className="text-[20px] text-[#4F4F4F] leading-[1.5]">
                Real voices. Real change. Hear from those whose lives have{" "}
                <br />
                been transformed by your kindness.
              </p>
            </ScaleIn>
          </div>
        </section>

        {/* ------------------------------------------------------- */}
        {/* <div className="block xl:hidden">
          <MobileTestimonial />
        </div> */}

        {/* {desktop testimonials} */}
        {testimonialsLoading ? (
          <section className="relative bg-[#f0f2f8] py-10 lg:py-16 px-6 overflow-hidden max-w-6xl mx-auto">
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="w-12 h-12 border-t-2 border-b-2 border-[#1C398E] rounded-full animate-spin" />
            </div>
          </section>
        ) : (
          <CardCarousel cardData={cardData} />
        )}

        {/* -------------------gallery------------------------ */}
        <section className="mt-5 px-4 md:px-10 lg:px-20">
          <div className="flex items-center justify-center bg-white mt-2">
            <ScaleIn className="flex flex-col items-center gap-4 w-[523px] text-center text-[--text-dark-charcoal] font-['Urbanist']">
              <h1 className="text-2xl lg:text-[40px] font-extrabold leading-[120%]">
                A glimpse into the lives you&#39;ve <br />
                touched with your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 italic animate-gradient-shift">kindness</span>
              </h1>
            </ScaleIn>
          </div>
        </section>
        <section className="px-4 py-6 bg-white flex justify-center pb-20">
          <div className="max-w-6xl w-full text-center">
            {/* Grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((item, index) => (
                <StaggerItem
                  key={index}
                  className="relative group overflow-hidden rounded-md cursor-pointer aspect-square"
                >
                  <div className="w-full h-full relative" onClick={() => setSelectedImage(item.src.src)}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Hover overlay with icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white transform scale-50 group-hover:scale-100 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                       </svg>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* --- Lightbox Modal --- */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lightbox-overlay"
              onClick={() => setSelectedImage(null)}
            >
              <div className="absolute top-4 right-4 text-white hover:text-orange-400 cursor-pointer p-2 z-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-5xl max-h-[90vh] w-[90%] h-[90%] m-4 bg-black rounded-lg overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={selectedImage}
                    alt="Gallery Full Size"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* <div className="mt-16">
          
        </div> */}
      </section>
    </main>
  );
};

export default HomePage;
