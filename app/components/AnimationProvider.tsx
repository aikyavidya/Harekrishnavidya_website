"use client";

import React, { ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface AnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

// Fade in on scroll component
export const FadeInOnScroll = ({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}: AnimationProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide in from direction component
interface SlideInProps extends AnimationProps {
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export const SlideIn = ({
  children,
  direction = "up",
  distance = 50,
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}: SlideInProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const getInitialState = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance };
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : getInitialState()}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger children container
interface StaggerContainerProps {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
  once?: boolean;
}

export const StaggerContainer = React.forwardRef<HTMLDivElement, StaggerContainerProps>(
  (
    {
      children,
      delayChildren = 0.1,
      staggerChildren = 0.15,
      className = "",
      once = true,
    },
    forwardedRef
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const isInView = useInView(localRef, { once, amount: 0.1 });

    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren,
          delayChildren,
        },
      },
    };

    return (
      <motion.div
        ref={setRefs}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerContainer.displayName = "StaggerContainer";

// Stagger item (must be used inside StaggerContainer)
export const StaggerItem = ({
  children,
  className = "",
  customVariants,
}: {
  children: ReactNode;
  className?: string;
  customVariants?: any;
}) => {
  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={customVariants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale in component
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
}: AnimationProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration, delay, ease: [0.175, 0.885, 0.32, 1.275] }} // Light spring effect
      className={className}
    >
      {children}
    </motion.div>
  );
};
