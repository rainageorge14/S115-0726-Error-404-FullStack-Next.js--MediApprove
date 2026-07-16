import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToggleSwitch } from "./ToggleSwitch";

interface SystemPreferencesCardProps {
  onChange: (data: any) => void;
}

export const SystemPreferencesCard: React.FC<SystemPreferencesCardProps> = ({ onChange }) => {
  const [defaultDashboard, setDefaultDashboard] = useState("/dashboard");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30s");
  const [compactMode, setCompactMode] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);

  const handleUpdate = (key: string, val: any) => {
    let updated: any = {
      defaultDashboard,
      rowsPerPage,
      autoRefresh,
      refreshInterval,
      compactMode,
      enableAnimations,
    };
    updated[key] = val;
    onChange(updated);
  };

  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] flex flex-col justify-between">
      <div className="border-b border-[#E2E8F0] pb-3 mb-4 select-none text-left">
        <h3 className="text-[22px] font-semibold text-[#0F172A] tracking-tight">System Preferences</h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">Configure default tables page counts, dashboard auto refresh times, and view parameters</p>
      </div>

      <div className="space-y-4">
        {/* Default Dashboard */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">Default Dashboard View</label>
          <select
            value={defaultDashboard}
            onChange={(e) => { setDefaultDashboard(e.target.value); handleUpdate("defaultDashboard", e.target.value); }}
            className="w-full px-3 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
          >
            <option value="/dashboard">Overview Dashboard</option>
            <option value="/dashboard/pending">Pending Medicines list</option>
            <option value="/dashboard/action-logs">Audit Action Logs ledger</option>
          </select>
        </div>

        {/* Rows Per Table */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">Rows Per Table Page</label>
          <select
            value={rowsPerPage}
            onChange={(e) => { const v = parseInt(e.target.value); setRowsPerPage(v); handleUpdate("rowsPerPage", v); }}
            className="w-full px-3 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>

        {/* Auto Refresh */}
        <ToggleSwitch
          label="Auto Refresh Dashboard"
          description="Fetch statistics updates from server in the background"
          checked={autoRefresh}
          onChange={(v) => { setAutoRefresh(v); handleUpdate("autoRefresh", v); }}
        />

        {/* Refresh Interval */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">Refresh Interval</label>
          <select
            value={refreshInterval}
            onChange={(e) => { setRefreshInterval(e.target.value); handleUpdate("refreshInterval", e.target.value); }}
            className="w-full px-3 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
            disabled={!autoRefresh}
          >
            <option value="10s">10 Seconds</option>
            <option value="30s">30 Seconds</option>
            <option value="1m">1 Minute</option>
            <option value="5m">5 Minutes</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-1.5 pt-2">
          <ToggleSwitch
            label="Compact Mode"
            description="Reduce visual card padding & font sizes in lists"
            checked={compactMode}
            onChange={(v) => { setCompactMode(v); handleUpdate("compactMode", v); }}
          />
          <ToggleSwitch
            label="Enable Animations"
            description="Use hardware accelerated CSS transitions"
            checked={enableAnimations}
            onChange={(v) => { setEnableAnimations(v); handleUpdate("enableAnimations", v); }}
          />
        </div>
      </div>
    </Card>
  );
};
