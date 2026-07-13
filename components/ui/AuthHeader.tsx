"use client";

import React from "react";
import { Logo } from "./Logo";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Small Logo Branding */}
      <div className="flex justify-center mb-6">
        <Logo variant="small" />
      </div>

      {/* Screen Heading & Subheading */}
      <div className="mb-6">
        <h3 className="text-2xl font-extrabold tracking-tight text-dark-navy sm:text-3xl">
          {title}
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 max-w-[280px] sm:max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

AuthHeader.displayName = "AuthHeader";
