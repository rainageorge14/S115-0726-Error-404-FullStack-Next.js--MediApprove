"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MedicineDetailsModal } from "@/components/ui/MedicineDetailsModal";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { RejectionModal } from "@/components/ui/RejectionModal";
import { useMedicines, Medicine } from "@/components/ui/MedicineContext";
import { DetailedMedicine } from "@/lib/mockMedicines";

export default function PendingMedicinesPage() {
  const { medicines, approveMedicine, rejectMedicine } = useMedicines();
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const itemsPerPage = 8;

  // Confirmation modal states
  const [confirmMedicineId, setConfirmMedicineId] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Rejection modal states
  const [rejectionMedicineId, setRejectionMedicineId] = useState<string | null>(null);
  const [rejectionMedicineName, setRejectionMedicineName] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Retrieve pending medicines from global shared state context
  const pendingList = medicines.filter((m) => m.status === "pending");

  // Unique companies list for filtering
  const companies = ["All", ...Array.from(new Set(pendingList.map((m) => m.company)))];

  // Open Rejection Modal
  const handleRejectClick = (id: string, name: string) => {
    setRejectionMedicineId(id);
    setRejectionMedicineName(name);
  };

  // Execute Rejection on confirmation
  const handleRejectConfirm = async (reason: string, notes: string) => {
    if (!rejectionMedicineId) return;
    setIsRejecting(true);

    try {
      const success = await rejectMedicine(rejectionMedicineId, "Admin User", reason, notes);
      if (success) {
        showToast("Medicine rejected successfully.");
        adjustPaginationAfterDelete();
        setSelectedMedicine(null); // Close details modal if open
      } else {
        showToast(`Failed to reject "${rejectionMedicineName}".`);
      }
    } catch (err) {
      showToast(`Error rejecting "${rejectionMedicineName}".`);
    } finally {
      setIsRejecting(false);
      setRejectionMedicineId(null);
      setRejectionMedicineName("");
    }
  };

  // Trigger Confirmation Modal for approval
  const handleApproveClick = (id: string) => {
    setConfirmMedicineId(id);
  };

  // Execute approval on confirmation
  const handleApproveConfirm = async () => {
    if (!confirmMedicineId) return;
    setIsApproving(true);

    const med = medicines.find((m) => m.id === confirmMedicineId);
    const name = med ? med.name : "";

    try {
      const success = await approveMedicine(confirmMedicineId, "Admin User");
      if (success) {
        showToast(`"${name}" approved successfully.`);
        adjustPaginationAfterDelete();
        setSelectedMedicine(null); // Close details modal if open
      } else {
        // Validation check failed - triggers for med-4 Aspirin
        showToast(`Compliance check failed for "${name}". Medicine remains pending.`);
      }
    } catch (err) {
      showToast(`Error approving "${name}". Internal Server Error.`);
    } finally {
      setIsApproving(false);
      setConfirmMedicineId(null);
    }
  };

  // Modal actions mapping
  const handleModalApprove = (id: string) => {
    handleApproveClick(id);
  };

  const handleModalReject = (id: string) => {
    const med = pendingList.find((m) => m.id === id);
    if (med) {
      handleRejectClick(id, med.name);
    }
  };

  // Toast utilities
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Clear toast effect
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const adjustPaginationAfterDelete = () => {
    const totalFiltered = filteredMedicines.length - 1;
    const maxPage = Math.ceil(totalFiltered / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  };

  // Filter & Search computation
  const filteredMedicines = pendingList.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompany =
      selectedCompanyFilter === "All" || med.company === selectedCompanyFilter;

    return matchesSearch && matchesCompany;
  });

  // Pagination computations
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  
  const paginatedMedicines = (() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMedicines.slice(startIndex, startIndex + itemsPerPage);
  })();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render Badge styling helper
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
    <main className="flex-1 h-full max-h-[calc(100vh-75px)] p-3.5 md:p-4 flex flex-col justify-between overflow-hidden space-y-3 bg-[#F8FAFC]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-dark-navy text-white rounded-xl shadow-2xl border border-primary/20 animate-fade-in select-none">
          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
        
        {/* Search Input wrapper */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search medicine or company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
            className="w-full pl-10 pr-4 py-2 text-xs text-dark-navy bg-white border border-border-color rounded-xl outline-hidden shadow-[0_2px_10px_rgba(15,41,64,0.02)] placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all duration-200"
          />
          {/* Magnifying Glass SVG Icon */}
          <div className="absolute left-3.5 top-2.5 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filter Dropdown Toggle Button */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border rounded-xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] transition-all cursor-pointer select-none ${
              isFilterOpen ? "border-primary text-primary" : "border-border-color hover:bg-slate-50"
            }`}
          >
            {/* Filter Slider SVG */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
            {selectedCompanyFilter !== "All" && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          {/* Filter Popover Dropdown */}
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute right-0 mt-2.5 w-56 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-4 animate-fade-in">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Filter by Company
                </span>
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                  {companies.map((comp) => (
                    <button
                      key={comp}
                      onClick={() => {
                        setSelectedCompanyFilter(comp);
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                        selectedCompanyFilter === comp
                          ? "bg-primary/10 text-primary"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* TABLE DATA LISTING CARD */}
      <Card noPadding className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden shadow-xs">
        {filteredMedicines.length === 0 ? (
          <div className="p-16 text-center text-slate-400 font-semibold text-sm">
            No pending medicine listings found matching your search.
          </div>
        ) : (
          <div className="flex flex-col flex-1 justify-between min-h-0 animate-fade-in">
            <div className="overflow-auto flex-1 min-h-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-border-color select-none">
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Medicine Details
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
                  {paginatedMedicines.map((med) => (
                    <tr
                      key={med.id}
                      className="hover:bg-slate-50/40 transition-colors duration-150"
                    >
                      {/* Column 1: Details and dosage badges */}
                      <td className="px-4 py-2">
                        <div className="flex flex-col gap-1">
                          <span
                            onClick={() => setSelectedMedicine(med)}
                            className="text-xs font-extrabold text-dark-navy hover:text-primary hover:underline cursor-pointer transition-colors"
                          >
                            {med.name}
                          </span>
                          <div className="flex flex-wrap gap-1 select-none">
                            {med.badges?.map((b, idx) => (
                              <span
                                key={idx}
                                className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded-md uppercase tracking-wide ${getBadgeClass(
                                  b.type
                                )}`}
                              >
                                {b.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Company */}
                      <td className="px-4 py-2 text-xs font-bold text-slate-500">
                        {med.company}
                      </td>

                      {/* Column 3: Submitted Date */}
                      <td className="px-4 py-2 text-xs font-medium text-slate-400">
                        {med.submittedOn}
                      </td>

                      {/* Column 4: Approve / Reject Action controls */}
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Review button */}
                          <Button
                            onClick={() => setSelectedMedicine(med)}
                            className="!py-1 !px-2.5 text-[11px] font-bold rounded-lg text-white bg-primary hover:bg-primary-hover active:scale-95 transition-all !inline-flex !w-auto cursor-pointer"
                          >
                            Review
                          </Button>

                          {/* Reject button (red outlined) */}
                          <Button
                            onClick={() => handleRejectClick(med.id, med.name)}
                            variant="outline"
                            className="!py-1 !px-2.5 text-[11px] font-bold rounded-lg !border-danger !text-danger bg-white hover:!bg-danger hover:!text-white active:scale-95 transition-all !inline-flex !w-auto cursor-pointer"
                          >
                            Reject
                          </Button>
                          
                          {/* Approve button (solid success green) */}
                          <Button
                            onClick={() => handleApproveClick(med.id)}
                            className="!py-1 !px-2.5 text-[11px] font-bold rounded-lg bg-[#22C55E] text-white hover:bg-[#1ea850] active:scale-95 transition-all !inline-flex !w-auto cursor-pointer"
                          >
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARD PAGINATION CONTROLS FOOTER */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border-color px-4 py-2 select-none bg-slate-50/20 shrink-0">
                <span className="text-xs font-semibold text-slate-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredMedicines.length)} of{" "}
                  {filteredMedicines.length} entries
                </span>

                <div className="flex items-center gap-1">
                  {/* Previous button */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-border-color text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-7 h-7 text-xs font-extrabold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-white shadow-xs"
                            : "border border-border-color text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-border-color text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <MedicineDetailsModal
        isOpen={selectedMedicine !== null}
        medicine={selectedMedicine as unknown as DetailedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
      />

      <ConfirmationModal
        isOpen={confirmMedicineId !== null}
        title="Approve Medicine"
        message="Are you sure you want to approve this medicine listing?"
        isLoading={isApproving}
        onConfirm={handleApproveConfirm}
        onCancel={() => setConfirmMedicineId(null)}
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
