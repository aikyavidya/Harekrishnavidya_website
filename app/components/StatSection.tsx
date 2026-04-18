"use client";

import React, { useEffect, useState, useRef } from "react";
import { fetchStats } from "../../utils/api";
import { StaggerContainer, StaggerItem, FadeInOnScroll } from "./AnimationProvider";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  trigger: boolean; // new prop to control start
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 2, suffix = "", trigger }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!trigger) return; // Only run animation when triggered

    let startTime: number | null = null;

    const animate = (currentTime: number): void => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, trigger]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

interface Stat {
  _id: string;
  number: string;
  label: string;
}

export default function StatsSection() {
  const [inView, setInView] = useState(false);
  const [stats, setStats] = useState<Stat[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchStats();
      if (data && data.length > 0) {
        setStats(data);
      } else {
        // Fallback data if API fails or returns empty
        setStats([
          { _id: "1", number: "10+", label: "Years Of Foundation" },
          { _id: "2", number: "5000+", label: "Monthly Donors" },
          { _id: "3", number: "1.5K+", label: "Incredible Volunteers" },
          { _id: "4", number: "785", label: "Successful Campaigns" },
        ]);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Run only once
        }
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (stats.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative py-10 md:w-[1180px] mx-auto">
      {/* Dotted pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4">
        <FadeInOnScroll duration={0.8}>
          <StaggerContainer className="bg-white rounded-xl shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => {
            const numberValue = parseFloat(stat.number.replace(/[^\d.]/g, ""));
            const suffixValue = stat.number.replace(/[\d.,]/g, "");

            return (
              <StaggerItem
                key={stat._id}
                className="flex flex-col items-center justify-center py-8 px-4 relative hover-lift group"
              >
                {/* Vertical line on the right, only if not last card */}
                {idx < stats.length - 1 && (
                  <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 h-0 group-hover:h-20 transition-all duration-500 w-px bg-orange-400 group-hover:shadow-[0_0_8px_theme(colors.orange.400)]" style={{ height: "40px" }} />
                )}

                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                  <CountUp
                    end={numberValue}
                    duration={2.5}
                    suffix={suffixValue}
                    trigger={inView}
                  />
                </span>
                <span className="text-gray-500 text-sm md:text-base mt-1 text-center transition-colors group-hover:text-orange-600">
                  {stat.label}
                </span>
              </StaggerItem>
            );
          })}
          </StaggerContainer>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
