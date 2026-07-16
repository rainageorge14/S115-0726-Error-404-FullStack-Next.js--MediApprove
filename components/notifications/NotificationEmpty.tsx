import React from "react";
import { Bell } from "lucide-react";

interface NotificationEmptyProps {
  onRefresh: () => void;
}

export const NotificationEmpty: React.FC<NotificationEmptyProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center select-none animate-fade-in font-sans">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
        <Bell className="w-6 h-6 text-slate-400" />
      </div>
      <h4 className="text-base font-bold text-[#0F172A]">No notifications found.</h4>
      <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">No new alerts match your search or filter configuration.</p>
      
      <button
        onClick={onRefresh}
        className="mt-6 px-5 py-2 text-xs font-bold text-slate-600 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-[#F8FAFC] active:scale-95 transition-all cursor-pointer select-none"
      >
        Refresh
      </button>
    </div>
  );
};
