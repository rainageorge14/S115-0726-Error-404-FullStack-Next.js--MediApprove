import React from "react";
import { Search } from "lucide-react";

interface NotificationSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const NotificationSearch: React.FC<NotificationSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex-1 max-w-md select-none font-sans text-left">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search notifications..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 h-[42px] text-xs font-semibold text-slate-700 bg-slate-50 border border-[#E2E8F0] rounded-[10px] focus:bg-white focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10 transition-all outline-hidden placeholder:text-slate-400"
      />
    </div>
  );
};
