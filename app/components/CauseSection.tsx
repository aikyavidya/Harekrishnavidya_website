"use client";

import React, { useState } from "react";
import { StaticImageData } from "next/image";

// Define the Cause interface
interface Cause {
  name: string;
  text: string;
  avatar?: StaticImageData;
  accent?: boolean;
}

// Causes data
const causes: Cause[] = [
  {
    name: "Annadaan",
    text: "No child should have to study on an empty stomach. Through Annadan, we serve warm, wholesome meals every day—bringing not just nourishment, but love, care, and the strength to dream. Every plate we serve carries hope, every meal we provide builds stronger foundations for education, and every child we feed gets one step closer to breaking the cycle of poverty through knowledge and opportunity.",
  },
  {
    name: "Teaching Moral Values",
    text: "In a world full of confusion, we guide young hearts with timeless values. Through simple stories, activities, and teachings from the Bhagavad Gita, we help children grow with character, faith, and purpose. These ancient wisdoms become modern life lessons, teaching compassion, integrity, respect for others, and the importance of righteous living in today's complex world.",
    accent: true,
  },
  {
    name: "Vidya Daan",
    text: "Education is the light that breaks the darkness of poverty. Through free tuition, we give children the chance to learn, grow, and build a future their parents only dreamed of. Knowledge becomes their inheritance, books become their bridges to opportunity, and every lesson learned transforms not just their lives, but entire families and communities for generations to come.",
  },
];

// Props interface for the component
interface CausesSectionProps {
  className?: string;
}

const CausesSection: React.FC<CausesSectionProps> = ({ className = "" }) => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number): void => {
    setExpandedCards((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      return newExpanded;
    });
  };

  // Function to truncate text to show approximately 1.5 lines
  const truncateToLines = (text: string): string => {
    // Approximate characters per line (adjust based on your design)
    const charsPerLine = 80;
    const maxChars = Math.floor(charsPerLine * 1.5);

    if (text.length <= maxChars) return text;

    // Find the last space before the cutoff to avoid cutting words
    const cutoff = text.lastIndexOf(" ", maxChars);
    return text.slice(0, cutoff > 0 ? cutoff : maxChars) + "...";
  };

  return (
    <section
      className={`relative ${className} `}
      role="region"
      aria-label="Our Causes"
    >
      {/* Vertical accent bar */}

      <div className="flex flex-col gap-6 ">
        {causes.map((cause, index) => {
          const isExpanded = expandedCards.has(index);
          const truncatedText = truncateToLines(cause.text);
          const shouldShowReadMore = cause.text !== truncatedText;

          return (
            <article
              key={`cause-${index}`}
              className={`flex items-start gap-5 p-5 rounded-lg border border-gray-100 bg-white shadow-sm transform transition-all duration-300 relative hover:shadow-lg
    ${cause.accent ? "scale-[1.01] shadow-lg" : ""}
    ${index === 1 ? "lg:translate-x-8" : ""} hover:scale-105`}
            >
              {/* Avatar */}

              {/* Text content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-2xl text-[#0b1630]">
                    {cause.name}
                  </h3>
                  {/* Quotation marks */}
                  <svg
                    width="26"
                    height="20"
                    viewBox="0 0 26 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="flex-shrink-0"
                  >
                    <path d="M6 2h4v6H6zM16 2h4v6h-4z" fill="#d1d5db" />
                  </svg>
                </div>

                <div className="mt-2">
                  <p
                    className="text-sm text-gray-600 leading-relaxed"
                    style={{
                      lineHeight: "1.5",
                      display: isExpanded ? "block" : "-webkit-box",
                      WebkitLineClamp: isExpanded ? "none" : "2",
                      WebkitBoxOrient: "vertical",
                      overflow: isExpanded ? "visible" : "hidden",
                      textOverflow: "ellipsis",
                    }}
                    id={`cause-text-${index}`}
                  >
                    {isExpanded ? cause.text : truncatedText}
                  </p>

                  {shouldShowReadMore && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="mt-2 text-[#fb923c] hover:text-[#002A42] text-sm font-medium transition-colors duration-200 flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-[#fb923c] focus:ring-opacity-50 rounded cursor-pointer"
                      aria-expanded={isExpanded}
                      aria-controls={`cause-text-${index}`}
                    >
                      {isExpanded ? (
                        <>
                          Read Less
                          <svg
                            className="w-4 h-4 transform rotate-180 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          Read More
                          <svg
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CausesSection;
