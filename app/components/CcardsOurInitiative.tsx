"use client";
{/* COVERFLOW CAROUSEL - REMOVABLE:
    To revert: remove swiper imports, remove swiper package,
    restore original flex grid with 5 cards,
    restore original cardStyle variable */}
{/* COVERFLOW-ARROWS-REVERT: delete this entire block to revert to previous state (dots inside card, no arrows) */}
import { useRef, useState, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { FadeInOnScroll } from "./AnimationProvider";
import { Flower2, Music, Users, Heart, Leaf, ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export default function ServicesSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  const cards = [
    {
      id: 1,
      title: "Spiritual Education",
      icon: Flower2,
      image: "/images/b2.jpg",
      objectPosition: "center center",
      items: ["Yoga & Meditation", "Prayers", "Bhagavad Gita"]
    },
    {
      id: 2,
      title: "Arts",
      icon: Music,
      image: "/GalleryImages/Culture/fest%20(18).jpg",
      objectPosition: "center center",
      items: ["Singing", "Dancing", "Music Instruments"]
    },
    {
      id: 3,
      title: "Leadership",
      icon: Users,
      image: "/images/Leadership.JPG",
      objectPosition: "center center",
      items: ["Public Speaking", "Event Management", "Financial Management"]
    },
    {
      id: 4,
      title: "Health & Hygiene",
      icon: Heart,
      image: "/images/4181f04c-91d0-4f60-953d-40a728b9aede.jpg",
      objectPosition: "center center",
      items: ["Healthcare", "Basic Hygiene", "Cleanliness"]
    },
    {
      id: 5,
      title: "Base",
      icon: Leaf,
      image: "/images/Base-Kitchen-Gardening.png",
      objectPosition: "center top",
      items: ["Kitchen Gardening", "Promoting Horticulture", "Waste Management"]
    }
  ];

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    // Initialize on mount
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="bg-transparent w-full py-16 px-4 md:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto w-full relative">
        <FadeInOnScroll>
          <div className="text-center mb-10">
            <h2 className="text-[36px] sm:text-[42px] lg:text-[48px] font-extrabold leading-tight text-[#2C2C2C] drop-shadow-sm">
              Where Spirituality Meets Practical Skills
            </h2>
          </div>

          <div className="w-full flex flex-col justify-center items-center overflow-hidden coverflow-carousel">
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: true,
              }}
              breakpoints={{
                320:  { slidesPerView: 1.2 },
                640:  { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 3 },
              }}
              pagination={
                isDesktop
                  ? { clickable: true, el: '.desktop-pagination-container' }
                  : { clickable: true }
              }
              modules={[EffectCoverflow, Pagination]}
              className="w-full py-12"
            >
              {cards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <SwiperSlide key={card.id}>
                    <div className="relative rounded-3xl overflow-hidden h-[420px] lg:h-[480px] shadow-2xl">
                      {/* Background image - full card */}
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" style={{ objectPosition: card.objectPosition }} />

                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Content overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-left">
                        {/* Icon circle */}
                        <div className="flex justify-center mb-4">
                          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center shadow-inner">
                            <IconComponent className="w-10 h-10 text-orange-600" />
                          </div>
                        </div>
                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                        {/* List items */}
                        <ul className="text-sm text-white/80 space-y-1">
                          {card.items.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}

              {/* DESKTOP ONLY: Controls row below carousel */}
              <div className="hidden lg:flex flex-row items-center justify-center gap-6 mt-6 w-full z-10">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 text-gray-700 pointer-events-auto"
                  aria-label="Previous slide"
                >
                  <ArrowLeft size={18} />
                </button>

                {/* DESKTOP ONLY: Pagination inside the row */}
                <div className="desktop-pagination-container pointer-events-auto" />

                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 text-gray-700 pointer-events-auto"
                  aria-label="Next slide"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </Swiper>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
