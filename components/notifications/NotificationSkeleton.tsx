import React from "react";

export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 py-2 select-none animate-pulse font-sans">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-5 bg-white border border-[#E2E8F0] rounded-[16px] flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2 text-left">
            <div className="h-4 bg-slate-100 rounded-sm w-1/4" />
            <div className="h-3.5 bg-slate-100 rounded-sm w-3/4" />
            <div className="h-3 bg-slate-100 rounded-sm w-1/5" />
          </div>
          <div className="w-20 h-6 bg-slate-100 rounded-full shrink-0" />
          <div className="w-16 h-9 bg-slate-100 rounded-sm shrink-0" />
        </div>
      ))}
    </div>
  );
};
