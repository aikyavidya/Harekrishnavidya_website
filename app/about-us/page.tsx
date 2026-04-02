"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
//import CountUp from "react-countup";
import Link from "next/link";

//import harinamImg from "../../public/images/Harinam.jpg";

import pImg from "../../public/images/p.png";
import iImg from "../../public/images/i.png";
import img9 from "../../public/images/img9.png";


//import StatsCard from "../components/StatsCard";
import edu1 from "../../public/galleryection/edu1.jpg";
import fest1 from "../../public/galleryection/fest1.jpg";
import value from "../../public/galleryection/val1.jpg";
import yoga1 from "../../public/galleryection/yoga.jpg";
import edu2 from "../../public/galleryection/edu2.jpg";
import fest2 from "../../public/galleryection/fest2.jpg";
import cul1 from "../../public/galleryection/cul1.jpg";
import edu3 from "../../public/galleryection/edu3.jpg";

import StatsSection from "../components/StatSection";

// const stats: Stat[] = [
//   {
//     id: 1,
//     icon: <TrendingUp className="w-8 h-8" />,
//     number: "10",
//     label: "Years Of Foundation",
//     color: "from-blue-500 to-blue-600"
//   },
//   {
//     id: 2,
//     icon: <Users className="w-8 h-8" />,
//     number: "5000+",
//     label: "Monthly Donors",
//     color: "from-orange-500 to-orange-600"
//   },
//   {
//     id: 3,
//     icon: <Heart className="w-8 h-8" />,
//     number: "1.5k",
//     label: "Incredible Volunteers",
//     color: "from-blue-600 to-blue-700"
//   },
//   {
//     id: 4,
//     icon: <Award className="w-8 h-8" />,
//     number: "785",
//     label: "Successful Campaigns",
//     color: "from-orange-600 to-orange-700"
//   },
// ];

// Simple counter animation component

export default function Page() {
  console.log("About Us Page Rendered");
  const [activeTab, setActiveTab] = useState("mission");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);

      // adjust breakpoint if needed
    };

    handleResize(); // initial check

    window.addEventListener("resize", handleResize); // listener for resize

    return () => window.removeEventListener("resize", handleResize); // cleanup
  }, []);

  const missionContent = {
    title: "Our Mission",
    description:
      "At Hare Krishna Vidya, our mission is to empower underprivileged children from rural communities by nurturing not just their minds, but their hearts and hopes too. We believe that every child, regardless of their socio-economic background, deserves the chance to thrive and that education, nourishment, and values are the pillars of true empowerment.",
    subtitle: "Here's how we bring this mission to life:",
    points: [
      "Providing Free Post-School Education",
      "Ensuring Nutritious Meals",
      "Instilling Core Values for Life",
      "Creating a Safe, Nurturing Environment",
    ],
  };

  const visionContent = {
    title: "Our Vision",
    description:
      "Our vision is to create a world where every child, regardless of their background, has access to quality education, proper nutrition, and the opportunity to develop strong moral values. We envision communities where children are empowered to break the cycle of poverty through holistic development.",
    subtitle: "Our vision encompasses:",
    points: [
      "Educational Excellence for All",
      "Sustainable Community Development",
      "Character Building and Moral Growth",
      "Breaking Barriers to Success",
    ],
  };

  const currentContent =
    activeTab === "mission" ? missionContent : visionContent;
  // --------------------

  const [zoomed, setZoomed] = useState<number | null>(null);

  const galleryImages = [
    { src: edu1, alt: "Gallery 3" },
    { src: fest1, alt: "Gallery 3" },
    { src: value, alt: "Gallery 2" },
    { src: yoga1, alt: "Gallery 3" },
    { src: edu2, alt: "Gallery 3" },
    { src: fest2, alt: "Gallery 3" },
    { src: cul1, alt: "Gallery 3" },
    { src: edu3, alt: "Gallery 3" },
  ];

  return (
    <>
      {/* Fixed slide-in labels */}

      {/* Hero Section */}
      {isMobile ? (
        <>
          {/* Mobile-specific hero section */}
          <div className="flex flex-col mx-2 overflow-hidden">
            {/* <Image
              src={about_tab}
              alt="Harinam Sankirtan"
              width={800}
              height={200}
              className="hidden sm:block"
            /> */}

            <div>
              <div className="flex justify-center items-center">
                <Image
                  src={pImg}
                  alt="Srila Prabhupada"
                  width={500}
                  height={470}
                  className="object-contain "
                  priority
                />
              </div>
              <div className="text-center mt-1">
                <h1 className="text-xl font-bold text-orange-500 leading-tight">
                  {/* AC Bhaktivedanta Swami Prabhupada */}
                </h1>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  Founder-Acharya of the worldwide
                  <br />
                  HARE KRISHNA MOVEMENT INDIA
                </p>
              </div>

              <div
                className="p-6 m-4 rounded-2xl shadow-lg flex items-center text-white"
                style={{ background: "#FF9C5A" }}
              >
                <div>
                  <p className="text-base leading-relaxed">
                    HARE KRISHNA MOVEMENT INDIA (HKM) was founded by His Divine Grace{" "}
                    <span className="font-bold italic">
                      A.C. Bhaktivedanta Prabhupada
                    </span>
                    , also called{" "}
                    <span className="font-bold italic">Srila Prabhupada</span>{" "}
                    by devotees affectionately; a man of many facets, a
                    versatile personality, and more. He has been called a
                    scholar, a philosopher, a cultural ambassador, a prolific
                    author, a social critic, and a holy man at various times. In
                    truth, he was all these things and more.
                  </p>
                </div>
              </div>

              <div
                className="text-white p-6 m-4 rounded-2xl shadow-lg flex items-center"
                style={{ background: "#FF9C5A" }}
              >
                <p className="text-base leading-relaxed">
                  On his order HKM is carrying out massive food distribution
                  programs with the support from respective governments and CSR
                  funding from corporates.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Desktop hero section */
        <section>
          {/* Vertical Sticky Side Buttons - Desktop only */}
          <div className="flex flex-col gap-4 absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
            <Link
              href="/trust"
              className="bg-[#f0f5f5] text-black text-sm font-medium py-4 px-2 rounded-l-lg shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              Our Associated Trusts
            </Link>

            {/* <Link
        href="/governance"
        className="bg-[#f0f5f5] text-black text-sm font-medium py-4 px-2 rounded-l-lg shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        Governance
      </Link> */}
          </div>
        </section>
      )}

      {/* Shared content that works on both mobile and desktop */}
      <div className=" hidden md:block w-full relative overflow-hidden   items-center justify-stretch min-h-screen">
        {/* Desktop grid layout - hidden on mobile */}
        <div className="max-w-6xl mx-auto flex flex-row items-start gap-10 mt-2">
          {/* Left Section: Image + Title */}
          <div className="flex flex-col items-center text-center ">
            <Image
              src={pImg}
              alt="Srila Prabhupada"
              width={400}
              height={420}
              className="object-contain"
              priority
            />

            <div className="mt-1">
              <h1 className="text-3xl font-bold text-[#FF9C5A] leading-tight">
                Our Inspiration
                {/* AC Bhaktivedanta Swami Prabhupada */}
              </h1>
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                His Divine Grace Abhay  Charanaravinda Bhaktivedanta Swami
                <br />
                Vishwa Guru Srila Prabhupada
              </p>
            </div>
          </div>

          {/* Right Section: Two Paragraphs */}
          <div className="flex flex-col gap-6 flex-1">
            {/* First Paragraph */}
            <div className="bg-[#FF9C5A] text-white p-6 rounded-2xl shadow-lg">
              <p className="text-base leading-relaxed">
                HARE KRISHNA MOVEMENT INDIA (HKM) was founded by His Divine Grace{" "}
                <span className="font-bold italic">
                  A.C. Bhaktivedanta Prabhupada
                </span>
                , also called{" "}
                <span className="font-bold italic">Srila Prabhupada</span> by
                devotees affectionately; a man of many facets, a versatile
                personality, and more. He has been called a scholar, a
                philosopher, a cultural ambassador, a prolific author, a social
                critic, and a holy man at various times. In truth, he was all
                these things and more.
              </p>
            </div>

            {/* Second Paragraph */}
            <div className="bg-[#FF9C5A] text-white p-6 rounded-2xl shadow-lg">
              <p className="text-base leading-relaxed">
                On his order HKM is carrying out massive food distribution
                programs with the support from respective governments and CSR
                funding from corporates.
              </p>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements - Desktop only */}
        <div className="hidden md:block absolute top-20 left-20 w-32 h-32 bg-white rounded-full opacity-20 blur-xl"></div>
        <div className="hidden md:block absolute bottom-20 right-32 w-40 h-40 bg-white rounded-full opacity-20 blur-xl"></div>
        <div className="hidden md:block absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full opacity-10 blur-lg"></div>
      </div>

      {/* Mission/Vision Section - Shared */}
      <div className="mt-8 md:mt-16 px-2 md:px-0">
        {/* Mobile Mission Section */}
        <div className="block md:hidden">
          <h2 className="text-4xl font-bold py-2">Our Mission</h2>
          <p className="text-gray-600">
            At Hare Krishna Vidya, our mission is to empower underprivileged
            children from rural communities by nurturing not just their minds,
            but their hearts and hopes too. We believe that every child,
            regardless of their socio-economic background, deserves the chance
            to thrive and that education, nourishment, and values are the
            pillars of true empowerment.
          </p>

          <div className="mt-10">
            <h3 className="text-lg text-gray-700 font-semibold mb-4">
              {missionContent.subtitle}
            </h3>
            <div className="flex flex-col gap-3">
              {missionContent.points.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center w-[320px] bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold transition-all duration-300 ease-in-out hover:bg-blue-100 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  <span className="mr-2">✦</span>
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end items-end mt-10">
            <h2 className="text-4xl font-bold">Our Vision</h2>
            <div className="text-end">
              <p>
                We envision a world where every child is given the wings to
                rise, not just survive. A future where learning is joyful,
                nourishing is dignified, and values are woven into the heart of
                education.
              </p>
            </div>
            <div className="px-2 mt-10">
              <h3 className="text-lg text-end text-gray-700 font-semibold mb-4">
                {visionContent.subtitle}
              </h3>
              <div className="flex flex-col gap-3">
                {visionContent.points.map((point, index) => (
                  <div
                    key={index}
                    className="flex flex-row-reverse justify-start items-center w-[320px] bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold gap-2 transition-all duration-300 ease-in-out hover:bg-blue-100 hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <span className="mr-2">✦</span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Mission/Vision Section */}
        <div className="hidden md:block w-full max-w-6xl mx-auto bg-white overflow-hidden shadow-lg">
          <div
            className="relative flex w-1/2 max-w-[500px] bg-[#F4A261]"
            style={{
              borderTopRightRadius: "150px",
            }}
          >
            <button
              onClick={() => setActiveTab("mission")}
              className={`relative z-20 flex-1 py-2 px-6 text-2xl font-medium italic transition-all rounded-tl-[12px] ${activeTab === "mission"
                  ? "bg-[#1d0974] text-white"
                  : "bg-[#F4A261] text-white/80 hover:text-white"
                }`}
              style={{
                borderTopRightRadius: "150px",
              }}
            >
              Our Mission
            </button>

            <button
              onClick={() => setActiveTab("vision")}
              className={`relative z-10 flex-1 py-2 px-6 text-2xl font-medium italic transition-all rounded-tr-[40px] ${activeTab === "vision"
                  ? "bg-[#1d0974] text-white"
                  : "bg-[#F4A261] text-white/80 hover:text-white"
                }`}
              style={{
                borderTopRightRadius: "150px",
              }}
            >
              Our Vision
            </button>
          </div>

          <div className="flex min-h-[600px]">
            <div className="flex-1 bg-[#FF9C5A] p-12 flex flex-col justify-center">
              <div className="text-white space-y-8">
                <p className="text-lg leading-relaxed">
                  {currentContent.description}
                </p>

                <div className="space-y-6">
                  <p className="text-lg font-medium">
                    {currentContent.subtitle}
                  </p>

                  <div className="space-y-4">
                    {currentContent.points.map((point, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="bg-white rounded-full p-2 flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-[#FF9C5A]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium w-[400px] text-start hover:scale-105 hover:bg-gray-100 hover:shadow-md transition-all duration-300 ease-in-out">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <Image
                src={iImg}
                alt="Children learning in classroom"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Shared with responsive design */}
      {/* <div className="w-full   p-4 md:p-6">
  <div className="flex justify-center mb-8">
    <div className="inline-flex items-center gap-3 bg-gray-100 px-4 md:px-8 py-4 rounded-full shadow-lg w-[300px] md:w-auto">
      <span className="text-xl md:text-2xl">✨</span>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        Our Impact in Numbers
      </h2>
    </div>
  </div>

  <div className="">
    <div className="inline-flex p-6 md:p-10 lg:px-20 lg:py-10 justify-center items-center content-center gap-y-8 md:gap-y-11 gap-x-4 md:gap-x-8 flex-wrap rounded-[40px] border border-orange-300 bg-white shadow-sm max-w-[1000px] w-full">
    {stats.map((stat) => (
      <div
        key={stat.id}
        className="flex items-center gap-4 md:gap-6 min-w-[250px] md:min-w-[280px]"
      >
        <div className="text-3xl md:text-4xl">{stat.icon}</div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-xl md:text-2xl lg:text-5xl font-bold text-gray-800 leading-none">
            <CountUp
              end={parseFloat(stat.number.replace(/[^\d.]/g, ""))}
              duration={2}
              separator=","
              suffix={stat.number.replace(/[\d.,]/g, "")}
              decimals={stat.number.includes(".") ? 1 : 0}
            />
          </span>
          <span className="text-base md:text-lg text-gray-600 mt-1 font-medium">
            {stat.label}
          </span>
        </div>
      </div>
    ))}
  
</div>
  </div>

</div> */}

      <StatsSection />

      {/* Why We Exist Section - Shared */}
      <div className="min-h-screen bg-gray-50 mt-6 md:mt-10 p-4 md:p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center bg-white px-4 md:px-6 py-3 rounded-full shadow-sm border mb-8">
              <span className="text-orange-500 mr-1">
                <Image
                  src={img9}
                  alt="Icon"
                  width={24}
                  height={24}
                  className="inline-block align-middle"
                />
              </span>
              <span className="font-bold md:font-medium text-gray-700">
                From Need to Nurture
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
              The cause for which we are <span className="text-orange-500">here?</span>
            </h1>

            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Because every child deserves a chance to learn, grow, and thrive
              no matter where they come from.
            </p>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="relative mb-20">
              <div className="flex flex-col items-center justify-center">
                <div className="hidden flex-col justify-center items-center w-4 h-4 bg-orange-500 rounded-full mr-6"></div>
                <div className="flex-1 max-w-lg">
                  <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    The Need
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      The purpose of education is to develop all round and
                      well-balanced students. This is achieved by integrated
                      curriculum of Hare Krishna Vidya, which puts value
                      education and life skills into the curriculum along with
                      school subjects.
                    </p>
                    <p className="font-bold text-[18px] leading-[160%] text-[#656565] font-inter">
                      &quot;Hare Krishna Vidya&quot; is designed for
                      underprivileged students of classes 1st to 10th,
                      especially in rural areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mb-20">
              <div className="flex flex-col items-center justify-center">
                <div className="hidden flex-col justify-center items-center w-4 h-4 bg-orange-500 rounded-full mr-6"></div>
                <div className="flex-1 max-w-lg">
                  <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    The Cause
                  </h2>
                  <div className="text-gray-600 leading-relaxed">
                    <p>
                      Hare Krishna Vidya affiliated to HARE KRISHNA MOVEMENT INDIA
                      Hyderabad which is a non-profit organization on a mission
                      to empower every single child from rural areas, through
                      free education.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mb-20">
              <div className="flex flex-col items-center justify-center">
                <div className="hidden flex-col justify-center items-center w-4 h-4 bg-orange-500 rounded-full mr-6"></div>
                <div className="flex-1 max-w-lg">
                  <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Teaching Moral Values
                  </h2>
                  <div className="text-gray-600 leading-relaxed">
                    <p>
                      Hare Krishna Vidya organizes evening tuitions under the
                      care of trained teachers, systematically. Teacher focuses
                      on teaching life skills, values to children, and organizes
                      study programs to complete homework, read subjects and
                      doubts will be clarified through teacher and peer
                      learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block relative w-full">
            <div className="absolute inset-0 pointer-events-none flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 465 360"
                fill="none"
                className="w- h-"
              >
                <path
                  d="M10 10H390L395 150H400H130V290H80"
                  stroke="#F4A261"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="9 12"
                  fill="none"
                />
              </svg>
            </div>

            <div className="relative mb-20">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-4 h-4 bg-orange-500 rounded-full mt-2 mr-6"></div>
                <div className="flex-1 max-w-lg">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    The Need
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      The purpose of education is to develop all round and
                      well-balanced students. This is achieved by integrated
                      curriculum of Hare Krishna Vidya, which puts value
                      education and life skills into the curriculum along with
                      school subjects.
                    </p>
                    <p className="font-bold text-[18px] leading-[160%] text-[#656565] font-inter">
                      &quot;Hare Krishna Vidya&quot; is designed for
                      underprivileged students of classes 1st to 10th,
                      especially in rural areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mb-26 flex justify-end">
              <div className="flex items-start max-w-lg">
                <div className="flex-1 text-right">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    The Cause
                  </h2>
                  <div className="text-gray-600 leading-relaxed">
                    <p>
                      Hare Krishna Vidya affiliated to HARE KRISHNA MOVEMENT INDIA
                      Hyderabad which is a non-profit organization on a mission
                      to empower every single child from rural areas, through
                      free education.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-orange-500 rounded-full mt-2 ml-6"></div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-4 h-4 bg-orange-500 rounded-full mt-2 mr-6"></div>
                <div className="flex-1 max-w-lg">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Teaching Moral Values
                  </h2>
                  <div className="text-gray-600 leading-relaxed">
                    <p>
                      Hare Krishna Vidya organizes evening tuitions under the
                      care of trained teachers, systematically. Teacher focuses
                      on teaching life skills, values to children, and organizes
                      study programs to complete homework, read subjects and
                      doubts will be clarified through teacher and peer
                      learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section Header - Shared */}
      <div className="h-[10vh] flex items-center justify-center my-10">
        <section className="px-2">
          <div className="flex items-center justify-center bg-white mt-2 md:mt-8">
            <div className="flex flex-col items-center gap-4 w-[510px] md:w-[523px] text-center text-[--text-dark-charcoal] font-['Urbanist']">
              <h1 className="text-[25px] md:text-2xl lg:text-[40px] font-bold md:font-extrabold leading-[120%]">
                A glimpse into the lives you&apos;ve <br />
                touched with your{" "}
                <span className="text-[#FF9C5A] italic">kindness</span>
              </h1>
            </div>
          </div>
        </section>
      </div>

      {/* Gallery Section - Different layouts for mobile/desktop */}
      {isMobile ? (
        <section className="flex flex-col justify-center mx-10 mt-10 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {galleryImages.slice(2).map((image, index) => (
              <div key={index + 2}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  className=" object-cover rounded-2xl hover:scale-105 transition duration-300 ease-in-out shadow-xl cursor-pointer"
                  onClick={() => setZoomed(index + 2)}
                />
              </div>
            ))}
          </div>

          {/* Zoomed Overlay for mobile */}
          {zoomed !== null && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center transition-all duration-300">
              <button
                className="absolute top-8 right-8 text-white text-4xl bg-black/60 rounded-full p-2 hover:bg-black/80 transition"
                onClick={() => setZoomed(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <Image
                src={galleryImages[zoomed].src}
                alt={galleryImages[zoomed].alt}
                className="rounded-2xl shadow-2xl object-contain  transition-transform duration-300 scale-100"
              />
            </div>
          )}
        </section>
      ) : (
        <section className="px-4 py-6 bg-white flex justify-center">
          <div className="max-w-6xl w-full text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {galleryImages.map((item, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-md"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    // width={400}
                    // height={400}
                    className=" object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/10 bg-opacity-60 group-hover:bg-opacity-0 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
