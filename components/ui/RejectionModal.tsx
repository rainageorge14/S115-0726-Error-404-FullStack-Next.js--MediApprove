"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./Button";

interface RejectionModalProps {
  isOpen: boolean;
  medicineName: string;
  isLoading?: boolean;
  onConfirm: (reason: string, notes: string) => void;
  onCancel: () => void;
}

const REJECTION_REASONS = [
  "Incorrect Drug Information",
  "Missing Regulatory Approval",
  "Expired Product",
  "Duplicate Listing",
  "Pricing Error",
  "Incomplete Information",
  "Invalid Manufacturer",
  "Other",
];

export const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  medicineName,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState("");

  // Reset form states on open/close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setSelectedReason("");
        setCustomReason("");
        setAdminNotes("");
        setError("");
      }, 0);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
      onCancel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError("Please select a reason for rejection.");
      return;
    }
    if (selectedReason === "Other" && !customReason.trim()) {
      setError("Please specify the custom rejection reason.");
      return;
    }

    const finalReason = selectedReason === "Other" ? customReason.trim() : selectedReason;
    onConfirm(finalReason, adminNotes.trim());
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-navy/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-[16px] shadow-2xl border border-border-color p-6 relative animate-fade-in space-y-5"
      >
        {/* Header Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#EF4444]/10 text-[#EF4444] rounded-xl shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 id="reject-title" className="text-lg font-extrabold text-dark-navy tracking-tight">
              Reject Medicine
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to reject the listing for <strong className="text-dark-navy font-bold">{medicineName}</strong>? This action will move it to the Rejected folder.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 text-xs font-semibold text-danger bg-danger/10 border border-danger/20 rounded-xl animate-shake">
            {error}
          </div>
        )}

        {/* Rejection Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="reject-reason" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Rejection Reason <span className="text-danger">*</span>
            </label>
            <select
              id="reject-reason"
              value={selectedReason}
              onChange={(e) => {
                setSelectedReason(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2.5 text-sm text-dark-navy bg-white border border-border-color rounded-xl outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all select-none"
              disabled={isLoading}
            >
              <option value="" disabled>Select a reason...</option>
              {REJECTION_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Text Area for "Other" */}
          {selectedReason === "Other" && (
            <div className="space-y-1.5 animate-fade-in">
              <label htmlFor="custom-reason" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Specify Reason <span className="text-danger">*</span>
              </label>
              <textarea
                id="custom-reason"
                rows={2}
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  setError("");
                }}
                placeholder="Enter custom rejection reason..."
                className="w-full px-3.5 py-2.5 text-sm text-dark-navy bg-white border border-border-color rounded-xl outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder:text-slate-400"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Admin Notes */}
          <div className="space-y-1.5">
            <label htmlFor="admin-notes" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Additional Notes (Optional)
            </label>
            <textarea
              id="admin-notes"
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Provide context or instructions for the manufacturer..."
              className="w-full px-3.5 py-2.5 text-sm text-dark-navy bg-white border border-border-color rounded-xl outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder:text-slate-400"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isLoading}
              className="!py-2.5 text-xs font-bold border border-border-color text-slate-500 hover:bg-slate-50 rounded-xl bg-white w-full cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="!py-2.5 text-xs font-bold !bg-danger hover:!bg-red-600 active:scale-95 transition-all text-white rounded-xl w-full cursor-pointer"
            >
              Reject Medicine
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
