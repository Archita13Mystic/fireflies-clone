import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning";
  className?: string;
}

export default function Badge({ children, variant = "primary", className = "" }: BadgeProps) {
  const baseStyle = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors";
  
  const variants = {
    primary: "bg-[#7c5cfc]/10 text-[#7c5cfc] border-[#7c5cfc]/20",
    secondary: "bg-[#2a2a3a] text-[#9090a0] border-[#2a2a3a]",
    success: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20",
    warning: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  };

  return <span className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</span>;
}
