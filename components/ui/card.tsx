"use client";

import * as React from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = "", children, ...props }: CardProps) {
  const baseClass =
    "rounded-xl border bg-card text-card-foreground shadow-sm";
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>

export function CardContent({
  className = "",
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}


