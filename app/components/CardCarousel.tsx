"use client";

import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type Card = {
  id: number | string;
  name: string;
  location: string;
  text: string;
  avatar?: string;
};

type TestimonialSectionProps = {
  cardData: Card[];
};

export default function TestimonialSection({
  cardData 
}: TestimonialSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update scroll button states
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Handle scroll
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) {
      console.log('Scroll container not found');
      return;
    }
    
    const cardWidth = 280; // Approximate card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    
    console.log(`Scrolling ${direction}, amount: ${scrollAmount}`);
    console.log('Current scroll position:', scrollContainerRef.current.scrollLeft);
    
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Update button states after a small delay to account for smooth scrolling
    setTimeout(() => {
      updateScrollButtons();
      console.log('Updated scroll buttons after scroll');
    }, 100);
  };

  // Update button states on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScrollEvent = () => updateScrollButtons();
    container.addEventListener('scroll', handleScrollEvent);
    
    // Initial check
    updateScrollButtons();
    
    return () => container.removeEventListener('scroll', handleScrollEvent);
  }, []);

  return (
    <section className="relative bg-[#f0f2f8] py-10 lg:py-16 px-6 overflow-hidden max-w-6xl mx-auto">
      <div className="relative">
        {/* Mobile scroll arrows */}
        {isMobile && (
          <>
            <button
              onClick={() => {
                //console.log('Left button clicked');
                handleScroll('left');
              }}
              disabled={!canScrollLeft}
              className={`absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                canScrollLeft 
                  ? 'opacity-100 hover:bg-gray-50 hover:shadow-xl active:scale-95' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <button
              onClick={() => {
              //  console.log('Right button clicked');
                handleScroll('right');
              }}
              disabled={!canScrollRight}
              className={`absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                canScrollRight 
                  ? 'opacity-100 hover:bg-gray-50 hover:shadow-xl active:scale-95' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Grid container */}
        <div 
          ref={scrollContainerRef}
          className={`
            ${isMobile 
              ? 'flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-3' 
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            }
          `}
          style={isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
        >
          {cardData.map((card, index) => (
            <div
              key={index}
              className={`
                bg-white rounded-2xl hover:shadow-2xl transition-shadow p-6 relative
                ${isMobile ? 'flex-none w-74' : ''}
              `}
            >
              <div className="text-6xl text-orange-400 font-serif">&quot;</div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {card?.text}
              </p>
              <div className="flex items-center gap-3">
                {card?.avatar && (
                  <img
                    src={card.avatar}
                    alt={card.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-100 shadow-sm"
                  />
                )}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                    {card?.name}
                  </h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {card?.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-3 lg:top-10 right-8 lg:right-8 w-6 h-6 bg-orange-400 rounded-tr-full"></div>
      <div className="md:hidden lg:absolute bottom-22 lg:bottom-20 left-12 w-8 h-8 bg-blue-900 rounded-bl-full"></div>
      <div className="absolute  bottom-25 lg:bottom-16 right-4 lg:right-2 flex flex-col gap-2">
        <div className="w-4 h-4 bg-blue-900 rounded-full"></div>
        <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
        <div className="w-4 h-4 bg-blue-900 rounded-full"></div>
      </div>
      <div className="absolute top-20 left-1/4 w-3 h-3 bg-orange-400 rounded-full"></div>
      <div className="hidden lg:absolute bottom-36 right-1/3 w-5 h-5 bg-blue-900 rounded-full"></div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}