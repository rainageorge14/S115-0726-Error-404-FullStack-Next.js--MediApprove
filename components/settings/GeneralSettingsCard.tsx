import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SettingInput } from "./SettingInput";

export interface GeneralSettingsData {
  org: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
}

interface GeneralSettingsCardProps {
  onSave: (data: GeneralSettingsData) => void;
}

export const GeneralSettingsCard: React.FC<GeneralSettingsCardProps> = ({ onSave }) => {
  const [org, setOrg] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("org") || "Netmeds Corporate";
    }
    return "Netmeds Corporate";
  });
  const [timezone, setTimezone] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("timezone") || "UTC+05:30";
    }
    return "UTC+05:30";
  });
  const [dateFormat, setDateFormat] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dateFormat") || "DD MMM YYYY";
    }
    return "DD MMM YYYY";
  });
  const [timeFormat, setTimeFormat] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("timeFormat") || "12h";
    }
    return "12h";
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "system";
    }
    return "system";
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ org, timezone, dateFormat, timeFormat, theme });
  };

  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] flex flex-col justify-between">
      <div className="border-b border-[#E2E8F0] pb-3 mb-4 select-none text-left">
        <h3 className="text-[22px] font-semibold text-[#0F172A] tracking-tight">General Settings</h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">Manage application preferences and default views</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingInput
            label="Organization"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />
          {/* Timezone */}
          <div className="flex flex-col gap-1 w-full text-left">
            <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
            >
              <option value="UTC+05:30">UTC+05:30 (IST)</option>
              <option value="UTC+00:00">UTC+00:00 (GMT)</option>
              <option value="UTC-05:00">UTC-05:00 (EST)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date format */}
          <div className="flex flex-col gap-1 w-full text-left">
            <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full px-3 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
            >
              <option value="DD MMM YYYY">DD MMM YYYY (e.g. 20 Jul 2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            </select>
          </div>

          {/* Time format */}
          <div className="flex flex-col gap-1 w-full text-left">
            <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">Time Format</label>
            <select
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="w-full px-3 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
            >
              <option value="12h">12-Hour (AM/PM)</option>
              <option value="24h">24-Hour</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          {/* Theme */}
          <div className="flex flex-col gap-1 w-full text-left">
            <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
            >
              <option value="system">System Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full h-11 flex items-center justify-center font-bold text-white bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] rounded-[10px] transition-all duration-200 cursor-pointer shadow-xs select-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Card>
  );
};
