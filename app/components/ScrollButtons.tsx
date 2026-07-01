"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollButton() {
  const [isAtTop, setIsAtTop] = useState(true);
  const scrollRequestIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      setIsAtTop(scrollTop + clientHeight < scrollHeight - 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRequestIdRef.current !== null) {
        cancelAnimationFrame(scrollRequestIdRef.current);
      }
    };
  }, []);

  // Custom smooth scroll with speed control
  const customScroll = (target: number, speed = 800) => {
    // Cancel any active animation frame
    if (scrollRequestIdRef.current !== null) {
      cancelAnimationFrame(scrollRequestIdRef.current);
    }

    // Temporarily disable CSS smooth scrolling to avoid conflict
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const start = window.scrollY;
    const distance = target - start;
    const startTime = performance.now();
 
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / speed, 1); // speed = duration in ms
      const easedProgress = progress * (2 - progress); // quadratic ease-out
      window.scrollTo(0, start + distance * easedProgress);
 
      if (progress < 1) {
        scrollRequestIdRef.current = requestAnimationFrame(step);
      } else {
        // Restore original scroll behavior once complete
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
        scrollRequestIdRef.current = null;
      }
    };
 
    scrollRequestIdRef.current = requestAnimationFrame(step);
  };
 
  const handleClick = () => {
    if (isAtTop) {
      customScroll(document.documentElement.scrollHeight, 800); // snappier scroll
    } else {
      customScroll(0, 800); // snappier scroll
    }
  };

  return (
    <div className="fixed right-4 bottom-10 z-50">
      <AnimatePresence>
        <motion.button
          key={isAtTop ? "down" : "up"}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ y: -4, scale: 1.1, boxShadow: "0 10px 25px -5px rgba(249, 109, 47, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className="bg-orange-400 text-white p-3 rounded-full shadow-lg transition-colors cursor-pointer block"
          aria-label={isAtTop ? "Scroll Down" : "Scroll Up"}
        >
          {isAtTop ? <ChevronDown size={24} className="animate-bounce-subtle" /> : <ChevronUp size={24} className="animate-bounce-subtle" />}
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
