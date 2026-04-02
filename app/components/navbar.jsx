"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../public/images/logo.png";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href) =>
    `hover:text-orange-500 transition ${
      pathname === href ? "font-bold text-orange-600 underline" : ""
    }`;

  return (
    <div className="w-full max-w-7xl flex items-center justify-between md:px-2 py-6">
      {/* Logo */}
       <Image
          src={logo}
          alt="HARE KRISHNA MOVEMENT INDIA Logo"
          width={160}
          height={100}
          className="object-contain"
        />
      <div className="text-2xl font-bold text-black">
       
        <span className="text-blue-900">HARE KRISHNA</span>{" "}
        <span className="text-orange-400">VIDYA</span>
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex space-x-8 text-black font-medium">
        <Link href="/" className={linkClass("/")}>
          Home
        </Link>
        <Link href="/about-us" className={linkClass("/about-us")}>
          About Us
        </Link>
        <Link href="/our initiative" className={linkClass("/our initiative")}>
          Our Initiative
        </Link>
        <Link href="/gallery" className={linkClass("/gallery")}>
          Gallery
        </Link>
        <Link href="/contact" className={linkClass("/contact")}>
          Contact Us
        </Link>
      </nav>

      {/* Donate Button */}
      <Link href="/donation" className={linkClass("/donation")}>
        <button className="bg-white text-blue-900 px-5 py-2 rounded-full hover:bg-blue-900 hover:text-white transition">
          Donate Now
        </button>
      </Link>
    </div>
  );
}
