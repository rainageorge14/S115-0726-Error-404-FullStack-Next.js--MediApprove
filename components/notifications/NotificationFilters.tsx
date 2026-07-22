import React from "react";
import { Calendar } from "lucide-react";

interface NotificationFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeTab,
  setActiveTab,
  dateFilter,
  setDateFilter,
}) => {
  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "approvals", label: "Approvals" },
    { id: "rejections", label: "Rejections" },
    { id: "pending", label: "Pending" },
    { id: "system", label: "System" },
    { id: "security", label: "Security" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2.5 px-4 border-b border-[#E2E8F0] select-none font-sans text-left">
      {/* Tab Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full shrink-0 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#14B8C5] text-white shadow-sm shadow-[#14B8C5]/20"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Date Dropdown Filter */}
      <div className="relative flex items-center shrink-0 self-end md:self-auto">
        <Calendar className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="pl-8 pr-8 h-9 text-xs font-bold text-slate-600 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10 transition-all appearance-none cursor-pointer"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>
    </div>
  );
};
