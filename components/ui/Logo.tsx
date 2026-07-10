"use client";

import React from "react";

interface LogoProps {
  className?: string;
  variant?: "large" | "small";
}

export const Logo: React.FC<LogoProps> = ({ className = "", variant = "large" }) => {
  if (variant === "small") {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        {/* Small Icon */}
        <div className="relative w-14 h-14 mb-2">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Clipboard Background */}
            <rect x="25" y="15" width="60" height="80" rx="10" fill="#FFFFFF" stroke="#0EA5B7" strokeWidth="4" />
            <rect x="35" y="35" width="40" height="4" rx="2" fill="#E5E7EB" />
            <rect x="35" y="47" width="30" height="4" rx="2" fill="#E5E7EB" />
            <rect x="35" y="59" width="40" height="4" rx="2" fill="#E5E7EB" />
            
            {/* Clipboard Clip */}
            <path d="M45 15C45 11 50 10 55 10H65C70 10 75 11 75 15V18H45V15Z" fill="#0F2940" />
            <circle cx="60" cy="14" r="2" fill="#FFFFFF" />

            {/* Checklist Checkmarks */}
            <circle cx="83" cy="37" r="6" fill="#22C55E" />
            <path d="M80 37L82 39L86 35" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            
            <circle cx="83" cy="49" r="6" fill="#22C55E" />
            <path d="M80 49L82 51L86 47" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Pill (Capsule) - Rotated */}
            <g transform="rotate(-30, 45, 75)">
              {/* Dark Navy Half */}
              <path d="M30 65H42V85C42 88.3 39.3 91 36 91C32.7 91 30 88.3 30 85V65Z" fill="#0F2940" />
              {/* Teal Half */}
              <path d="M30 65H42V45C42 41.7 39.3 39 36 39C32.7 39 30 41.7 30 45V65Z" fill="#0EA5B7" />
              {/* White capsule belt */}
              <rect x="29" y="63" width="14" height="4" fill="#FFFFFF" rx="1" />
            </g>

            {/* Shield with Checkmark */}
            <g filter="drop-shadow(0px 2px 4px rgba(15, 41, 64, 0.15))">
              <path
                d="M70 65C70 65 70 70 70 75C70 85 85 92 85 92C85 92 100 85 100 75C100 70 100 65 100 65L85 60L70 65Z"
                fill="url(#smallShieldGrad)"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <path
                d="M80 76.5L83.5 80L90.5 73"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            
            <defs>
              <linearGradient id="smallShieldGrad" x1="85" y1="60" x2="85" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0EA5B7" />
                <stop offset="100%" stopColor="#097E8C" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Text */}
        <h2 className="text-xl font-bold tracking-tight select-none">
          <span className="text-primary">Medi</span>
          <span className="text-dark-navy">Approve</span>
        </h2>
        
        {/* Tagline */}
        <p className="text-[9px] font-medium tracking-[0.15em] text-dark-navy/60 uppercase mt-0.5 select-none">
          Review &bull; Approve &bull; Trust
        </p>
      </div>
    );
  }

  // Large variant for left panel
  return (
    <div className={`flex flex-col items-center w-full max-w-[280px] sm:max-w-[320px] ${className}`}>
      {/* Central Illustration Area */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
        <svg
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Clipboard Back Shadow */}
          <rect x="52" y="32" width="124" height="154" rx="20" fill="#EBF8FB" opacity="0.5" />
          
          {/* Clipboard Border/Main body */}
          <rect
            x="50"
            y="30"
            width="120"
            height="150"
            rx="18"
            fill="#FFFFFF"
            stroke="#0EA5B7"
            strokeWidth="6"
          />

          {/* Checklist Lines */}
          <rect x="75" y="75" width="70" height="6" rx="3" fill="#E5E7EB" />
          <rect x="75" y="98" width="55" height="6" rx="3" fill="#E5E7EB" />
          <rect x="75" y="121" width="70" height="6" rx="3" fill="#E5E7EB" />
          <rect x="75" y="144" width="45" height="6" rx="3" fill="#E5E7EB" />

          {/* Checklist Checkmarks */}
          <circle cx="160" cy="78" r="9" fill="#22C55E" />
          <path d="M155.5 78L158.5 81L164.5 75" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          <circle cx="160" cy="101" r="9" fill="#22C55E" />
          <path d="M155.5 101L158.5 104L164.5 98" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          <circle cx="160" cy="124" r="9" fill="#22C55E" />
          <path d="M155.5 124L158.5 127L164.5 121" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Clipboard Top Clip */}
          <path
            d="M90 30C90 20 100 18 110 18H130C140 18 150 20 150 30V36H90V30Z"
            fill="#0F2940"
          />
          <rect x="112" y="23" width="16" height="5" rx="2.5" fill="#0EA5B7" />

          {/* Pills (Capsules) - Rotated */}
          <g transform="rotate(-32, 85, 150)">
            {/* Dark Navy Half */}
            <path
              d="M65 130H85V165C85 170.5 80.5 175 75 175C69.5 175 65 170.5 65 165V130Z"
              fill="#0F2940"
            />
            {/* Teal Half */}
            <path
              d="M65 130H85V95C85 89.5 80.5 85 75 85C69.5 85 65 89.5 65 95V130Z"
              fill="#0EA5B7"
            />
            {/* Glossy reflection on Capsule */}
            <path
              d="M68 95V165"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Capsule center white separator band */}
            <rect x="63" y="127" width="24" height="6" fill="#FFFFFF" rx="2.5" />
          </g>

          {/* Shield with Medical Cross / Checkmark */}
          <g filter="drop-shadow(0px 8px 16px rgba(15, 41, 64, 0.18))">
            <path
              d="M140 135C140 135 140 145 140 155C140 175 170 190 170 190C170 190 200 175 200 155C200 145 200 135 200 135L170 125L140 135Z"
              fill="url(#largeShieldGrad)"
              stroke="#FFFFFF"
              strokeWidth="4"
            />
            {/* Thick White Checkmark */}
            <path
              d="M156 161.5L164 169.5L184 149.5"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          <defs>
            <linearGradient id="largeShieldGrad" x1="170" y1="125" x2="170" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0EA5B7" />
              <stop offset="100%" stopColor="#097E8C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text Block */}
      <div className="flex flex-col items-center mt-3 text-center w-full">
        {/* Brand Title */}
        <h1 className="text-3xl font-extrabold tracking-tight select-none mb-1">
          <span className="text-primary">Medi</span>
          <span className="text-dark-navy">Approve</span>
        </h1>
        
        {/* Tagline Box with Side Lines */}
        <div className="flex items-center justify-center w-full gap-3 mt-1.5 px-4">
          <div className="h-[2px] flex-1 bg-primary/45 rounded-full" />
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-dark-navy/70 uppercase whitespace-nowrap select-none">
            Review &bull; Approve &bull; Trust
          </span>
          <div className="h-[2px] flex-1 bg-primary/45 rounded-full" />
        </div>

        {/* Stylized Bottom Shadow Ellipse */}
        <div className="w-48 h-3.5 bg-primary/10 rounded-full blur-xs mt-6 mx-auto opacity-60" />
      </div>
    </div>
  );
};
