"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { MedicineDetailsModal } from "@/components/ui/MedicineDetailsModal";
import { RejectionModal } from "@/components/ui/RejectionModal";
import { useMedicines, Medicine, Activity } from "@/components/ui/MedicineContext";
import { DetailedMedicine } from "@/lib/mockMedicines";

export default function DashboardHome() {
  const { medicines, activities, approveMedicine, rejectMedicine } = useMedicines();
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [role] = useState<"ADMIN" | "USER">(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("admin");
      if (storedAdmin) {
        try {
          const parsed = JSON.parse(storedAdmin);
          return parsed.role === "ADMIN" ? "ADMIN" : "USER";
        } catch (e) {}
      }
    }
    return "ADMIN";
  });

  // Rejection modal states
  const [rejectionMedicineId, setRejectionMedicineId] = useState<string | null>(null);
  const [rejectionMedicineName, setRejectionMedicineName] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Toast effect
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle Approve
  const handleApprove = async (id: string) => {
    const med = medicines.find((m) => m.id === id);
    if (!med) return;

    const success = await approveMedicine(id, "Admin User");
    if (success) {
      setToastMessage(`"${med.name}" has been approved successfully.`);
    } else {
      setToastMessage(`Failed to approve "${med.name}" due to verification error.`);
    }
    setSelectedMedicine(null);
  };

  // Open Rejection Modal
  const handleRejectClick = (id: string) => {
    const med = medicines.find((m) => m.id === id);
    if (med) {
      setRejectionMedicineId(id);
      setRejectionMedicineName(med.name);
    }
  };

  // Execute Rejection on confirmation
  const handleRejectConfirm = async (reason: string, notes: string) => {
    if (!rejectionMedicineId) return;
    setIsRejecting(true);

    try {
      const success = await rejectMedicine(rejectionMedicineId, "Admin User", reason, notes);
      if (success) {
        setToastMessage(`"${rejectionMedicineName}" has been rejected successfully.`);
        setSelectedMedicine(null); // Close details modal if open
      } else {
        setToastMessage(`Failed to reject "${rejectionMedicineName}".`);
      }
    } catch (err) {
      setToastMessage(`Error rejecting "${rejectionMedicineName}".`);
    } finally {
      setIsRejecting(false);
      setRejectionMedicineId(null);
      setRejectionMedicineName("");
    }
  };

  // Calculate dynamic stats
  const pendingCount = medicines.filter((m) => m.status === "pending").length;
  const approvedCount = medicines.filter((m) => m.status === "approved").length;
  const rejectedCount = medicines.filter((m) => m.status === "rejected").length;

  const stats = {
    pending: 128 - (15 - pendingCount),
    approved: 453 + (approvedCount - 15),
    rejected: 65 + rejectedCount,
  };

  // 5 pending medicines for home screen table listing
  const displayMedicines = medicines.filter((m) => m.status === "pending").slice(0, 5);

  return (
    <main className="flex-1 h-full max-h-[calc(100vh-75px)] p-3.5 md:p-4 flex flex-col justify-between overflow-hidden space-y-3 bg-[#F8FAFC]">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-dark-navy text-white rounded-xl shadow-2xl border border-primary/20 animate-fade-in select-none">
          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* LEVEL 1: Three Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">

        {/* Stat Card 1: Pending */}
        <Card className="!p-3 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Pending Medicines
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {stats.pending}
              </h3>
            </div>
            <div className="p-2 bg-[#0EA5B7]/10 text-primary rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
          </div>
          <Link
            href="/dashboard/pending"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-hover transition-colors mt-2"
          >
            View all pending &rarr;
          </Link>
        </Card>

        {/* Stat Card 2: Approved */}
        <Card className="!p-3 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Approved Medicines
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {stats.approved}
              </h3>
            </div>
            <div className="p-2 bg-[#22C55E]/10 text-[#22C55E] rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link
            href="/dashboard/approved"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#22C55E] hover:text-[#1ea850] transition-colors mt-2"
          >
            View all approved &rarr;
          </Link>
        </Card>

        {/* Stat Card 3: Rejected */}
        <Card className="!p-3 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Rejected Medicines
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {stats.rejected}
              </h3>
            </div>
            <div className="p-2 bg-[#EF4444]/10 text-[#EF4444] rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link
            href="/dashboard/rejected"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF4444] hover:text-[#dc3545] transition-colors mt-2"
          >
            View all rejected &rarr;
          </Link>
        </Card>

      </div>

      {/* LEVEL 2: Table + Activity Feed */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch overflow-hidden">

        {/* Table Column (col-span-2 / col-span-3 depending on role) */}
        <div className={`${role === "USER" ? "lg:col-span-3" : "lg:col-span-2"} flex flex-col min-h-0`}>
          <Card
            title="Pending Medicines"
            headerActions={
              role === "ADMIN" ? (
                <Link
                  href="/dashboard/pending"
                  className="py-1 px-3 text-[11px] font-bold rounded-lg cursor-pointer bg-primary text-white hover:bg-primary-hover active:scale-95 transition-all inline-flex items-center justify-center"
                >
                  View All
                </Link>
              ) : undefined
            }
            noPadding
            className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden shadow-xs"
          >
            {displayMedicines.length === 0 ? (
              <div className="p-6 text-center text-slate-400 font-semibold text-xs">
                No pending medicines to review.
              </div>
            ) : (
              <div className="overflow-x-auto flex-1 min-h-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border-color">
                      <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Medicine Name
                      </th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Company
                      </th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Submitted On
                      </th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {displayMedicines.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2 text-xs font-extrabold text-dark-navy">
                          {med.name}
                        </td>
                        <td className="px-4 py-2 text-xs font-medium text-slate-500">
                          {med.company}
                        </td>
                        <td className="px-4 py-2 text-xs font-medium text-slate-400">
                          {med.submittedOn}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            onClick={() => setSelectedMedicine(med)}
                            className="!py-1 !px-3 text-[11px] font-bold rounded-full text-white bg-[#0A8E9B] hover:bg-[#087a85] active:scale-95 transition-all !inline-flex !w-auto cursor-pointer"
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Activity Column */}
        {role === "ADMIN" && (
          <div className="flex flex-col min-h-0">
            <Card title="Recent Activity" noPadding className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden shadow-xs">
              <div className="divide-y divide-border-color overflow-y-auto flex-1">
                {activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="p-3 flex items-start gap-2.5 hover:bg-slate-50/40 transition-colors">
                    {act.action === "approved" && (
                      <div className="p-1 bg-[#22C55E]/10 text-[#22C55E] rounded-full shrink-0 mt-0.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {act.action === "rejected" && (
                      <div className="p-1 bg-[#EF4444]/10 text-[#EF4444] rounded-full shrink-0 mt-0.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    {act.action === "pending" && (
                      <div className="p-1 bg-amber-50 text-amber-500 rounded-full shrink-0 mt-0.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500 leading-tight">
                        <strong className="text-dark-navy font-bold">{act.medicineName}</strong>{" "}
                        {act.action === "approved" && "approved"}
                        {act.action === "rejected" && "rejected"}
                        {act.action === "pending" && "pending review"}{" "}
                        <span className="text-[10px] text-slate-400 block font-medium">by {act.user}</span>
                      </p>
                      <span className="text-[9px] font-bold text-slate-400 block mt-1 uppercase tracking-wide">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-border-color text-center bg-slate-50/30 shrink-0">
                <Link
                  href="/dashboard/action-logs"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-hover transition-colors"
                >
                  View all Activity &rarr;
                </Link>
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* LEVEL 3: Visual Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 shrink-0">

        {/* Donut Chart Card */}
        <Card title="Medicine Status Overview" className="!p-3">
          <div className="flex items-center justify-between gap-4 py-1 select-none">

            {/* SVG Donut Chart */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                <circle cx="60" cy="60" r="40" stroke="#E5E7EB" strokeWidth="18" fill="transparent" />
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  stroke="#22C55E"
                  strokeWidth="18"
                  fill="transparent"
                  strokeDasharray="163.28 251.2"
                  strokeDashoffset="0"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  stroke="#0EA5B7"
                  strokeWidth="18"
                  fill="transparent"
                  strokeDasharray="37.68 251.2"
                  strokeDashoffset="-163.28"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  stroke="#EF4444"
                  strokeWidth="18"
                  fill="transparent"
                  strokeDasharray="25.12 251.2"
                  strokeDashoffset="-200.96"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Total
                </span>
                <span className="text-base font-extrabold text-dark-navy block mt-0.5 leading-none">
                  {stats.approved + stats.pending + stats.rejected}
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#0EA5B7]" />
                  Pending
                </div>
                <span className="font-extrabold text-dark-navy">128 (15%)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  Approved
                </div>
                <span className="font-extrabold text-dark-navy">542 (65%)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  Rejected
                </div>
                <span className="font-extrabold text-dark-navy">76 (10%)</span>
              </div>
            </div>

          </div>
        </Card>

        {/* Line Chart Card */}
        <Card title="Submission Overview (This month)" className="!p-3">
          <div className="relative w-full h-[95px] mt-1 select-none">
            <svg viewBox="0 0 300 130" className="w-full h-full">
              <line x1="20" y1="20" x2="290" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="50" x2="290" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="80" x2="290" y2="80" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="110" x2="290" y2="110" stroke="#F1F5F9" strokeWidth="1" />

              <defs>
                <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5B7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0EA5B7" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              <path
                d="M 20 110 L 20 85 L 85 60 L 150 78 L 215 35 L 280 62 L 280 110 Z"
                fill="url(#chartFillGrad)"
              />

              <path
                d="M 20 85 L 85 60 L 150 78 L 215 35 L 280 62"
                fill="none"
                stroke="#0EA5B7"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="20" cy="85" r="4.5" fill="#0F2940" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="85" cy="60" r="4.5" fill="#0F2940" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="150" cy="78" r="4.5" fill="#0F2940" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="215" cy="35" r="4.5" fill="#0F2940" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="280" cy="62" r="4.5" fill="#0F2940" stroke="#FFFFFF" strokeWidth="1.5" />

              <text x="20" y="125" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">May 1</text>
              <text x="85" y="125" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">May 8</text>
              <text x="150" y="125" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">May 15</text>
              <text x="215" y="125" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">May 22</text>
              <text x="280" y="125" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">May 29</text>
            </svg>
          </div>
        </Card>

        {/* Top Submitting Companies Card */}
        <Card title="Top Submitting Companies" className="!p-3">
          <div className="flex flex-col gap-2 py-0.5">
            {[
              { name: "Sun Pharma", count: 120, pct: "w-[100%]", color: "bg-primary" },
              { name: "Cipla Ltd.", count: 98, pct: "w-[82%]", color: "bg-primary/80" },
              { name: "Dr. Reddy's", count: 76, pct: "w-[63%]", color: "bg-primary/60" },
            ].map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-dark-navy">
                  <span className="text-slate-500 font-semibold">{comp.name}</span>
                  <span>{comp.count} Subs</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${comp.pct} ${comp.color}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* DETAIL MODAL PANEL */}
      <MedicineDetailsModal
        isOpen={selectedMedicine !== null}
        medicine={selectedMedicine as unknown as DetailedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onApprove={handleApprove}
        onReject={handleRejectClick}
      />

      <RejectionModal
        isOpen={rejectionMedicineId !== null}
        medicineName={rejectionMedicineName}
        isLoading={isRejecting}
        onConfirm={handleRejectConfirm}
        onCancel={() => {
          setRejectionMedicineId(null);
          setRejectionMedicineName("");
        }}
      />

    </main>
  );
}
