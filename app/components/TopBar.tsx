"use client";

import React from "react";
import { Mail } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function TopBar() {
  return (
    <div
      className="py-3 text-[15px] font-medium text-gray-900 border-b border-orange-100 w-full z-[60] relative"
      // style={{ backgroundColor: '#fff3e0' }}
      // style={{ backgroundColor: '#eff6f9ff' }}
      // style={{ backgroundColor: '#dcebf2ff' }}
      style={{ backgroundColor: '#f1fbffff' }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Left side: Contact Info */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="mailto:aikyavidya@hkmhyderabad.org"
            className="flex items-center gap-1.5"
          >
            <Mail size={24} className="text-gray-800" />
          </a>
          <a
            href="https://wa.me/918328389862"
            className="flex items-center gap-1.5"
          >
            <FaWhatsapp size={24} className="text-gray-800" />
            <span className="hidden sm:inline text-[14px] font-bold">+91 83283 89862</span>
          </a>
        </div>

        {/* Right side: Social Icons */}
        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href="http://www.youtube.com/@HarekrishnaVidya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube size={16} className="text-gray-800" />
          </a>
          <a
            href="https://www.instagram.com/harekrishnavidya_official/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram size={16} className="text-gray-800" />
          </a>
          <a
            href="https://x.com/TakkitiR79410"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
          >
            <FaXTwitter size={16} className="text-gray-800" />
          </a>
          <a
            href="https://www.facebook.com/people/Hare-Krishna-Vidya/pfbid05sv1xecw33n1XMN9WmiSoUNLmiQGf1xVwnW7znm2CaTcpShPSPjBKQZ2i1E9uqqpl/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF size={16} className="text-gray-800" />
          </a>
        </div>
      </div>
    </div>
  );
}
