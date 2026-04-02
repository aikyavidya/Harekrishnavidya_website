"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const cardData = [
  {
    id: 1,
    name: "Suresh Reddy",
    location: "Hyderabad",
    text: "I am very happy to support this programme. It gives food, education, and good values to poor children. I feel proud that my small help is making a big change in their lives.",
  },
  {
    id: 2,
    name: "Anita Sharma",
    location: "Mumbai",
    text: "This is a very good cause. The children are learning not only school subjects but also how to be good human beings. I thank the team for giving me a chance to be part of this service.",
  },
  {
    id: 3,
    name: "Rajesh Iyer",
    location: "Bangalore",
    text: "I have seen the work of this programme closely. The kids are well fed, study daily, and learn about moral values. It gives me peace and joy to donate for such a beautiful mission.",
  },
  {
    id: 4,
    name: "Lakshmi Narayanan",
    location: "Coimbatore",
    text: "I donated to this programme because it takes care of children’s food, studies, and values. I feel very happy to see them growing in the right path. This is real service to society.",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevCard = () => {
    setCurrentIndex((prev) => (prev === 0 ? cardData.length - 1 : prev - 1));
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev === cardData.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-md mx-auto text-center px-4 py-10">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1 bg-white rounded-full shadow-2xl mb-4">
        <Sparkles className="w-4 h-4 text-black" />
        <span className="text-2xl font-semibold text-black">Testimonials</span>
      </div>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-black mb-1">
        Your <span className="text-orange-400 italic">Impact</span> in Their{" "}
        <span className="text-black font-bold">Words</span>
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        Real voices. Real change. Hear from those whose lives have been transformed by your kindness.
      </p>

      {/* Testimonial Card */}
      <div className="relative bg-white rounded-3xl px-6 py-6 ">
        {/* Arrows */}
        <button
          onClick={prevCard}
          className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>
        <button
          onClick={nextCard}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </button>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            “{cardData[currentIndex].text}”
          </p>
          <div>
            <p className="text-black font-semibold text-sm">{cardData[currentIndex].name}</p>
            <p className="text-gray-500 text-xs">{cardData[currentIndex].location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
