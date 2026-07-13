"use client";

import React from "react";

export const AuthFooter: React.FC = () => {
  return (
    <div className="mt-6 text-center select-none">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Authorized Access Only
      </span>
    </div>
  );
};

AuthFooter.displayName = "AuthFooter";
