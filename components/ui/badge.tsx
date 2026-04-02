"use client";

import * as React from "react";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>

export function Badge({ className = "", children, ...props }: BadgeProps) {
  const baseClass =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const defaultClass =
    "border-transparent bg-primary/10 text-primary";

  return (
    <span className={`${baseClass} ${defaultClass} ${className}`} {...props}>
      {children}
    </span>
  );
}


