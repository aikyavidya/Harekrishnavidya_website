"use client";

import Link from "next/link";
import Image from "next/image";
import homeImg from "../../public/images/img1.png";
import homeImg2 from "../../public/images/home_banner.png";
import tab_banner from "../../public/images/tab_home_banner.png";
import img9 from "../../public/images/img9.png";
import k3 from "../../public/images/Group_1.png";
import k1 from "../../public/images/Group_2.png";
import k4 from "../../public/images/Group_3.png";
import k5 from "../../public/images/Group_4.png";
import k2 from "../../public/images/Group_5.png";
import Heart from "../../public/images/Heart.png";
import info from "../../public/images/info.png";

import { useState, useEffect } from "react";
import useUTM from "../utils/useUTM";

export default function HeroSection() {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { appendUTMToUrl } = useUTM();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch("https://api.harekrishnavidya.org/api/home-banner/get");
        const data = await response.json();
        if (data.url) {
          const fullUrl = data.url.startsWith("http")
            ? data.url
            : `https://api.harekrishnavidya.org${data.url}`;
          setBannerUrl(fullUrl);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };
    fetchBanner();
    // Function to check screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // adjust breakpoint if needed
    };

    handleResize(); // initial check

    window.addEventListener("resize", handleResize); // listener for resize

    return () => window.removeEventListener("resize", handleResize); // cleanup
  }, []);

  return (
    <>
      {/* Hero Section */}
      {isMobile ? (
        <div className="flex flex-col gap-2 ">
          {/* ✅ Mobile banner */}
          <div
            className="bg-cover bg-center text-white w-full rounded-xl overflow-hidden h-[65vh] block sm:hidden"
            style={{ backgroundImage: `url(${bannerUrl || homeImg2.src})` }}
          ></div>

          {/* ✅ Tablet banner */}
          <div
            className="bg-cover bg-center text-white w-full rounded-xl overflow-hidden h-[65vh] hidden sm:block md:hidden"
            style={{ backgroundImage: `url(${bannerUrl || tab_banner.src})` }}
          ></div>

          {/* Container for cards */}
          <div className=" mb:bottom-10 left-0 right-0 flex flex-col-reverse  px-4  gap-4">
            {/* Karma Insights Box */}
            <div className="text-black p-4 md:p-6 shadow-xl w-full md:w-[400px] lg:w-[420px] flex flex-col justify-center items-center gap-4 border border-orange-500 rounded-3xl bg-[rgba(237,242,247,0.80)] backdrop-blur-md">
              <div className="flex items-center justify-between flex-wrap  gap-2">
                <div className="flex items-center  gap-2 px-3 py-2 bg-[#F9F9F9] rounded-full shadow-md  text-black font-semibold text-base ">
                  <Image
                    src={img9}
                    alt="Star Icon"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  Welfare Insights
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:gap-20  md:gap-10">
                <div className="text-center">
                  <p className="text-2xl md:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    800K
                  </p>
                  <p className="text-sm md:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Meals <br /> Served
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    50K
                  </p>
                  <p className="text-sm md:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Children&#39;s Educated
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-2 flex-wrap gap-2">
                <div className="flex -space-x-3">
                  {[k3, k1, k4, k5, k2].map((src, idx) => (
                    <Image
                      key={idx}
                      src={src}
                      alt={`donor-${idx}`}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-700 font-semibold italic text-xs md:text-sm">
                  5000+ Donors around the world
                </span>
              </div>
            </div>

            {/* CTA Box */}
            <div className="text-white shadow-xl flex w-full md:w-[400px] lg:w-[515px] px-4 md:px-[35px] py-4 md:py-[26px] justify-center items-center rounded-3xl border border-orange-600 bg-gray-400 backdrop-blur-md">
              <div className="w-full text-center md:text-left">
                <h3 className="text-lg  font-semibold mb-2">
                  Nourish a Life. Uplift a Soul.
                </h3>
                <p className="text-sm text-white/80 mb-4">
                  Your support delivers food, education, and
                  <br className="hidden md:block" />
                  hope to those who need it most.
                </p>
                <div className="flex justify-evenly    gap-2 ">
                  <Link href={appendUTMToUrl("/donation")}>
                    <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-semibold px-4 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
                      <Image
                        src={Heart}
                        alt="Donate Icon"
                        width={20}
                        height={20}
                        className="w-6 h-6"
                      />
                      Donate Now
                    </button>
                  </Link>
                  <Link href="/about-us">
                    <button className="flex justify-center gap-2 bg-white hover:bg-gray-200 cursor-pointer font-semibold px-4 py-3 text-black rounded-lg shadow-md transition-transform transform hover:scale-105">
                      <Image
                        src={info}
                        alt="Info Icon"
                        width={20}
                        height={30}
                        className="w-6 h-6"
                      />
                      About Us
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section
          className="relative bg-cover bg-top text-white  max-w-7xl mx-auto rounded-xl overflow-hidden h-[140vh] "
          style={{ backgroundImage: `url(${bannerUrl || homeImg.src})` }}
        >
          {/* Container for cards */}
          <div className="absolute bottom-4 md:bottom-8 lg:mb-10 left-1 right-1 flex flex-col md:flex-col lg:flex-row md:items-center lg:items-start md:gap-6 lg:gap-40 px-4 md:px-8 lg:px-4">
            {/* Karma Insights Box */}
            <div className="text-black p-4 md:p-4 mb-0 shadow-xl w-full md:max-w-[500px] xl:w-[300px] flex flex-col gap-4 rounded-3xl bg-[rgba(237,242,247,0.80)] backdrop-blur-md mx-auto lg:mx-0">
              <div className="flex items-center justify-center md:justify-center flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#F9F9F9] rounded-full shadow-md text-black font-semibold text-base md:text-lg">
                  <Image src={img9} alt="Star Icon" width={20} height={20} />
                  Welfare Insights
                </div>
              </div>

              <div className="flex items-center  gap-6 xl:gap-24">
                <div className="text-center">
                  <p className="text-2xl md:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    800K
                  </p>
                  <p className="text-sm md:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Meals <br /> Served
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-[32px] font-bold leading-[120%] text-[#2C2C2C] m-0">
                    50K
                  </p>
                  <p className="text-sm md:text-[16px] font-medium leading-[120%] text-[#2C2C2C] m-0">
                    Children&#39;s <br /> Educated
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-2 flex-wrap gap-2">
                <div className="flex -space-x-3">
                  {[k3, k1, k4, k5, k2].map((src, idx) => (
                    <Image
                      key={idx}
                      src={src}
                      alt={`donor-${idx}`}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-700 font-semibold italic text-xs md:text-sm">
                  5000+ Donors around the world
                </span>
              </div>
            </div>

            {/* CTA Box */}
            <div className="absolute xl:right-6 text-white shadow-xl flex w-full md:max-w-[500px] lg:w-[380px] px-4 md:px-6 py-4 md:py-6 lg:py-8 xl:py-10 justify-center items-center rounded-3xl border border-black bg-black/10 backdrop-blur-md mx-auto lg:mx-0">
              <div className="w-full text-center md:text-left">
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Nourish a Life. Uplift a Soul.
                </h3>
                <p className="text-md text-white/80 mb-4">
                  Your support delivers food, education, and
                  <br className="hidden md:block" />
                  hope to those who need it most.
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-center md:justify-start md:space-x-4 gap-2">
                  <Link href={appendUTMToUrl("/donation")}>
                    <button className=" mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-semibold px-4 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
                      <Image
                        src={Heart}
                        alt="Donate Icon"
                        width={20}
                        height={20}
                        className="w-6 h-6"
                      />
                      Donate Now
                    </button>
                  </Link>

                  <Link href="/about-us">
                    <button className="mt-4 flex justify-center gap-2 bg-white hover:bg-gray-200 cursor-pointer font-semibold px-4 py-3 text-black rounded-lg shadow-md transition-transform transform hover:scale-105">
                      <Image
                        src={info}
                        alt="Info Icon"
                        width={20}
                        height={30}
                        className="w-6 h-6"
                      />
                      About Us
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Below Hero */}
      <section className="flex flex-col justify-center  items-center md:items-center w-full lg:mx-4 p-4">
        <div>
          <h2 className="mb-1  text-[42px] lg:text-[40px] italic font-extrabold leading-[120%] font-['Urbanist'] text-[#2C2C2C] drop-shadow-md ">
            Give Nourishment,{" "}
            <span className="text-[#FFA850]">Give Knowledge</span>, Give Hope
          </h2>
          <p className="text-[18px] italic font-bold leading-[160%] text-gray-600 font-['Urbanist'] mt-2 drop-shadow">
            <span className="text-[#232323] font-extrabold">
              Decide the path
            </span>{" "}
            of your kindness — Your help leads to hope and transformation
          </p>
        </div>
      </section>
    </>
  );
}
