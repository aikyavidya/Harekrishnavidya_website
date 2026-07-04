// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"; // install react-icons if not installed
// import logo from "../../public/images/logo.png";
// import useUTM from "../utils/useUTM";

// export default function Header() {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);
//   const { appendUTMToUrl } = useUTM();

//   const linkClass = (href: string) =>
//     `hover:text-orange-500 transition ${pathname === href ? "text-orange-600 font-semibold underline" : ""
//     }`;

//   return (
//     <header className="bg-white sticky top-0 z-50  ">
//       <div className="flex items-center justify-between px-6  lg:px-3 py-4">
//         {/* Logo */}
//         <div className=" text-xl lg:text-2xl font-bold text-black flex items-center gap-2">
//           <Link href="/home">
//             <Image
//               src={logo}
//               alt="HARE KRISHNA MOVEMENT INDIA Logo"
//               width={100}
//               height={80}
//               className="hidden lg:block object-contain"
//             />


//           </Link>

//           <Link href="/home" >
//             <span className="text-blue-900">HARE KRISHNA</span>{" "}
//             <span className="text-orange-400">VIDYA</span>
//           </Link>
//         </div>

//         {/* Desktop Navigation */}
//         {/* <nav className="hidden md:flex items-center space-x-8 text-black text-lg">
//           <Link href="/home" className={linkClass("/home")}>
//             Home
//           </Link>
//           <Link href="/about-us" className={linkClass("/about-us")}>
//             About Us
//           </Link>
//           <Link href="/our-initiative" className={linkClass("/our-initiative")}>
//             Our Initiative
//           </Link>
//           <Link href="/gallery" className={linkClass("/gallery")}>
//             Gallery
//           </Link>
//           <Link href="/contact" className={linkClass("/contact")}>
//             Contact Us
//           </Link>

//           <Link href={appendUTMToUrl("/donation")}>
//             <button className="flex items-center justify-center cursor-pointer gap-[10px] px-[12px] py-[4px] bg-[#0B3954] text-white rounded-lg  hover:bg-orange-400 hover:text-white transition-all duration-300">
//               Donate Now
//             </button>
//           </Link>
//         </nav> */}
//         <nav className="hidden md:flex items-center space-x-8 text-black font-medium">

//           <Link href="/" className={linkClass("/")}>
//             Home
//           </Link>

//           <Link href="/about-us" className={linkClass("/about-us")}>
//             About Us
//           </Link>

//           <Link href="/our initiative" className={linkClass("/our initiative")}>
//             Our Initiative
//           </Link>

//           <Link href="/gallery" className={linkClass("/gallery")}>
//             Gallery
//           </Link>

//           <Link href="/contact" className={linkClass("/contact")}>
//             Contact Us
//           </Link>

//           {/* NEW DONATION DROPDOWN */}
//           <div className="relative group">
//             <h3 className="text-[#F4A261] text-lg font-semibold cursor-pointer">
//               New Donation
//             </h3>

//             {/* DROPDOWN */}
//             <ul className="absolute left-0 mt-2 bg-orange-600/90 backdrop-blur-md 
//       rounded-lg shadow-lg p-3 w-52 opacity-0 invisible group-hover:opacity-100 
//       group-hover:visible transition-all duration-300 space-y-2 z-50">

//               <li>
//                 <Link
//                   href="/donate-to-cause"
//                   className="text-white hover:text-yellow-200 text-base"
//                 >
//                   Donate to Cause
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/grocery-donation"
//                   className="text-white hover:text-yellow-200 text-base"
//                 >
//                   Grocery Donation
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/campaign-page"
//                   className="text-white hover:text-yellow-200 text-base"
//                 >
//                   Campaign Page
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/donation-kit"
//                   className="text-white hover:text-yellow-200 text-base"
//                 >
//                   Donation Kit
//                 </Link>
//               </li>

//             </ul>
//           </div>
//         </nav>

//         {/* Mobile Menu Toggle */}
//         <button
//           className="md:hidden text-3xl text-black focus:outline-none"
//           onClick={() => setIsOpen(!isOpen)}
//           aria-label="Toggle Menu"
//         >
//           {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="md:hidden flex flex-col  justify-start gap-1  bg-white px-6 py-4 space-y-4 text-black text-lg shadow">
//           <Link
//             href="/home"
//             className={linkClass("/home")}
//             onClick={() => setIsOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             href="/about-us"
//             className={linkClass("/about-us")}
//             onClick={() => setIsOpen(false)}
//           >
//             About Us
//           </Link>
//           <Link
//             href="/our-initiative"
//             className={linkClass("/our-initiative")}
//             onClick={() => setIsOpen(false)}
//           >
//             Our Initiative
//           </Link>
//           <Link
//             href="/gallery"
//             className={linkClass("/gallery")}
//             onClick={() => setIsOpen(false)}
//           >
//             Gallery
//           </Link>
//           <Link
//             href="/contact"
//             className={linkClass("/contact")}
//             onClick={() => setIsOpen(false)}
//           >
//             Contact Us
//           </Link>

//           <Link href={appendUTMToUrl("/donation")} onClick={() => setIsOpen(false)}>
//             <button className="w-full flex items-center justify-center cursor-pointer gap-[10px] px-[16px] py-[8px] bg-[#0B3954] text-white rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300">
//               Donate Now
//             </button>
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import logo from "../../public/images/hare krishna vidya logo-final update.png";
import useUTM from "../utils/useUTM";
import { IoChevronDown } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { usePageLoader } from "./PageLoader";
import { useLanguage } from "./LanguageProvider";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { startLoading } = usePageLoader();
  const { language, setLanguage, t } = useLanguage();
  const { appendUTMToUrl, handleDonateClick } = useUTM();

  // Handle scroll detection for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (href: string) =>
    `nav-link-animated ${pathname === href ? "text-[#1C398E] font-semibold active" : ""}`;

  return (
    <header
      className={`z-50 transition-all duration-300 ${
        scrolled 
          ? "fixed top-3 left-0 right-0 mx-4 lg:mx-16 xl:mx-24 rounded-2xl border border-gray-200 shadow-md bg-white/70 backdrop-blur-md" 
          : "sticky top-0 w-full bg-white"
      }`}
    >
      <div className="flex items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Left: Logo */}
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <Link href="/home" onClick={startLoading}>
            <Image
              src={logo}
              alt="Hare Krishna Movement Logo"
              width={105}
              height={95}
              className="object-contain w-[105px] md:w-[80px] min-[1025px]:w-[105px]"
            />
          </Link>
        </motion.div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex justify-center items-center md:space-x-4 min-[1025px]:space-x-8 md:text-xs min-[1025px]:text-[14px] text-gray-800 font-semibold">
          <Link href="/home" className={linkClass("/home")} onClick={startLoading}>
            {t("nav.home")}
          </Link>

          <Link href="/about-us" className={linkClass("/about-us")} onClick={startLoading}>
            {t("nav.aboutUs")}
          </Link>

          <Link href="/our-initiative" className={linkClass("/our-initiative")} onClick={startLoading}>
            {t("nav.ourInitiative")}
          </Link>

          {/* <Link href="/gallery" className={linkClass("/gallery")}>
            Gallery
          </Link> */}

          {/* Media Desktop Dropdown */}
          <div className="relative group">
            <div
              className={`flex items-center gap-1 cursor-pointer ${linkClass(
                "/media"
              )}`}
            >
              <span>{t("nav.media")}</span>
              <IoChevronDown className="text-black text-lg transition-transform duration-300 group-hover:rotate-180" />
            </div>

            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <motion.ul
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0279BC]/90 backdrop-blur-md rounded-lg shadow-lg py-3 w-52 space-y-1"
              >
                <li>
                  <Link
                    href="/video-gallery"
                    className="block px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                    onClick={startLoading}
                  >
                    {t("nav.videoGallery")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donor-wall"
                    className="block px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                    onClick={startLoading}
                  >
                    {t("nav.donorWall")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/photo-gallery"
                    className="block px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                    onClick={startLoading}
                  >
                    {t("nav.photoGallery")}
                  </Link>
                </li>
              </motion.ul>
            </div>
          </div>

          <Link href="/contact" className={linkClass("/contact")} onClick={startLoading}>
            {t("nav.contactUs")}
          </Link>
          {/* <Link href="/sponsorships" className={linkClass("/sponsorships")}>
            Sponsorships
          </Link> */}

          {/* New Donation Desktop Dropdown */}
          <div className="relative group">
            <div
              className={`flex items-center gap-1 cursor-pointer ${linkClass(
                "/new-donation"
              )}`}
            >
              <span>{t("nav.newDonation")}</span>
              <IoChevronDown className="text-black text-lg transition-transform duration-300 group-hover:rotate-180" />
            </div>

            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <motion.ul
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0279BC]/90 backdrop-blur-md rounded-lg shadow-lg py-3 w-52 space-y-1"
              >
                <li>
                  <Link
                    href="/donate-to-cause"
                    className="block px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                    onClick={startLoading}
                  >
                    {t("nav.donateToCause")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/grocery-donation"
                    className="block px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                    onClick={startLoading}
                  >
                    {t("nav.groceryDonation")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/campaign-page"
                    className="block px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                    onClick={startLoading}
                  >
                    {t("nav.campaignPage")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donation-kit"
                    className="block px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                    onClick={startLoading}
                  >
                    {t("nav.donationKit")}
                  </Link>
                </li>
              </motion.ul>
            </div>
          </div>

        </nav>

        {/* Right: Donate Now Button */}
        <div className="flex items-center justify-end gap-2 min-[1025px]:gap-4">
          {/* Desktop Language Toggle */}
          <div className="hidden md:block relative group">
            <div className="flex items-center gap-1 cursor-pointer font-semibold text-gray-800 text-sm">
              <span>{language === "en" ? "English" : "తెలుగు"}</span>
              <IoChevronDown className="text-black text-lg transition-transform duration-300 group-hover:rotate-180" />
            </div>
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-[#0279BC]/90 backdrop-blur-md rounded-lg shadow-lg py-2 w-32 space-y-1">
                <button
                  onClick={() => setLanguage("en")}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("te")}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#0279BC]/50 hover:text-yellow-200 transition-colors"
                >
                  తెలుగు
                </button>
              </div>
            </div>
          </div>
          <Link href={appendUTMToUrl("/donation#annadan-seva")} onClick={(e) => { startLoading(); handleDonateClick(e); }} className="hidden md:block">
            <button className="flex items-center gap-2 md:px-3 md:py-1.5 min-[1025px]:px-5 min-[1025px]:py-2 bg-[#0279BC] text-white rounded-lg transition-transform duration-300 hover:scale-105 font-medium md:text-xs min-[1025px]:text-base">
              <FaHeart size={14} /> {t("nav.donateNow")}
            </button>
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-3xl text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col gap-2 bg-white px-6 py-4 text-black text-lg shadow-md border-t border-gray-100 overflow-hidden absolute w-full left-0 top-full"
          >
            {[
              { label: t("nav.home"), href: "/home" },
              { label: t("nav.aboutUs"), href: "/about-us" },
              { label: t("nav.ourInitiative"), href: "/our-initiative" },
            ].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`block py-2 ${linkClass(link.href)}`}
                  onClick={() => { startLoading(); setIsOpen(false); }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Media Dropdown */}
            <motion.div
              className="flex flex-col py-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                className="flex items-center justify-between w-full text-left font-medium text-black"
                onClick={() => setShowMedia(!showMedia)}
              >
                {t("nav.media")}
                <IoChevronDown
                  className={`transition-transform duration-300 ${showMedia ? "rotate-180 text-[#1C398E]" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showMedia && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 mt-2 flex flex-col gap-3 text-base text-gray-600 border-l-2 border-[#1C398E]/30 pl-4 py-1 overflow-hidden"
                  >
                    {[
                      { l: t("nav.videoGallery"), h: "/video-gallery" },
                      { l: t("nav.donorWall"), h: "/donor-wall" },
                      { l: t("nav.photoGallery"), h: "/photo-gallery" }
                    ].map(link => (
                      <Link
                        key={link.h}
                        href={link.h}
                        className="hover:text-[#1C398E] transition-colors"
                        onClick={() => { startLoading(); setIsOpen(false); setShowMedia(false); }}
                      >
                        {link.l}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/contact"
                className={`block py-2 ${linkClass("/contact")}`}
                onClick={() => { startLoading(); setIsOpen(false); }}
              >
                {t("nav.contactUs")}
              </Link>
            </motion.div>

            {/* Mobile New Donation Dropdown */}
            <motion.div
              className="flex flex-col py-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                className="flex items-center justify-between w-full text-left font-medium text-black"
                onClick={() => setShowDonation(!showDonation)}
              >
                {t("nav.newDonation")}
                <IoChevronDown
                  className={`transition-transform duration-300 ${showDonation ? "rotate-180 text-[#1C398E]" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showDonation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 mt-2 flex flex-col gap-3 text-base text-gray-600 border-l-2 border-[#1C398E]/30 pl-4 py-1 overflow-hidden"
                  >
                    {[
                      { l: t("nav.donateToCause"), h: "/donate-to-cause" },
                      { l: t("nav.groceryDonation"), h: "/grocery-donation" },
                      { l: t("nav.campaignPage"), h: "/campaign-page" },
                      { l: t("nav.donationKit"), h: "/donation-kit" }
                    ].map(link => (
                      <Link
                        key={link.h}
                        href={link.h}
                        className="hover:text-[#1C398E] transition-colors"
                        onClick={() => { startLoading(); setIsOpen(false); setShowDonation(false); }}
                      >
                        {link.l}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 pb-2"
            >
              <Link
                href={appendUTMToUrl("/donation#annadan-seva")}
                onClick={(e) => {
                  startLoading();
                  setIsOpen(false);
                  handleDonateClick(e);
                }}
              >
                <button className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#0279BC] text-white rounded-lg transition-transform duration-300 hover:scale-105 font-medium">
                  <FaHeart size={14} /> {t("nav.donateNow")}
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

