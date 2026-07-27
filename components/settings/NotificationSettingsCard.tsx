import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToggleSwitch } from "./ToggleSwitch";

export interface NotificationSettingsData {
  approvalAlerts: boolean;
  rejectedAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  systemUpdates: boolean;
}

interface NotificationSettingsCardProps {
  onChange: (data: NotificationSettingsData) => void;
}

export const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({ onChange }) => {
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [rejectedAlerts, setRejectedAlerts] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(false);
  const [systemUpdates, setSystemUpdates] = useState(true);

  const handleToggle = (key: keyof NotificationSettingsData, val: boolean) => {
    const updated: NotificationSettingsData = {
      approvalAlerts,
      rejectedAlerts,
      weeklyReports,
      monthlyReports,
      systemUpdates,
      [key]: val,
    };
    onChange(updated);
  };

  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] flex flex-col justify-between">
      <div className="border-b border-[#E2E8F0] pb-3 mb-4 select-none text-left">
        <h3 className="text-[22px] font-semibold text-[#0F172A] tracking-tight">Notifications</h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">Control alert parameters and compliance email reports</p>
      </div>

      <div className="space-y-2">
        <ToggleSwitch
          label="Approval Alerts"
          description="Notify immediately when a drug is approved"
          checked={approvalAlerts}
          onChange={(v) => { setApprovalAlerts(v); handleToggle("approvalAlerts", v); }}
        />
        <ToggleSwitch
          label="Rejected Alerts"
          description="Notify immediately when a drug is rejected"
          checked={rejectedAlerts}
          onChange={(v) => { setRejectedAlerts(v); handleToggle("rejectedAlerts", v); }}
        />
        <ToggleSwitch
          label="Weekly Reports"
          description="Generate and email compliance audit charts weekly"
          checked={weeklyReports}
          onChange={(v) => { setWeeklyReports(v); handleToggle("weeklyReports", v); }}
        />
        <ToggleSwitch
          label="Monthly Reports"
          description="Generate and email compliance audit charts monthly"
          checked={monthlyReports}
          onChange={(v) => { setMonthlyReports(v); handleToggle("monthlyReports", v); }}
        />
        <ToggleSwitch
          label="System Updates"
          description="Receive notices of software deployments & platform updates"
          checked={systemUpdates}
          onChange={(v) => { setSystemUpdates(v); handleToggle("systemUpdates", v); }}
        />
      </div>
    </Card>
  );
};
