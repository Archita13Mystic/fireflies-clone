import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isMultiline?: boolean;
  rows?: number;
}

const Input = forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ label, error, isMultiline = false, rows = 3, className = "", ...props }, ref) => {
    const inputStyles = `w-full rounded-md border border-[#2a2a3a] bg-[#16161e] px-3 py-2 text-sm text-white placeholder-[#505060] focus:border-[#7c5cfc] focus:outline-none transition-colors ${
      error ? "border-red-500" : ""
    } ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#9090a0] uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        {isMultiline ? (
          <textarea
            ref={ref}
            rows={rows}
            className={inputStyles}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref}
            className={inputStyles}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
