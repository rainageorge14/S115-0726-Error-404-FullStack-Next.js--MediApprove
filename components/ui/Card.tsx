"use client";

import React from "react";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  noPadding = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-border-color rounded-2xl shadow-[0_4px_25px_-5px_rgba(15,41,64,0.05)] overflow-hidden ${className}`}
      {...props}
    >
      {/* Optional Card Header */}
      {(title || subtitle || headerActions) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-color">
          <div>
            {title && (
              <h3 className="text-base font-extrabold text-dark-navy tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </div>
  );
};

Card.displayName = "Card";
