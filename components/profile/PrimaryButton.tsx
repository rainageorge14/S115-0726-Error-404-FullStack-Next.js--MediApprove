import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      type="submit"
      className={`w-full h-[46px] flex items-center justify-center font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] rounded-[10px] transition-all duration-200 cursor-pointer shadow-xs select-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
