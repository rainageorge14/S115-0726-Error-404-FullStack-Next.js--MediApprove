"use client";

import React, { useEffect, useRef } from "react";
import { Medicine, useMedicines } from "./MedicineContext";
import { Button } from "./Button";

interface RejectedMedicineDetailsModalProps {
  isOpen: boolean;
  medicine: Medicine | null;
  onClose: () => void;
  onDownloadReport?: (medicine: Medicine) => void;
}

export const RejectedMedicineDetailsModal: React.FC<RejectedMedicineDetailsModalProps> = ({
  isOpen,
  medicine,
  onClose,
  onDownloadReport,
}) => {
  const { formatDate } = useMedicines();
  const modalRef = useRef<HTMLDivElement>(null);

  const formatUserAndRole = (val?: string) => {
    if (!val) return "Vinayak (Admin)";
    const clean = val.trim();
    if (clean === "Admin User") return "Vinayak (Admin)";
    if (clean === "Super Admin") return "Raina George (Super Admin)";
    if (clean === "Raina") return "Raina (Super Admin)";
    if (clean === "Vinayak") return "Vinayak (Admin)";
    if (clean.includes("(")) return clean;
    return `${clean} (Admin)`;
  };

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

  if (!isOpen || !medicine) return null;

  const handleDownload = () => {
    if (onDownloadReport) {
      onDownloadReport(medicine);
    } else {
      // Basic mock PDF download
      const text = `
=========================================
      MEDIAPPROVE REJECTED DRUG REPORT
=========================================
Medicine Name       : ${medicine.name || medicine.medicineName}
Manufacturer        : ${medicine.company}
Category            : ${medicine.category}
Batch Number        : ${medicine.batchNumber || medicine.batch}
License Number      : ${medicine.licenseNumber || "N/A"}
Expiry Date         : ${medicine.expiryDate || medicine.expiry}
Retail Price (MRP)  : INR ${medicine.mrp || medicine.price || "N/A"}
Manufacturing Date  : ${medicine.manufacturingDate || "N/A"}
-----------------------------------------
REJECTION DETAILS:
Rejected By         : ${medicine.rejectedBy || "Admin User"}
Rejected On         : ${medicine.rejectedAt || "N/A"}
Rejection Reason    : ${medicine.rejectionReason || "N/A"}
Admin Notes         : ${medicine.adminNotes || "N/A"}
-----------------------------------------
Composition:
${medicine.composition}

Dosage Instructions:
${medicine.dosage}

Description:
${medicine.description}
=========================================
Digital Signature. MediApprove Rejection Registry.
`;
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(medicine.name || medicine.medicineName).replace(/\s+/g, "_")}_Rejection_Report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case "Tablet":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Capsule":
        return "bg-purple-50 text-purple-600 border border-purple-100";
      case "Injection":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Syrup":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "Ointment":
        return "bg-pink-50 text-pink-600 border border-pink-100";
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

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Header Layout: Image & Primary Info */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-7 items-start">
            {/* Medicine Image */}
            <div className="w-full md:w-44 h-44 shrink-0 bg-left-panel-bg border border-border-color rounded-[16px] flex items-center justify-center p-4 relative overflow-hidden select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medicine.image || "/medicine-placeholder.png"}
                alt={medicine.name || medicine.medicineName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/medicine-placeholder.png";
                }}
              />
            </div>

            {/* Title & Core Fields */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                {/* Status Indicator Badge */}
                <div className="flex items-center gap-1.5 mb-1.5 select-none">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-danger/10 text-danger border border-danger/20 hover:scale-105 transition-transform duration-150">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejected
                  </span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${getCategoryClass(medicine.category)}`}>
                    {medicine.category}
                  </span>
                </div>

                <h3
                  id="modal-title"
                  className="text-2xl font-extrabold text-dark-navy tracking-tight"
                >
                  {medicine.name || medicine.medicineName}
                </h3>
                <span className="text-sm font-bold text-slate-500 block mt-1">
                  {medicine.company}
                </span>
              </div>

              {/* Manufacturing Details Grid */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Batch Number
                  </span>
                  <span className="text-sm font-extrabold text-dark-navy block mt-0.5">
                    {medicine.batchNumber || medicine.batch}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    License Number
                  </span>
                  <span className="text-sm font-bold text-slate-600 block mt-0.5 truncate" title={medicine.licenseNumber || "N/A"}>
                    {medicine.licenseNumber || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border-color" />

          {/* Rejection Cause Block */}
          <div className="p-4 bg-danger/5 border border-danger/10 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Rejection Reason
                </span>
                <span className="inline-flex px-2.5 py-0.5 text-[11px] font-extrabold rounded-md uppercase tracking-wide bg-danger text-white mt-1 select-none">
                  {medicine.rejectionReason}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Rejected By
                </span>
                <span className="text-xs font-bold text-slate-600 block mt-0.5">
                  {formatUserAndRole(medicine.rejectedBy)} on {medicine.rejectedAt}
                </span>
              </div>
            </div>

            {medicine.adminNotes && (
              <div className="pt-2.5 border-t border-danger/10">
                <span className="text-[10px] font-bold text-danger/80 uppercase tracking-widest block">
                  Admin Decision Notes
                </span>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-1">
                  {medicine.adminNotes}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-border-color" />

          {/* Technical Specs & Pricing Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                MRP (Price)
              </span>
              <span className="text-sm font-extrabold text-dark-navy block mt-0.5">
                ₹{medicine.mrp || medicine.price || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Mfg. Date
              </span>
              <span className="text-sm font-bold text-slate-600 block mt-0.5">
                {formatDate(medicine.manufacturingDate) || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Expiry Date
              </span>
              <span className="text-sm font-extrabold text-dark-navy block mt-0.5">
                {formatDate(medicine.expiryDate || medicine.expiry)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Submitted On
              </span>
              <span className="text-sm font-bold text-slate-600 block mt-0.5">
                {formatDate(medicine.createdAt || medicine.submittedOn)}
              </span>
            </div>
          </div>

          <div className="border-t border-border-color" />

          {/* Chemical Formulation & Dosage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Composition
              </span>
              <div className="text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-relaxed">
                {medicine.composition}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Dosage instructions
              </span>
              <div className="text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-relaxed">
                {medicine.dosage}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Description
            </span>
            <p className="text-sm text-slate-500 leading-relaxed">
              {medicine.description}
            </p>
          </div>
        </div>

        {/* Footer actions panel */}
        <div className="px-6 md:p-8 py-5 border-t border-border-color bg-slate-50/80 backdrop-blur-xs flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="!w-full sm:!w-auto !py-2.5 !px-6 text-sm font-bold border border-border-color rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-dark-navy"
          >
            Close
          </Button>

          <Button
            onClick={handleDownload}
            className="!w-full sm:!w-auto !py-2.5 !px-6 text-sm font-bold bg-primary hover:bg-primary-hover active:scale-95 transition-all text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
};
