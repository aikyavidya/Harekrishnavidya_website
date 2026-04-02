"use client";
// import { motion } from "framer-motion";
import Link from "next/link";

import HeroSection from "@/app/components/HeroSection";
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
              <div className="lg:pr-10  text-center lg:text-left">
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
              </div>

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
          <div className=" flex items-center justify-center bg-white py-6">
            <div className="flex flex-col items-center gap-4 w-[523px] text-center text-[--text-dark-charcoal] font-['Urbanist']">
              <p className="bg-[#F7F7F8] rounded-full px-2 py-1  text-2xl lg:text-[36px] font-semibold border-none ">
                ✦ Testimonials
              </p>
              <h1 className="text-2xl lg:text-[40px] font-extrabold leading-[120%]">
                Your <span className="text-[#FF9C5A] italic">Impact</span> in
                Their Words
              </h1>
              <p className="text-[20px] text-[#4F4F4F] leading-[1.5]">
                Real voices. Real change. Hear from those whose lives have{" "}
                <br />
                been transformed by your kindness.
              </p>
            </div>
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
          <div className=" flex items-center justify-center bg-white mt-2">
            <div className="flex flex-col items-center gap-4 w-[523px] text-center text-[--text-dark-charcoal] font-['Urbanist']">
              <h1 className=" text-2xl lg:text-[40px] font-extrabold leading-[120%]">
                A glimpse into the lives you&#39;ve <br />
                touched with your{" "}
                <span className="text-[#FF9C5A] italic">kindness</span>
              </h1>
            </div>
          </div>
        </section>
        <section className="px-4 py-6 bg-white flex justify-center">
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

        {/* <div className="mt-16">
          
        </div> */}
      </section>
    </main>
  );
};

export default HomePage;
