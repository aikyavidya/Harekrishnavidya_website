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
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <>
      <footer className="bg-[#002A42] text-white px-2 lg:px-4 py-5 overflow-hidden">
        <StaggerContainer className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 ">
            {/* Logo and About Section */}
            <StaggerItem className="col-span-2 lg:col-span-1 ">
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
                  {t("footer.description")}
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
            <StaggerItem className="space-y-4 col-span-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="text-[#F4A261] text-xl font-bold">{t("footer.quickLinks")}</h2>
              <ul className="space-y-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                <li>
                  <Link
                    href="/about-us"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("nav.aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-initiative"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("nav.ourInitiative")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("footer.blogs")}
                  </Link>
                </li>
 
                <li>
                  <Link
                    href="/events"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("footer.events")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/career"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("footer.career")}
                  </Link>
                </li>
              </ul>
            </StaggerItem>
 
            {/* Useful Links */}
            <StaggerItem className="space-y-4 col-span-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="text-[#F4A261] text-xl font-bold">{t("footer.usefulLinks")}</h2>
              <ul className="space-y-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                <li>
                  <Link
                    href="/policies"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("footer.privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("footer.termsAndConditions")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("footer.refundPolicy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certificates"
                    className="text-white hover:text-yellow-200 text-base nav-link-animated inline-block"
                  >
                    {t("footer.certificates")}
                  </Link>
                </li>
              </ul>
            </StaggerItem>
 
            {/* Contact Section */}
            <StaggerItem className="space-y-4 col-span-2 lg:col-span-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="text-[#F4A261] text-xl font-bold">{t("footer.contactUs")}</h2>
              <div className="space-y-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="group flex items-start gap-3 justify-center lg:justify-start text-center lg:text-left max-w-[280px] lg:max-w-none">
                  <motion.div whileHover={{ y: -2, color: "#F4A261" }} className="hidden lg:block"><FaMapMarkerAlt size={16} className="mt-1 flex-shrink-0 transition-colors" /></motion.div>
                  <a
                    href="https://www.google.com/maps?q=Hare+Krishna+Golden+Temple,+MLA+Colony,+Banjara+Hills,+Hyderabad+-+500034"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group-hover:text-yellow-200 text-base leading-relaxed transition-colors text-center lg:text-left"
                  >
                    <FaMapMarkerAlt size={16} className="inline-block mr-1.5 mb-1 lg:hidden text-[#F4A261]" />
                    {t("footer.address")}
                  </a>
                </div>
 
                <div className="group flex items-center gap-3 justify-center lg:justify-start text-center lg:text-left">
                  <motion.div whileHover={{ x: 2, color: "#F4A261" }}><FaEnvelope size={14} className="flex-shrink-0 transition-colors" /></motion.div>
                  <a
                    href="mailto:aikyavidya@hkmhyderabad.org"
                    className="group-hover:text-yellow-200 text-base transition-colors"
                  >
                    aikyavidya@hkmhyderabad.org
                  </a>
                </div>
                <div className="group flex items-center gap-3 justify-center lg:justify-start text-center lg:text-left">
                  <motion.div whileHover={{ scale: 1.1, rotate: 10, color: "#F4A261" }}><FaPhoneAlt size={14} className="flex-shrink-0 transition-colors" /></motion.div>
                  <a
                    href="tel:8019397108"
                    className="group-hover:text-yellow-200 text-base transition-colors"
                  >
                    +91 8019397108
                  </a>
                </div>
                <div className="group flex items-center gap-3 justify-center lg:justify-start text-center lg:text-left">
                  <motion.div whileHover={{ scale: 1.1, rotate: 10, color: "#F4A261" }}><FaPhoneAlt size={14} className="flex-shrink-0 transition-colors" /></motion.div>
                  <a
                    href="tel:+918328389862"
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
      <div className="bg-[#002A42] border-t border-white pt-4 pb-3 px-10 flex items-center justify-center text-sm text-white">
        <p className="pb-3 text-center">
          {t("footer.copyright")}
        </p>
      </div>
    </>
  );
}
