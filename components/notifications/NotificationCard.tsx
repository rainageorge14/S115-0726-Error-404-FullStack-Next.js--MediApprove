"use client";

import React, { useState } from "react";
import { Notification } from "@/components/ui/MedicineContext";
import { Check, X, Clock, User, ShieldAlert, BarChart3, MoreVertical, CheckCircle, Trash } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails?: (notification: Notification) => void;
  isChecked?: boolean;
  onCheckToggle?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
  onViewDetails,
  isChecked = false,
  onCheckToggle,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case "approval":
        return <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Check className="w-4 h-4" /></div>;
      case "rejection":
        return <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><X className="w-4 h-4" /></div>;
      case "pending":
        return <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Clock className="w-4 h-4" /></div>;
      case "login":
        return <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><User className="w-4 h-4" /></div>;
      case "security":
        return <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0"><ShieldAlert className="w-4 h-4" /></div>;
      case "report":
        return <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><BarChart3 className="w-4 h-4" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0"><Clock className="w-4 h-4" /></div>;
    }
  };

  const getStatusLabel = () => {
    switch (notification.type) {
      case "approval": return "Approved";
      case "rejection": return "Rejected";
      case "pending": return "Pending";
      case "security": return "Security";
      case "report": return "Report";
      default: return "System";
    }
  };

  const formatRelativeTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`px-4 py-2.5 flex items-center justify-between gap-4 border-b border-slate-100 hover:bg-slate-50/50 transition-all select-none font-sans ${
        !notification.isRead ? "bg-[#14B8C5]/5" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Bulk Select Checkbox */}
        {onCheckToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCheckToggle();
            }}
            className="shrink-0 p-1 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
              isChecked
                ? "bg-[#14B8C5] border-[#14B8C5] text-white"
                : "border-slate-300 bg-white"
            }`}>
              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        )}

        {/* Status Dot for Unread */}
        <div className="shrink-0 w-2.5 h-2.5 flex items-center justify-center">
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-[#14B8C5] shrink-0" />
          )}
        </div>

        {/* Circular Icon */}
        {getIcon()}

        {/* Message details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className={`text-sm text-[#0F172A] truncate ${!notification.isRead ? "font-bold" : "font-semibold"}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] font-bold text-slate-400">
              {getStatusLabel()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed truncate max-w-2xl">
            {notification.description}
          </p>
        </div>
      </div>

      {/* Right Column: Time parameter & View Button */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[11px] text-slate-400 font-medium">
          {formatRelativeTime(notification.createdAt)}
        </span>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(notification)}
            className="px-3 py-1 text-xs font-bold text-[#14B8C5] bg-[#14B8C5]/10 rounded-lg hover:bg-[#14B8C5]/20 active:scale-95 transition-all cursor-pointer"
          >
            View
          </button>
        )}

        {/* More Actions Trigger */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1 text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1.5 z-20 animate-fade-in text-left">
                {!notification.isRead && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onMarkRead(notification.id);
                    }}
                    className="w-full px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mark Read</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete(notification.id);
                  }}
                  className="w-full px-3 py-1.5 text-xs font-bold text-danger hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  <Trash className="w-3.5 h-3.5 text-danger/80" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
