import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full text-left">
        <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 h-[42px] text-[15px] text-slate-800 bg-white border border-[#E2E8F0] rounded-[10px] outline-hidden transition-all duration-200 placeholder:text-slate-400 focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10 ${
            error ? "border-danger focus:border-danger focus:ring-danger/10" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-[10px] font-bold text-danger mt-0.5 select-none animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
