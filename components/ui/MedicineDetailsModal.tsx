"use client";

import React, { useEffect, useRef } from "react";
import { DetailedMedicine } from "@/lib/mockMedicines";
import { Button } from "./Button";
import { useMedicines } from "./MedicineContext";
import { getMedicineStatusLabel, isMedicineExpired } from "@/lib/medicine";

interface MedicineDetailsModalProps {
  isOpen: boolean;
  medicine: DetailedMedicine | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

interface AiAuditReport {
  success: boolean;
  isMock: boolean;
  systemInstruction: string;
  prompt: string;
  rawJson: {
    isCompliant: boolean;
    recommendation: "APPROVE" | "REJECT";
    reason: string;
    safetyConcerns: string[];
    extractedChemicals: string[];
    flags: string[];
  };
  statusCode: number;
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
  
  const [showAiAudit, setShowAiAudit] = React.useState(false);
  const [aiReport, setAiReport] = React.useState<AiAuditReport | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState("");

  useEffect(() => {
    if (!isOpen) {
      const handle = requestAnimationFrame(() => {
        setShowAiAudit(false);
        setAiReport(null);
        setAiError("");
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [isOpen]);

  const handleAiAudit = async () => {
    if (showAiAudit && aiReport) {
      setShowAiAudit(false);
      return;
    }
    
    setShowAiAudit(true);
    if (aiReport) return;
    
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-key": typeof window !== "undefined" ? sessionStorage.getItem("gemini_key") || "" : "",
        },
        body: JSON.stringify({
          medicineName: medicine?.name,
          sku: medicine?.batch || medicine?.id || "",
          formulation: medicine?.badges?.map(b => b.label).join(" ") || "",
          price: 19.99, // base catalog mock price
          expiryDate: medicine?.expiry ? (medicine.expiry.includes("/") ? `20${medicine.expiry.split("/")[1]}-${medicine.expiry.split("/")[0]}-01` : medicine.expiry) : "",
          vendor: medicine?.company,
          description: medicine?.description || "",
          composition: medicine?.composition || "",
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      setAiReport(data);
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : "Failed to run AI audit");
    } finally {
      setAiLoading(false);
    }
  };

  const [role] = React.useState<"ADMIN" | "USER">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.role === "ADMIN" ? "ADMIN" : "USER";
        } catch {}
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
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-primary tracking-wide">
                    {medicine.company}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {getMedicineStatusLabel(medicine.status)}
                  </span>
                </div>

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
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-extrabold text-dark-navy">
                      {formatDate(medicine.expiry)}
                    </span>
                    {isMedicineExpired(medicine.expiry) && (
                      <span className="text-[9px] font-extrabold text-danger bg-danger/10 border border-danger/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Expired
                      </span>
                    )}
                  </div>
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

          {showAiAudit && (
            <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-dark-navy flex items-center gap-1.5">
                  <svg className="w-4.5 h-4.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Compliance Audit Report
                </span>
                {aiReport && (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    aiReport.rawJson.isCompliant ? "bg-emerald-50 text-success border border-success/20" : "bg-red-50 text-danger border border-danger/20"
                  }`}>
                    {aiReport.rawJson.recommendation}
                  </span>
                )}
              </div>

              {aiLoading && (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-xs text-slate-500 font-bold">Querying AI model for audit verification...</span>
                </div>
              )}

              {aiError && (
                <div className="p-3 bg-red-50 text-danger text-xs font-semibold rounded-lg border border-danger/10">
                  {aiError}
                </div>
              )}

              {aiReport && !aiLoading && (
                <div className="space-y-4 text-xs">
                  <div className="bg-white border rounded-lg p-3 space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Audit Assessment Summary</span>
                    <p className="text-slate-600 font-semibold leading-relaxed">{aiReport.rawJson.reason}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border rounded-lg p-3 space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Chemical Extracts</span>
                      <div className="flex flex-wrap gap-1">
                        {aiReport.rawJson.extractedChemicals.map((chem: string, i: number) => (
                          <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] uppercase tracking-wider font-extrabold">
                            {chem}
                          </span>
                        ))}
                        {aiReport.rawJson.extractedChemicals.length === 0 && <span className="text-[10px] text-slate-400 italic">None</span>}
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-3 space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Compliance Flags</span>
                      <div className="flex flex-wrap gap-1">
                        {aiReport.rawJson.flags.map((flag: string, i: number) => (
                          <span key={i} className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] uppercase tracking-wider font-extrabold">
                            {flag}
                          </span>
                        ))}
                        {aiReport.rawJson.flags.length === 0 && <span className="text-[10px] text-slate-400 italic font-semibold">None</span>}
                      </div>
                    </div>
                  </div>

                  {aiReport.rawJson.safetyConcerns.length > 0 && (
                    <div className="bg-white border rounded-lg p-3 space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Safety Warning Alerts</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-500 font-medium leading-relaxed">
                        {aiReport.rawJson.safetyConcerns.map((warning: string, i: number) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-slate-900 text-slate-300 font-mono text-[9px] rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                      <span>Structured output schema payload</span>
                      <span>{aiReport.isMock ? "Mock Fallback Mode" : "Real Gemini Flash"}</span>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre max-h-36 max-w-full">
                      {JSON.stringify(aiReport.rawJson, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

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

          <div className="flex gap-3">
            <Button
              onClick={handleAiAudit}
              className="!w-full sm:!w-auto !py-2.5 !px-5 text-sm font-bold !bg-indigo-600 hover:!bg-indigo-700 active:scale-95 transition-all text-white rounded-xl flex items-center justify-center gap-1.5"
            >
              {aiLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
              AI Audit
            </Button>

            {role === "ADMIN" && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
