"use client";

import React from "react";
import { Logo } from "./Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center flex-1 min-h-screen w-full p-4 bg-dark-navy sm:p-6 md:p-8 select-none">
      {/* Centered Auth Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_15px_50px_-15px_rgba(15,41,64,0.45)] overflow-hidden transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT PANEL */}
          <div className="hidden md:flex flex-col justify-between p-10 lg:p-14 bg-left-panel-bg text-left border-r border-border-color min-h-[620px]">
            {/* Top Headings */}
            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-bold tracking-wider text-primary uppercase">
                Admin Portal
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-dark-navy mt-1.5 leading-tight tracking-tight">
                Medicine Approval System
              </h1>
              <p className="text-slate-500 text-sm lg:text-base leading-relaxed mt-4 max-w-[280px] font-medium">
                Review and approve medicine listings submitted by our registered companies.
              </p>
            </div>

            {/* Central Badge Illustration */}
            <div className="flex items-center justify-center flex-1 my-6">
              <Logo variant="large" />
            </div>
          </div>

          {/* RIGHT PANEL CONTAINER */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 bg-white min-h-[500px] md:min-h-[620px]">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

AuthLayout.displayName = "AuthLayout";
