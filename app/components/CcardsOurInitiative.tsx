// components/ServicesSection.tsx
"use client";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild
        ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 24
        : 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#EEF1EC] mx-auto max-w-7xl relative overflow-hidden">
      {/* Top banner */}
      <div className="relative  px-6">
        <div className="relative h-[280px] md:h-[340px] w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/image-150.png"
            alt="Rehab background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#002A42]/60" />

          <div className="absolute -top-1/3 inset-0 flex flex-col items-center justify-center text-center text-white">
            <h2 className=" text-2xl md:text-4xl font-semibold">
              Where Spirituality Meets Practical Skills
            </h2>
          </div>
        </div>
      </div>

      {/* Cards with scroll + arrows */}
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Arrows */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="-mt-16 md:-mt-24 flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollSnapType: "x mandatory",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {/* Card 1 */}
          <article className="bg-white rounded-[40px] pt-10 pb-8 px-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex-shrink-0 w-[calc(33.333%-16px)] min-w-[280px] md:min-w-[320px] scroll-snap-align-start">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full  bg-blue-100 shadow ring-8 ring-white/80">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                className="text-4xl text-orange-700"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M263.375 19.375c-11.768 0-22.676 6.137-31.156 17.22-7.267 9.494-12.397 22.54-13.72 37.25 11.14-4.926 22.473-7.91 33.813-9V83.25c-10.965 1.377-22.008 5.008-33.157 11.03 1.968 12.487 6.703 23.502 13.063 31.814 8.48 11.082 19.387 17.22 31.155 17.22s22.707-6.138 31.188-17.22c6.167-8.06 10.783-18.667 12.843-30.688-12.07-6.832-24.194-10.997-36.406-12.344V64.75c12.676 1.087 25.22 4.516 37.344 10.188-1.155-15.158-6.336-28.614-13.78-38.344-8.482-11.082-19.42-17.22-31.19-17.22zm-46.594 117.25c-10.442 4.8-18.39 11.182-22.593 18.47l-.375-.095-41.625 64.438-50.656-21.97c-29.375-16.118-61.574 24-30.624 41.688l94.47 44.063 38.03-50.064c18.7 33.703 16.77 67.43-10.97 101.156-8.344-.642-16.37-.958-23.967-.906-40.312.278-68.942 10.254-73.907 28.78l.03.002c-4.44 16.58 10.992 36.67 39.126 55.28 55.675 29.297 95.38 38.468 156.968 42.344h1.562l.438.125c.424.026.823.07 1.25.094l-.032.314 92.063 28.72-22.19-53.72L183.595 375.5l5.875-17.72 71.81 23.845 71.845-23.844L339 375.5l-48.094 15.97 94.438 31.374c33.494-20.046 52.528-42.468 47.656-60.656-5.95-22.21-45.925-32.107-99.25-27.782-26.392-33.215-26.196-66.41-9.53-99.625L361 283.22l94.47-44.064c30.95-17.687-1.25-57.806-30.626-41.687l-50.688 21.968L332.562 155h-.062c-4.217-7.246-12.135-13.596-22.53-18.375-.2.27-.392.547-.595.813-11.268 14.725-27.633 24.562-46 24.562s-34.732-9.837-46-24.563c-.203-.265-.394-.543-.594-.812zm-63.686 311l-16.72 40.5 69.876-21.78c-17.624-4.574-34.93-10.634-53.156-18.72z"></path>
              </svg>
            </div>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-[#1C2320]">
              Spiritual Education
            </h3>
            <ul className="text-gray-600 mt-6 text-sm space-y-1 ">
              <li>Yoga & Meditation</li>
              <li>Prayers</li>
              <li>Bhagavad Gita</li>
            </ul>
          </article>

          {/* Card 2 */}
          <article className="bg-white rounded-[40px] pt-10 pb-8 px-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex-shrink-0 w-[calc(33.333%-16px)] min-w-[280px] md:min-w-[320px] scroll-snap-align-start">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100  shadow ring-8 ring-white/80">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 640 512"
                className="text-4xl text-orange-700"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M206.86 245.15c-35.88 10.45-59.95 41.2-57.53 74.1 11.4-12.72 28.81-23.7 49.9-30.92l7.63-43.18zM95.81 295L64.08 115.49c-.29-1.62.28-2.62.24-2.65 57.76-32.06 123.12-49.01 189.01-49.01 1.61 0 3.23.17 4.85.19 13.95-13.47 31.73-22.83 51.59-26 18.89-3.02 38.05-4.55 57.18-5.32-9.99-13.95-24.48-24.23-41.77-27C301.27 1.89 277.24 0 253.32 0 176.66 0 101.02 19.42 33.2 57.06 9.03 70.48-3.92 98.48 1.05 126.58l31.73 179.51c14.23 80.52 136.33 142.08 204.45 142.08 3.59 0 6.75-.46 10.01-.8-13.52-17.08-28.94-40.48-39.5-67.58-47.61-12.98-106.06-51.62-111.93-84.79zm97.55-137.46c-.73-4.12-2.23-7.87-4.07-11.4-8.25 8.91-20.67 15.75-35.32 18.32-14.65 2.58-28.67.4-39.48-5.17-.52 3.94-.64 7.98.09 12.1 3.84 21.7 24.58 36.19 46.34 32.37 21.75-3.82 36.28-24.52 32.44-46.22zM606.8 120.9c-88.98-49.38-191.43-67.41-291.98-51.35-27.31 4.36-49.08 26.26-54.04 54.36l-31.73 179.51c-15.39 87.05 95.28 196.27 158.31 207.35 63.03 11.09 204.47-53.79 219.86-140.84l31.73-179.51c4.97-28.11-7.98-56.11-32.15-69.52zm-273.24 96.8c3.84-21.7 24.58-36.19 46.34-32.36 21.76 3.83 36.28 24.52 32.45 46.22-.73 4.12-2.23 7.87-4.07 11.4-8.25-8.91-20.67-15.75-35.32-18.32-14.65-2.58-28.67-.4-39.48 5.17-.53-3.95-.65-7.99.08-12.11zm70.47 198.76c-55.68-9.79-93.52-59.27-89.04-112.9 20.6 25.54 56.21 46.17 99.49 53.78 43.28 7.61 83.82.37 111.93-16.6-14.18 51.94-66.71 85.51-122.38 75.72zm130.3-151.34c-8.25-8.91-20.68-15.75-35.33-18.32-14.65-2.58-28.67-.4-39.48 5.17-.52-3.94-.64-7.98.09-12.1 3.84-21.7 24.58-36.19 46.34-32.37 21.75 3.83 36.28 24.52 32.45 46.22-.73 4.13-2.23 7.88-4.07 11.4z"></path>
              </svg>
            </div>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-[#1C2320]">
              Arts
            </h3>
            <ul className="text-gray-600 mt-2 text-sm space-y-1">
              <li>Singing</li>
              <li>Dancing</li>
              <li>Music Instruments</li>
            </ul>
          </article>

          {/* Card 3 */}
          <article className="bg-white rounded-[40px] pt-10 pb-8 px-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex-shrink-0 w-[calc(33.333%-16px)] min-w-[280px] md:min-w-[320px] scroll-snap-align-start">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow ring-8 ring-white/80">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 640 512"
                className="text-4xl text-orange-700"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M208 352c-2.39 0-4.78.35-7.06 1.09C187.98 357.3 174.35 360 160 360c-14.35 0-27.98-2.7-40.95-6.91-2.28-.74-4.66-1.09-7.05-1.09C49.94 352-.33 402.48 0 464.62.14 490.88 21.73 512 48 512h224c26.27 0 47.86-21.12 48-47.38.33-62.14-49.94-112.62-112-112.62zm-48-32c53.02 0 96-42.98 96-96s-42.98-96-96-96-96 42.98-96 96 42.98 96 96 96zM592 0H208c-26.47 0-48 22.25-48 49.59V96c23.42 0 45.1 6.78 64 17.8V64h352v288h-64v-64H384v64h-76.24c19.1 16.69 33.12 38.73 39.69 64H592c26.47 0 48-22.25 48-49.59V49.59C640 22.25 618.47 0 592 0z"></path>
              </svg>
            </div>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-[#1C2320]">
              Leadership
            </h3>
            <ul className="text-gray-600 mt-2 text-sm space-y-1">
              <li>Public Speaking</li>
              <li>Event Management</li>
              <li>Financial Management</li>
            </ul>
          </article>

          {/* Card 4 */}
          <article className="bg-white rounded-[40px] pt-10 pb-8 px-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex-shrink-0 w-[calc(33.333%-16px)] min-w-[280px] md:min-w-[320px] scroll-snap-align-start">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow ring-8 ring-white/80">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                className="text-4xl text-orange-700"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M320.2 243.8l-49.7 99.4c-6 12.1-23.4 11.7-28.9-.6l-56.9-126.3-30 71.7H60.6l182.5 186.5c7.1 7.3 18.6 7.3 25.7 0L451.4 288H342.3l-22.1-44.2zM473.7 73.9l-2.4-2.5c-51.5-52.6-135.8-52.6-187.4 0L256 100l-27.9-28.5c-51.5-52.7-135.9-52.7-187.4 0l-2.4 2.4C-10.4 123.7-12.5 203 31 256h102.4l35.9-86.2c5.4-12.9 23.6-13.2 29.4-.4l58.2 129.3 49-97.9c5.9-11.8 22.7-11.8 28.6 0l27.6 55.2H481c43.5-53 41.4-132.3-7.3-182.1z"></path>
              </svg>
            </div>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-[#1C2320]">
              Health & Hygiene
            </h3>
            <ul className="text-gray-600 mt-2 text-sm space-y-1">
              <li>Healthcare</li>
              <li>Basic Hygiene</li>
              <li>Cleanliness</li>
            </ul>
          </article>

          {/* Card 5 */}
          <article className="bg-white rounded-[40px] pt-10 pb-8 px-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex-shrink-0 w-[calc(33.333%-16px)] min-w-[280px] md:min-w-[320px] scroll-snap-align-start">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow ring-8 ring-white/80">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 384 512"
                className="text-4xl text-orange-700"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M378.31 378.49L298.42 288h30.63c9.01 0 16.98-5 20.78-13.06 3.8-8.04 2.55-17.26-3.28-24.05L268.42 160h28.89c9.1 0 17.3-5.35 20.86-13.61 3.52-8.13 1.86-17.59-4.24-24.08L203.66 4.83c-6.03-6.45-17.28-6.45-23.32 0L70.06 122.31c-6.1 6.49-7.75 15.95-4.24 24.08C69.38 154.65 77.59 160 86.69 160h28.89l-78.14 90.91c-5.81 6.78-7.06 15.99-3.27 24.04C37.97 283 45.93 288 54.95 288h30.63L5.69 378.49c-6 6.79-7.36 16.09-3.56 24.26 3.75 8.05 12 13.25 21.01 13.25H160v24.45l-30.29 48.4c-5.32 10.64 2.42 23.16 14.31 23.16h95.96c11.89 0 19.63-12.52 14.31-23.16L224 440.45V416h136.86c9.01 0 17.26-5.2 21.01-13.25 3.8-8.17 2.44-17.47-3.56-24.26z"></path>
              </svg>{" "}
            </div>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-[#1C2320]">
              Base
            </h3>
            <ul className="text-gray-600 mt-2 text-sm space-y-1">
              <li>Kitchen Gardening</li>
              <li>Promoting Horticulture</li>
              <li>Waste Management</li>
            </ul>
          </article>
        </div>

        <div className="h-16 md:h-20" />
      </div>
    </section>
  );
}
