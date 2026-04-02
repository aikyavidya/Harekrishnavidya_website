"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";

// Import your images here (keeping your imports from your current code)
import fest1 from "../../public/GalleryImages/Culture/fest (5).jpg";
import fest2 from "../../public/GalleryImages/Culture/fest (25).jpg";
import fest3 from "../../public/GalleryImages/Culture/fest (7).jpg";
import fest4 from "../../public/GalleryImages/Culture/fest (2).jpg";
import fest5 from "../../public/GalleryImages/Culture/fest (12).jpg";
import fest6 from "../../public/GalleryImages/Culture/fest (2).jpg";
import fest7 from "../../public/GalleryImages/Culture/fest (15).jpg";
import fest8 from "../../public/GalleryImages/Culture/fest (16).jpg";
import fest9 from "../../public/GalleryImages/Culture/fest (5).jpg";


import edu2 from "../../public/GalleryImages/Education/edu02.jpg";
import edu3 from "../../public/GalleryImages/Education/edu10.jpg";
import edu4 from "../../public/GalleryImages/Education/edu14.jpg";
import edu5 from "../../public/GalleryImages/Education/edu18.jpg";
import edu6 from "../../public/GalleryImages/Education/edu06.jpg";
import edu7 from "../../public/GalleryImages/Education/edu07.jpg";
import edu8 from "../../public/GalleryImages/Education/edu08.jpg";
import edu9 from "../../public/GalleryImages/Education/edu09.jpg";
import edu25 from "../../public/GalleryImages/Education/edu24.jpg";


import food01 from "../../public/GalleryImages/Food/food13.jpg";
import food02 from "../../public/GalleryImages/Food/food02.jpg";
import food03 from "../../public/GalleryImages/Food/food03.jpg";
import food04 from "../../public/GalleryImages/Food/food18.jpg";
import food05 from "../../public/GalleryImages/Food/food05.jpg";
import food06 from "../../public/GalleryImages/Food/food06.jpg";
import food07 from "../../public/GalleryImages/Food/food12.jpg";
import food08 from "../../public/GalleryImages/Food/food08.jpg";
import food09 from "../../public/GalleryImages/Food/food16.jpg";


import value1 from "../../public/GalleryImages/Values/value (1).jpg";
import value2 from "../../public/GalleryImages/Values/value (2).jpg";
import value3 from "../../public/GalleryImages/Values/value (3).jpg";
import value4 from "../../public/GalleryImages/Values/value (4).jpg";
import value5 from "../../public/GalleryImages/Values/value (5).jpg";
import value6 from "../../public/GalleryImages/Values/value15.jpg";
import value7 from "../../public/GalleryImages/Values/value (7).jpg";
import value8 from "../../public/GalleryImages/Values/value (8).jpg";
import value9 from "../../public/GalleryImages/Values/value (5).jpg";

// Type definitions
interface GalleryItem {
  src: StaticImageData;
  title?: string;
  alt?: string;
  width: number;
  height: number;
}

interface MasonryImageProps {
  item: GalleryItem;
  index: number;
}

// Your image arrays
const food: GalleryItem[] = [
  { src: food01, alt: "Food 1", width: 400, height: 260 },
  { src: food02, alt: "Food 2", width: 400, height: 260 },
  { src: food03, alt: "Food 3", width: 400, height: 263 },
  { src: food04, alt: "Food 4", width: 400, height: 267 },
  { src: food05, alt: "Food 3", width: 400, height: 263 },
  { src: food06, alt: "Food 4", width: 400, height: 265 },
  { src: food07, alt: "Food 3", width: 400, height: 260 },
  { src: food08, alt: "Food 4", width: 400, height: 260 },
  { src: food09, alt: "Food 4", width: 400, height: 267 },
];

const education: GalleryItem[] = [
  { src: edu2, alt: "edu 2", width: 400, height: 267 },
  { src: edu3, alt: "edu 3", width: 400, height: 268 },
  { src: edu4, alt: "edu 4", width: 400, height: 268 },
  { src: edu5, alt: "edu 5", width: 400, height: 290 },
  { src: edu6, alt: "edu 4", width: 400, height: 290 },
  { src: edu7, alt: "edu 5", width: 400, height: 290 },
  { src: edu8, alt: "edu 4", width: 400, height: 265 },
  { src: edu9, alt: "edu 5", width: 400, height: 265 },
    { src: edu25, alt: "edu 5", width: 400, height: 268 },
];

const valuesEducation: GalleryItem[] = [
  { src: value1, alt: "Values Education 1", width: 400, height: 267 },
  { src: value2, alt: "Values Education 2", width: 400, height: 267 },
  { src: value3, alt: "Values Education 3", width: 400, height: 267},
  { src: value4, alt: "Values Education 4", width: 400, height: 267 },
  { src: value5, alt: "Values Education 3", width: 400, height: 270 },
  { src: value6, alt: "Values Education 4", width: 400, height: 267 },
  { src: value7, alt: "Values Education 3", width: 400, height: 267},
  { src: value8, alt: "Values Education 4", width: 400, height: 267 },
   { src: value9, alt: "Values Education 4", width: 400, height: 267 },
];

const festivals: GalleryItem[] = [
  { src: fest1, alt: "Gallery 1", width: 400, height: 300 },
  { src: fest2, alt: "Gallery 2", width: 400, height: 300 },
  { src: fest3, alt: "Gallery 3", width: 400, height: 300 },
  { src: fest4, alt: "Gallery 4", width: 400, height: 265 },
  { src: fest5, alt: "Gallery 3", width: 400, height: 265 },
  { src: fest6, alt: "Gallery 4", width: 400, height: 265 },
  { src: fest7, alt: "Gallery 3", width: 400, height: 300 },
  { src: fest8, alt: "Gallery 4", width: 400, height: 300 },
  { src: fest9, alt: "Gallery 4", width: 400, height: 300 },
];

// Masonry Image component
const MasonryImage: React.FC<MasonryImageProps> = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="relative overflow-hidden bg-gray-900 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ease-out rounded-lg"
      style={{ maxWidth: '100%', height: 'auto' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      )}

      <Image
        src={item.src}
        alt={item.alt || ""}
        width={item.width}
        height={item.height}
        className={`w-full h-auto object-cover rounded-lg transition-all duration-300 ease-out ${
          isHovered ? "scale-105" : "scale-100"
        } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImageLoaded(true)}
        priority={index < 6}
      />

      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};



// Tabs with gallery
// Tabs with gallery
const ModernGalleryLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ANNADAN");

  const tabData: Record<string, { images: GalleryItem[]; subtitle: string }> = {
    ANNADAN: {
      images: food,
      subtitle:
        "Nourishing bodies and nurturing souls through community meals, \nfeeding programs, and compassionate food distribution drives.",
    },
    VIDYADAAN: {
      images: education,
      subtitle:
        "Empowering minds and building brighter futures through scholarships, \neducational resources, and lifelong learning initiatives.",
    },
    "VALUES EDUCATION": {
      images: valuesEducation,
      subtitle:
        "Shaping character and inspiring moral excellence through values-based education, \ncultivating empathy, integrity, and ethical leadership.",
    },
    FESTIVALS: {
      images: festivals,
      subtitle:
        "Celebrating traditions and spreading joy with vibrant cultural programs, \nfostering unity and preserving our rich heritage.",
    },
  };

  return (
   <div
  className="min-h-screen py-5"
  style={{
    background: "linear-gradient(to bottom, #002A42 420px, white 160px)",
  }}
>
      <div className=" mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl md:text-5xl text-center text-white font-bold my-5"> Gallery</h2>
        
        {/* Tabs */}
        <div className="flex justify-center mb-4 px-2 sm:px-4">
          
          <div className="bg-white rounded-lg shadow-md p-1 flex flex-nowrap overflow-x-auto w-full my-2  xl:max-w-2xl hide-scrollbar">
            <div className="flex justify-between md:justify-center items-center w-full  gap-1 sm:gap-2 md:gap-3">
              {Object.keys(tabData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-full text-[14px] sm:text-sm md:text-base font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
        </div>


        {/* Dynamic Heading */}
         <div className=" hidden lg:block xl:rounded-lg  m-4 max-w-2xl mx-auto ">
          <p className=" py-3 text-gray-300 text-lg font-bold  px-5  mb-2 ">
            {tabData[activeTab].subtitle}
          </p>
        </div>
        

        {/* Gallery */}
        <div className="grid grid-cols-1  gap-5  ">
          {/* Mobile: Single column with all 8 images */}
          <div className="lg:hidden space-y-4 ">
            <div className="grid grid-cols-1 sm:grid-cols-2   gap-2">
              {tabData[activeTab].images.slice(0, 8).map((item, idx) => (
                <MasonryImage key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>

          {/* Desktop: Two columns with 4 images each */}
          <div className="hidden lg:block space-y-4">
            <div className="grid grid-cols-3 gap-5">
              {tabData[activeTab].images.slice(0, 3).map((item, idx) => (
                <MasonryImage key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>
          <div className="hidden lg:block space-y-4">
            <div className="grid grid-cols-3 gap-5">
              {tabData[activeTab].images.slice(3, 10).map((item, idx) => (
                <MasonryImage key={idx + 4} item={item} index={idx + 4} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernGalleryLayout;
