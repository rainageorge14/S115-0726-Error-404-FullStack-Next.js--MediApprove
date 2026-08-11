"use client";

import React, { forwardRef } from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  containerClassName?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, containerClassName = "", error, className = "", id, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          {/* Custom Checkbox Box */}
          <div className={`w-5 h-5 border rounded-md bg-white flex items-center justify-center shrink-0 transition-all duration-150 group-hover:border-primary peer-focus:ring-3 peer-focus:ring-primary/10 ${
            error ? "border-danger" : "border-border-color"
          } peer-checked:bg-primary peer-checked:border-primary peer-checked:[&_svg]:scale-100 ${className}`}>
            {/* Check icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3.5}
              stroke="white"
              className="w-3.5 h-3.5 scale-0 transition-transform duration-150"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 select-none group-hover:text-dark-navy transition-colors leading-tight">
            {label}
          </span>
        </label>
        {error && (
          <span className="text-xs font-semibold text-danger animate-shake mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
