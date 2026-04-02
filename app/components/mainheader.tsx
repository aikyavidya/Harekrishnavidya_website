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

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import logo from "../../public/images/logo.png";
import useUTM from "../utils/useUTM";
import { IoChevronDown } from "react-icons/io5";
export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const { appendUTMToUrl } = useUTM();

  const linkClass = (href: string) =>
    `hover:text-orange-500 transition ${pathname === href ? "text-orange-600 font-semibold underline" : ""
    }`;

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 lg:px-3 py-4">
        {/* Logo + Title */}
        <div className="text-xl lg:text-2xl font-bold text-black flex items-center gap-2">
          <Link href="/home">
            <Image
              src={logo}
              alt="Hare Krishna Movement Logo"
              width={100}
              height={80}
              className="hidden lg:block object-contain"
            />
          </Link>

          <Link href="/home">
            <span className="text-blue-900">HARE KRISHNA</span>{" "}
            <span className="text-orange-400">VIDYA</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-black font-medium">
          <Link href="/home" className={linkClass("/home")}>
            Home
          </Link>

          <Link href="/about-us" className={linkClass("/about-us")}>
            About Us
          </Link>

          <Link href="/our-initiative" className={linkClass("/our-initiative")}>
            Our Initiative
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
              <span>Media</span>
              <IoChevronDown className="text-black text-lg transition-transform duration-300 group-hover:rotate-180" />
            </div>

            <ul
              className="absolute left-0 mt-2 bg-orange-600/90 backdrop-blur-md 
                rounded-lg shadow-lg p-3 w-52 opacity-0 invisible group-hover:opacity-100 
                group-hover:visible transition-all duration-300 space-y-2 z-50"
            >
              <li>
                <Link
                  href="/video-gallery"
                  className="text-white hover:text-yellow-200"
                >
                  Video Gallery
                </Link>
              </li>

              <li>
                <Link
                  href="/donor-wall"
                  className="text-white hover:text-yellow-200"
                >
                  Donor Wall
                </Link>
              </li>

              <li>
                <Link
                  href="/photo-gallery"
                  className="text-white hover:text-yellow-200"
                >
                  Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          <Link href="/contact" className={linkClass("/contact")}>
            Contact Us
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
              <span>New Donation</span>

              <IoChevronDown className="text-black text-lg transition-transform duration-300 group-hover:rotate-180" />
            </div>

            <ul
              className="absolute left-0 mt-2 bg-orange-600/90 backdrop-blur-md 
                rounded-lg shadow-lg p-3 w-52 opacity-0 invisible group-hover:opacity-100 
                group-hover:visible transition-all duration-300 space-y-2 z-50"
            >
              <li>
                <Link
                  href="/donate-to-cause"
                  className="text-white hover:text-yellow-200"
                >
                  Donate to Cause
                </Link>
              </li>

              <li>
                <Link
                  href="/grocery-donation"
                  className="text-white hover:text-yellow-200"
                >
                  Grocery Donation
                </Link>
              </li>

              <li>
                <Link
                  href="/campaign-page"
                  className="text-white hover:text-yellow-200"
                >
                  Campaign Page
                </Link>
              </li>

              <li>
                <Link
                  href="/donation-kit"
                  className="text-white hover:text-yellow-200"
                >
                  Donation Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Donate Now Button */}
          <Link href={appendUTMToUrl("/donation#donate")}>
            <button className="px-4 py-2 bg-[#0B3954] text-white rounded-lg hover:bg-orange-400 transition">
              Donate Now
            </button>
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl text-black"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 bg-white px-6 py-4 text-black text-lg shadow">
          <Link
            href="/home"
            className={linkClass("/home")}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/about-us"
            className={linkClass("/about-us")}
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>

          <Link
            href="/our-initiative"
            className={linkClass("/our-initiative")}
            onClick={() => setIsOpen(false)}
          >
            Our Initiative
          </Link>

          <Link
            href="/gallery"
            className={linkClass("/gallery")}
            onClick={() => setIsOpen(false)}
          >
            Gallery
          </Link>

          {/* Mobile Media Dropdown */}
          <div className="flex flex-col">
            <button
              className="flex items-center justify-between w-full text-left text-lg text-black"
              onClick={() => setShowMedia(!showMedia)}
            >
              Media
              <IoChevronDown
                className={`transition-transform duration-300 ${showMedia ? "rotate-180" : ""
                  }`}
              />
            </button>

            {showMedia && (
              <div className="ml-4 mt-2 flex flex-col gap-2 text-base">
                <Link
                  href="/video-gallery"
                  onClick={() => {
                    setIsOpen(false);
                    setShowMedia(false);
                  }}
                >
                  Video Gallery
                </Link>

                <Link
                  href="/donor-wall"
                  onClick={() => {
                    setIsOpen(false);
                    setShowMedia(false);
                  }}
                >
                  Donor Wall
                </Link>

                <Link
                  href="/photo-gallery"
                  onClick={() => {
                    setIsOpen(false);
                    setShowMedia(false);
                  }}
                >
                  Photo Gallery
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={linkClass("/contact")}
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
          {/* <Link
            href="/sponsorships"
            className={linkClass("/sponsorships")}
            onClick={() => setIsOpen(false)}
          >
            Sponsorships
          </Link> */}

          {/* Mobile New Donation Dropdown */}
          <div className="flex flex-col">
            <button
              className="flex items-center justify-between w-full text-left text-lg text-black"
              onClick={() => setShowDonation(!showDonation)}
            >
              New Donation
              <IoChevronDown
                className={`transition-transform duration-300 ${showDonation ? "rotate-180" : ""
                  }`}
              />
            </button>

            {showDonation && (
              <div className="ml-4 mt-2 flex flex-col gap-2 text-base">
                <Link
                  href="/donate-to-cause"
                  onClick={() => {
                    setIsOpen(false);
                    setShowDonation(false);
                  }}
                >
                  Donate to Cause
                </Link>

                <Link
                  href="/grocery-donation"
                  onClick={() => {
                    setIsOpen(false);
                    setShowDonation(false);
                  }}
                >
                  Grocery Donation
                </Link>

                <Link
                  href="/campaign-page"
                  onClick={() => {
                    setIsOpen(false);
                    setShowDonation(false);
                  }}
                >
                  Campaign Page
                </Link>

                <Link
                  href="/donation-kit"
                  onClick={() => {
                    setIsOpen(false);
                    setShowDonation(false);
                  }}
                >
                  Donation Kit
                </Link>
              </div>
            )}
          </div>

          <Link
            href={appendUTMToUrl("/donation#donate")}
            onClick={() => setIsOpen(false)}
          >
            <button className="w-full px-4 py-2 bg-[#0B3954] text-white rounded-lg hover:bg-orange-500 transition">
              Donate Now
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}

