import React from "react";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ className = "", size = "md" }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent border-[#7c5cfc] ${sizes[size]} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
}
