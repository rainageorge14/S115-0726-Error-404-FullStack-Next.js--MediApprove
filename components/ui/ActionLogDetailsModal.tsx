"use client";

import React, { useEffect, useRef } from "react";
import { ActionLog } from "./MedicineContext";


interface ActionLogDetailsModalProps {
  isOpen: boolean;
  log: ActionLog | null;
  onClose: () => void;
  onDownloadLog?: (log: ActionLog) => void;
}

export const ActionLogDetailsModal: React.FC<ActionLogDetailsModalProps> = ({
  isOpen,
  log,
  onClose,
  onDownloadLog,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key, prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !log) return null;

  const handleDownload = () => {
    if (onDownloadLog) {
      onDownloadLog(log);
    } else {
      // Create detailed log text
      const text = `
=========================================
      MEDIAPPROVE SYSTEM AUDIT LOG
=========================================
Log ID          : ${log.id}
Timestamp       : ${log.timestamp}
-----------------------------------------
ADMINISTRATOR DETAILS:
Admin Name      : ${log.adminName}
Admin ID        : ${log.adminId}
Admin Email     : ${log.adminEmail}
Admin Role      : ${log.adminRole}
-----------------------------------------
ACTION DETAILS:
Action Type     : ${log.action}
Remarks         : ${log.remarks}
Medicine Name   : ${log.medicineName || "N/A"}
Medicine ID     : ${log.medicineId || "N/A"}
Previous Status : ${log.previousStatus || "N/A"}
New Status      : ${log.newStatus || "N/A"}
-----------------------------------------
ENVIRONMENT / SESSION DETAILS:
IP Address      : ${log.ipAddress}
Browser         : ${log.browser}
Operating System: ${log.os}
Device / Agent  : ${log.device}
-----------------------------------------
ADDITIONAL NOTES:
${log.additionalNotes || "No additional notes provided for this action."}
=========================================
Security Registry: SIGNED & SECURED
`;
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Audit_Log_${log.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case "Approved":
        return "bg-success/10 text-success border border-success/20";
      case "Rejected":
        return "bg-danger/10 text-danger border border-danger/20";
      case "Login":
        return "bg-info/10 text-info border border-info/20";
      case "Logout":
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
      case "Profile Updated":
        return "bg-warning/10 text-warning border border-warning/20";
      case "Medicine Created":
        return "bg-purple-500/10 text-purple-600 border border-purple-500/20";
      default:
        return "bg-primary/10 text-primary border border-primary/20";
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-dark-navy/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-[16px] shadow-2xl border border-border-color relative animate-fade-in flex flex-col my-8 max-h-[calc(100vh-4rem)] md:max-h-[90vh] overflow-hidden"
      >
        {/* Close Button X */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-dark-navy bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 border border-border-color cursor-pointer z-10"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Header Layout */}
          <div className="border-b border-border-color pb-5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Audit Log</span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getActionBadgeClass(log.action)}`}>
                {log.action}
              </span>
            </div>
            <h2 id="modal-title" className="text-2xl font-extrabold text-dark-navy tracking-tight mt-2 flex items-center gap-2">
              Details for <span className="text-primary font-mono">{log.id}</span>
            </h2>
            <p className="text-sm font-semibold text-slate-400 mt-1">{log.timestamp}</p>
          </div>

          {/* Details Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section: Admin Info */}
            <div className="p-5 bg-slate-50 border border-border-color rounded-2xl space-y-3.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Administrator Details
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Name</span>
                  <span className="text-sm font-bold text-dark-navy">{log.adminName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Email Address</span>
                  <span className="text-sm font-semibold text-slate-600">{log.adminEmail}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase font-sans">Admin ID</span>
                    <span className="text-xs font-mono font-bold text-slate-500">{log.adminId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase text-right">Role</span>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase">
                      {log.adminRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Environment Details */}
            <div className="p-5 bg-slate-50 border border-border-color rounded-2xl space-y-3.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Session & Device Info
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">IP Address</span>
                  <span className="text-sm font-mono font-bold text-slate-700">{log.ipAddress}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Browser Client</span>
                  <span className="text-sm font-semibold text-slate-600">{log.browser}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Operating System</span>
                  <span className="text-sm font-semibold text-slate-600">{log.os}</span>
                </div>
              </div>
            </div>

            {/* Section: Action Details */}
            <div className="p-5 bg-slate-50 border border-border-color rounded-2xl space-y-3.5 md:col-span-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
                Audit Action Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Action Logged</span>
                  <span className="text-sm font-bold text-dark-navy">{log.remarks}</span>
                </div>

                {log.medicineName && log.medicineName !== "N/A" && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Associated Medicine</span>
                    <span className="text-sm font-bold text-primary">
                      {log.medicineName} <span className="text-xs text-slate-400 font-mono">({log.medicineId})</span>
                    </span>
                  </div>
                )}

                {log.previousStatus && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Previous Status</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                      {log.previousStatus}
                    </span>
                  </div>
                )}

                {log.newStatus && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">New Status</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      log.newStatus === "Approved" 
                        ? "bg-success/10 text-success border-success/20" 
                        : log.newStatus === "Rejected"
                        ? "bg-danger/10 text-danger border-danger/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    }`}>
                      {log.newStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Additional Notes */}
            <div className="p-5 bg-slate-50 border border-border-color rounded-2xl space-y-2 md:col-span-2">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-widest">Additional Audit Remarks / Notes</span>
              <p className="text-sm text-slate-600 leading-relaxed italic bg-white p-3.5 rounded-xl border border-border-color font-medium">
                {log.additionalNotes || "No extra metadata registered for this transaction."}
              </p>
            </div>

          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 bg-slate-50 border-t border-border-color flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-white border border-border-color hover:bg-slate-50 hover:text-dark-navy text-slate-500 transition-all duration-150 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all duration-150 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Log Report
          </button>
        </div>

      </div>
    </div>
  );
};
