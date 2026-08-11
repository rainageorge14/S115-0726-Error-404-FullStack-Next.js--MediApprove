"use client";

import React, { useEffect, useRef } from "react";
import { DetailedMedicine } from "@/lib/mockMedicines";
import { Button } from "./Button";
import { useMedicines } from "./MedicineContext";

interface MedicineDetailsModalProps {
  isOpen: boolean;
  medicine: DetailedMedicine | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const MedicineDetailsModal: React.FC<MedicineDetailsModalProps> = ({
  isOpen,
  medicine,
  onClose,
  onApprove,
  onReject,
}) => {
  const { formatDate } = useMedicines();
  const modalRef = useRef<HTMLDivElement>(null);
  const [role] = React.useState<"ADMIN" | "USER">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.role === "ADMIN" ? "ADMIN" : "USER";
        } catch (e) {}
      }
    }
    return "ADMIN";
  });

  // Close on Escape key press, lock body scroll when open
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

  // Close on clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !medicine) return null;

  // Badge class helper
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "dosage":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "form":
        return "bg-purple-50 text-purple-600 border border-purple-100";
      case "route":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
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

        {/* Scrollable Contents Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Header Layout: Image & Primary Info */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-7 items-start">
            {/* Medicine Image Container */}
            <div className="w-full md:w-44 h-44 shrink-0 bg-left-panel-bg border border-border-color rounded-[16px] flex items-center justify-center p-4 relative overflow-hidden select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medicine.image || "/medicine-placeholder.png"}
                alt={medicine.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/medicine-placeholder.png";
                }}
              />
            </div>

            {/* Title Block & Grid info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3
                  id="modal-title"
                  className="text-2xl font-extrabold text-dark-navy tracking-tight"
                >
                  {medicine.name}
                </h3>
                <span className="text-sm font-bold text-primary tracking-wide block mt-1">
                  {medicine.company}
                </span>

                {/* Subtitle Badges */}
                {medicine.badges && medicine.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 select-none">
                    {medicine.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${getBadgeClass(
                          badge.type
                        )}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Batch & Expiry Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Batch Number
                  </span>
                  <span className="text-sm font-extrabold text-dark-navy block mt-1">
                    {medicine.batch}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Expiry Date
                  </span>
                  <span className="text-sm font-extrabold text-dark-navy block mt-1">
                    {formatDate(medicine.expiry)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border-color" />

          {/* Composition Block */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Composition
            </span>
            <div className="text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-relaxed">
              {medicine.composition}
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Description
            </span>
            <p className="text-sm text-slate-500 leading-relaxed">
              {medicine.description}
            </p>
          </div>

          <div className="border-t border-border-color" />

          {/* Documents & Download Links */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Documents & Certifications
            </span>

            {medicine.documents && medicine.documents.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {medicine.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 border border-border-color rounded-xl bg-white hover:bg-slate-50/50 transition-colors duration-150"
                  >
                    {/* Document Icon & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-dark-navy truncate block">
                          {doc.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                          {doc.size}
                        </span>
                      </div>
                    </div>

                    {/* Download link button */}
                    <a
                      href={doc.url}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center p-2 text-primary hover:text-primary-hover hover:bg-primary/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                      aria-label={`Download ${doc.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No attachments provided.</p>
            )}
          </div>
        </div>

        {/* Footer actions panel */}
        <div className="px-6 md:p-8 py-5 border-t border-border-color bg-slate-50/80 backdrop-blur-xs flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between sm:justify-end gap-3 shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="!w-full sm:!w-auto !py-2.5 !px-5 text-sm font-bold border border-border-color rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-dark-navy"
          >
            Cancel
          </Button>

          {role === "ADMIN" && (
            <div className="flex gap-3">
              <Button
                onClick={() => onReject(medicine.id)}
                className="!w-full sm:!w-auto !py-2.5 !px-6 text-sm font-bold !bg-danger hover:!bg-red-600 active:scale-95 transition-all text-white rounded-xl"
              >
                Reject
              </Button>
              <Button
                onClick={() => onApprove(medicine.id)}
                className="!w-full sm:!w-auto !py-2.5 !px-6 text-sm font-bold !bg-success hover:!bg-emerald-600 active:scale-95 transition-all text-white rounded-xl"
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
