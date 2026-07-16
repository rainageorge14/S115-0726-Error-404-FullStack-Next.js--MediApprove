import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToggleSwitch } from "./ToggleSwitch";

interface NotificationSettingsCardProps {
  onChange: (data: any) => void;
}

export const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({ onChange }) => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [browserNotifs, setBrowserNotifs] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [rejectedAlerts, setRejectedAlerts] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(false);
  const [systemUpdates, setSystemUpdates] = useState(true);

  const handleToggle = (key: string, val: boolean) => {
    let updated: any = {
      emailNotifs,
      browserNotifs,
      approvalAlerts,
      rejectedAlerts,
      weeklyReports,
      monthlyReports,
      systemUpdates,
    };
    updated[key] = val;
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
          label="Email Notifications"
          description="Receive automated summaries via email address"
          checked={emailNotifs}
          onChange={(v) => { setEmailNotifs(v); handleToggle("emailNotifs", v); }}
        />
        <ToggleSwitch
          label="Browser Notifications"
          description="Display live system alert banners on desktop"
          checked={browserNotifs}
          onChange={(v) => { setBrowserNotifs(v); handleToggle("browserNotifs", v); }}
        />
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
