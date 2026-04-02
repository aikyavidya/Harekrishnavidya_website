"use client";

import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export interface Stat {
  id: number;
  icon: string;
  number: string; // e.g. "5000+", "1.5k"
  label: string;
}

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  // Extract number and suffix
  const numericValue = parseFloat(stat.number.replace(/[^\d.]/g, ""));
  const suffix = stat.number.replace(/[\d.,]/g, "");
  const hasDecimal = stat.number.includes(".");

  return (
    <div
      ref={ref}
      className="flex items-center gap-6 min-w-[280px] transition-all duration-300"
    >
      {/* Emoji icon */}
      <div className="text-5xl">{stat.icon}</div>

      {/* Number and Label */}
      <div className="flex flex-col">
        <span className="text-4xl lg:text-5xl font-bold text-gray-800 leading-none">
          {inView && (
            <CountUp
              end={numericValue}
              duration={2}
              separator=","
              suffix={suffix}
              decimals={hasDecimal ? 1 : 0}
            />
          )}
        </span>
        <span className="text-lg text-gray-600 mt-1 font-medium">
          {stat.label}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
