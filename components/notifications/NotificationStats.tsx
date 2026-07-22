import React from "react";
import { Card } from "@/components/ui/Card";
import { Bell, CheckCircle, XCircle, ShieldAlert } from "lucide-react";
import { Notification } from "@/components/ui/MedicineContext";

interface NotificationStatsProps {
  notifications: Notification[];
}

export const NotificationStats: React.FC<NotificationStatsProps> = ({ notifications }) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const approvedCount = notifications.filter((n) => n.type === "approval").length;
  const rejectedCount = notifications.filter((n) => n.type === "rejection").length;
  const securityCount = notifications.filter((n) => n.type === "security").length;

  const stats = [
    {
      label: "Unread Notifications",
      value: unreadCount,
      icon: <Bell className="w-5 h-5 text-[#14B8C5]" />,
      bgColor: "bg-[#14B8C5]/10",
      textColor: "text-[#14B8C5]",
    },
    {
      label: "Approved Notifications",
      value: approvedCount,
      icon: <CheckCircle className="w-5 h-5 text-[#16A34A]" />,
      bgColor: "bg-[#16A34A]/10",
      textColor: "text-[#16A34A]",
    },
    {
      label: "Rejected Notifications",
      value: rejectedCount,
      icon: <XCircle className="w-5 h-5 text-[#EF4444]" />,
      bgColor: "bg-[#EF4444]/10",
      textColor: "text-[#EF4444]",
    },
    {
      label: "Security Alerts",
      value: securityCount,
      icon: <ShieldAlert className="w-5 h-5 text-[#F59E0B]" />,
      bgColor: "bg-[#F59E0B]/10",
      textColor: "text-[#F59E0B]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] select-none mb-3.5 font-sans">
      {stats.map((s, i) => (
        <Card
          key={i}
          noPadding
          className="p-4 rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow duration-200 flex items-center justify-between text-left"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {s.label}
            </span>
            <span className="text-2xl font-black text-[#0F172A] block">
              {s.value}
            </span>
          </div>
          <div className={`p-3 rounded-2xl ${s.bgColor} ${s.textColor} shrink-0`}>
            {s.icon}
          </div>
        </Card>
      ))}
    </div>
  );
};
