import React from "react";
import { X, Calendar, Clock, ShieldCheck, UserCheck, Briefcase, FileText } from "lucide-react";
import { Notification } from "@/components/ui/MedicineContext";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notification,
}) => {
  if (!isOpen || !notification) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return "N/A";
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    } catch {
      return "N/A";
    }
  };

  const getStatusBadge = () => {
    switch (notification.type) {
      case "approval":
        return <span className="px-2.5 py-1 text-xs font-bold text-[#16A34A] bg-[#16A34A]/10 rounded-full">Approved</span>;
      case "rejection":
        return <span className="px-2.5 py-1 text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 rounded-full">Rejected</span>;
      case "pending":
        return <span className="px-2.5 py-1 text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 rounded-full">Pending Review</span>;
      case "security":
        return <span className="px-2.5 py-1 text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 rounded-full">Security Alert</span>;
      case "report":
        return <span className="px-2.5 py-1 text-xs font-bold text-[#A855F7] bg-[#A855F7]/10 rounded-full">Report Ready</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-full">System</span>;
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-dark-navy/60 backdrop-blur-xs transition-opacity animate-fade-in select-none"
        onClick={onClose}
      />

      {/* Slide-out drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col justify-between animate-slide-in select-none font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-base font-bold text-[#0F172A] tracking-tight">Notification Details</h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Audit log parameters ledger</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-dark-navy hover:bg-slate-50 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content details body scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left no-scrollbar">
          
          {/* Action Header Card */}
          <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-2xl flex items-center gap-3">
            <div className="shrink-0 p-2.5 bg-white border border-[#E2E8F0] rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A] leading-tight">{notification.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{notification.description}</p>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-4">
            
            {/* Medicine Name */}
            {notification.medicineName && notification.medicineName !== "N/A" && (
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Medicine Name</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{notification.medicineName}</span>
                </div>
              </div>
            )}

            {/* Submitted By / Company */}
            {notification.type === "approval" || notification.type === "rejection" ? (
              <div className="flex items-start gap-3 pt-3 border-t border-[#F1F5F9]">
                <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Company / Manufacturer</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">Netmeds Pharmaceuticals Ltd.</span>
                </div>
              </div>
            ) : null}

            {/* Admin Name */}
            {notification.adminName && notification.adminName !== "N/A" && (
              <div className="flex items-start gap-3 pt-3 border-t border-[#F1F5F9]">
                <UserCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Action Taken By</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{notification.adminName}</span>
                </div>
              </div>
            )}

            {/* Action Type */}
            <div className="flex items-start gap-3 pt-3 border-t border-[#F1F5F9]">
              <div className="w-4 h-4 text-slate-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Status</span>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>
            </div>

            {/* Audit Reference ID */}
            <div className="flex items-start gap-3 pt-3 border-t border-[#F1F5F9]">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Reference ID</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block font-mono">REF-{notification.id.toUpperCase()}</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#F1F5F9]">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Date</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{formatDate(notification.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Time</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{formatTime(notification.createdAt)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 flex items-center justify-center font-bold text-slate-500 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-slate-50 cursor-pointer active:scale-95 transition-all"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </>
  );
};
