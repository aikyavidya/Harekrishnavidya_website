"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "./AnimationProvider";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from "../../public/images/logo.png";

export default function Footer() {
  return (
    <>
      <footer className="bg-[#002A42] text-white px-2 lg:px-4 py-5 overflow-hidden">
        <StaggerContainer className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {/* Logo and About Section */}
            <StaggerItem className="col-span-1 md:col-span-2 lg:col-span-1 ">
              <motion.div whileHover={{ scale: 1.05 }} className="inline-block transform origin-left">
                <Image
                  src={logo}
                  alt="HARE KRISHNA MOVEMENT INDIA Logo"
                  width={160}
                  height={100}
                  className="object-contain"
                />
              </motion.div>
              <div className="pt-2">
                <p className="text-sm   text-white leading-[1.8]">
                  &quot;Hare Krishna Vidya&quot;, by HARE KRISHNA MOVEMENT INDIA,
                  serves underprivileged students of  classes 1–10, especially in <br />
                  rural areas.
                </p>
                <div className="mt-4">
                  <ul className="flex items-center gap-3">
                    <li>
                      <a
                        href="https://www.facebook.com/people/Hare-Krishna-Vidya/pfbid05sv1xecw33n1XMN9WmiSoUNLmiQGf1xVwnW7znm2CaTcpShPSPjBKQZ2i1E9uqqpl/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block p-2 rounded-full bg-white/10 hover:bg-[#1877F2] social-icon-hover"
                        aria-label="Facebook"
                      >
                        <FaFacebookF
                          size={20}
                          className="text-white transition-colors"
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/harekrishnavidya_official/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block p-2 rounded-full bg-white/10 hover:bg-[#E4405F] social-icon-hover"
                        aria-label="Instagram"
                      >
                        <FaInstagram
                          size={20}
                          className="text-white transition-colors"
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        href="http://www.youtube.com/@HarekrishnaVidya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block p-2 rounded-full bg-white/10 hover:bg-[#FF0000] social-icon-hover"
                        aria-label="YouTube"
                      >
                        <FaYoutube
                          size={20}
                          className="text-white transition-colors"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </StaggerItem>

            {/* Quick Links */}
            <StaggerItem className="space-y-4">
              <h2 className="text-[#F4A261] text-xl font-bold">Quick Links</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about-us"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-initiative"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    Our Initiative
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    Blogs
                  </Link>
                </li>

                <li>
                  <Link
                    href="/events"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/career"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    Career
                  </Link>
                </li>
              </ul>
            </StaggerItem>

            {/* Useful Links */}
            <StaggerItem className="space-y-4">
              <h2 className="text-[#F4A261] text-xl font-bold">Useful Links</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/policies"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certificates"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    Certificates
                  </Link>
                </li>
              </ul>
            </StaggerItem>

            {/* Contact Section */}
            <StaggerItem className="space-y-4">
              <h2 className="text-[#F4A261] text-xl font-bold">Contact Us</h2>
              <div className="space-y-2">
                <div className="group flex items-start gap-3">
                  <motion.div whileHover={{ y: -2, color: "#F4A261" }}><FaMapMarkerAlt size={16} className="mt-1 flex-shrink-0 transition-colors" /></motion.div>
                  <a
                    href="https://www.google.com/maps?q=Hare+Krishna+Golden+Temple,+MLA+Colony,+Banjara+Hills,+Hyderabad+-+500034"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group-hover:text-yellow-200 text-base leading-relaxed transition-colors"
                  >
                    Hare Krishna Golden Temple, Road No. 12, MLA Colony, Banjara
                    Hills, Hyderabad - 500034
                  </a>
                </div>

                <div className="group flex items-center gap-3">
                  <motion.div whileHover={{ x: 2, color: "#F4A261" }}><FaEnvelope size={14} className="flex-shrink-0 transition-colors" /></motion.div>
                  <a
                    href="mailto:aikyavidya@hkmhyderabad.org"
                    className="group-hover:text-yellow-200 text-base transition-colors"
                  >
                    aikyavidya@hkmhyderabad.org
                  </a>
                </div>
                <div className="group flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.1, rotate: 10, color: "#F4A261" }}><FaPhoneAlt size={14} className="flex-shrink-0 transition-colors" /></motion.div>
                  <a
                    href="tel:8019397108"
                    className="group-hover:text-yellow-200 text-base transition-colors"
                  >
                    +91 8019397108
                  </a>
                </div>
                <div className="group flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.1, rotate: 10, color: "#F4A261" }}><FaPhoneAlt size={14} className="flex-shrink-0 transition-colors" /></motion.div>
                  <a
                    href="tel:91 83283 89862"
                    className="group-hover:text-yellow-200 text-base transition-colors"
                  >
                    +91 83283 89862
                  </a>
                </div>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </footer>

      {/* Bottom Section */}
      <div className="bg-[#002A42] border-t border-white pt-4 pb-3 px-10 flex flex-col sm:flex-row items-start justify-between text-sm text-white">
        <p className="mb-2 md:mb-0 pb-3 lg:px-2 ">
          Copyright © 2025 Hare Krishna Vidya
        </p>
        <p>
          Carefully Crafted by{" "}
          <a
            href="https://digitalizetheglobe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-yellow-400"
          >
            Digitalize The Globe.
          </a>
        </p>
      </div>
    </>
  );
}
