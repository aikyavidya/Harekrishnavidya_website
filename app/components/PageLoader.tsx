"use client";
import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import logo from "../../public/images/hare krishna vidya logo-final update.png";

const DURATION_MS = 700;

interface PageLoaderContextType {
  startLoading: () => void;
}

const PageLoaderContext = createContext<PageLoaderContextType | undefined>(undefined);

export const usePageLoader = () => {
  const context = useContext(PageLoaderContext);
  if (!context) {
    throw new Error("usePageLoader must be used within a PageLoaderProvider");
  }
  return context;
};

export const PageLoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const startLoading = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    flushSync(() => {
      setIsLoading(true);
      setProgress(0);
    });
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setIsLoading(false), 100);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Trigger once on initial mount (covers hard reload / first visit)
  useEffect(() => {
    const timer = setTimeout(() => {
      startLoading();
    }, 0);
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageLoaderContext.Provider value={{ startLoading }}>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center gap-6">
          <Image src={logo} alt="Hare Krishna Movement Logo" width={140} height={126} className="object-contain w-[110px] h-auto md:w-[180px]" priority />
          <div className="w-48 h-2.5 md:w-96 md:h-3.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0279BC] rounded-full"
              style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
            />
          </div>
        </div>
      )}
      {children}
    </PageLoaderContext.Provider>
  );
};
