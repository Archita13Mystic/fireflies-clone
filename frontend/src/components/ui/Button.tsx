import React from "react";
import Spinner from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none text-sm px-4 py-2";

  const variants = {
    primary: "bg-[#7c5cfc] hover:bg-[#6c4cf2] text-white",
    secondary: "bg-[#2a2a3a] hover:bg-[#35354a] text-white border border-[#2a2a3a]",
    danger: "bg-[#ef4444] hover:bg-[#dc2626] text-white",
    ghost: "bg-transparent hover:bg-[#252535] text-[#9090a0] hover:text-white",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Spinner className="mr-2 h-4 w-4 text-current" />}
      {children}
    </button>
  );
}
