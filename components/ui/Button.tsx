"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center w-full px-6 py-3.5 text-sm font-semibold tracking-wide rounded-xl cursor-pointer transition-all duration-200 outline-hidden focus:ring-3 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-hover active:scale-[0.98]",
    secondary: "bg-left-panel-bg text-primary hover:bg-left-panel-bg/80 active:scale-[0.98]",
    outline: "border border-border-color text-dark-navy hover:bg-gray-50 active:scale-[0.98]",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

Button.displayName = "Button";
