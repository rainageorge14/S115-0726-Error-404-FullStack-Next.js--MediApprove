"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { RejectedMedicineDetailsModal } from "@/components/ui/RejectedMedicineDetailsModal";
import { useMedicines, Medicine } from "@/components/ui/MedicineContext";
import { useRouter } from "next/navigation";

const getExportTimestamp = () => Date.now();

export default function RejectedMedicinesPage() {
  const router = useRouter();
  const { medicines, formatDate } = useMedicines();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("admin");
      if (storedAdmin) {
        try {
          const parsed = JSON.parse(storedAdmin);
          if (parsed.role !== "ADMIN") {
            router.push("/dashboard");
          }
        } catch {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Filtering & Sorting UI States
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<"name" | "price" | "rejectedDate">("rejectedDate");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Pagination UI State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Retrieve rejected medicines from global shared state context
  const rejectedList = medicines.filter((m) => m.status === "rejected");

  // Unique Categories and Companies lists derived from current rejected list
  const categories = ["All", ...Array.from(new Set(rejectedList.map((m) => m.category)))];
  const companies = ["All", ...Array.from(new Set(rejectedList.map((m) => m.company)))];

  // Toast effect
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Helper: Export current filtered list as CSV
  const handleExportCSV = () => {
    if (filteredMedicines.length === 0) {
      showToast("No data available to export.");
      return;
    }

    const headers = [
      "Medicine Name",
      "Company",
      "Category",
      "Batch Number",
      "Price (INR)",
      "Rejected By",
      "Rejected Date",
      "Rejection Reason",
      "Expiry Date",
      "Admin Notes",
    ];

    const rows = filteredMedicines.map((med) => [
      `"${med.name || med.medicineName}"`,
      `"${med.company}"`,
      `"${med.category}"`,
      `"${med.batchNumber || med.batch}"`,
      med.price || med.mrp || 0,
      `"${med.rejectedBy || "Admin User"}"`,
      `"${med.rejectedAt || med.createdAt}"`,
      `"${med.rejectionReason || "N/A"}"`,
      `"${med.expiryDate || med.expiry}"`,
      `"${med.adminNotes || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rejected_Medicines_Report_${getExportTimestamp()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV report exported successfully.");
  };

  // Helper: Download single PDF report mock action
  const handleDownloadReport = (med: Medicine) => {
    const text = `
=========================================
      MEDIAPPROVE REJECTED DRUG REPORT
=========================================
Drug Name      : ${med.name || med.medicineName}
Manufacturer   : ${med.company}
Category       : ${med.category}
Batch Number   : ${med.batchNumber || med.batch}
License No.    : ${med.licenseNumber || "N/A"}
Rejected By    : ${med.rejectedBy || "Admin User"}
Rejection Date : ${med.rejectedAt || med.createdAt}
Rejection Reason: ${med.rejectionReason || "N/A"}
Expiries On    : ${med.expiryDate || med.expiry}
Retail Price   : INR ${med.price || med.mrp || "N/A"}
Notes          : ${med.adminNotes || "N/A"}
=========================================
Status: DISAPPROVED - INELIGIBLE FOR CATALOGUE
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rejection_Report_${(med.name || med.medicineName).replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded rejection report for "${med.name || med.medicineName}".`);
  };

  // Optional: Restore capability to pending list
  const handleRestore = (med: Medicine) => {
    // We can simulate updating status in client since context doesn't have custom restore function
    // But to respect the global context, we will just show a toast for this optional action
    // Or we can let it be a placeholder. Let's make it show a premium notice.
    showToast(`Restore action triggered for "${med.name || med.medicineName}". In production, this returns the drug to the pending queue.`);
  };

  // Filter Computation
  const filteredMedicines = rejectedList.filter((med) => {
    const nameStr = (med.name || med.medicineName || "").toLowerCase();
    const companyStr = (med.company || "").toLowerCase();
    const batchStr = (med.batchNumber || med.batch || "").toLowerCase();
    const reasonStr = (med.rejectionReason || "").toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      nameStr.includes(searchLower) ||
      companyStr.includes(searchLower) ||
      batchStr.includes(searchLower) ||
      reasonStr.includes(searchLower);

    const matchesCategory =
      selectedCategoryFilter === "All" || med.category === selectedCategoryFilter;

    const matchesCompany =
      selectedCompanyFilter === "All" || med.company === selectedCompanyFilter;

    return matchesSearch && matchesCategory && matchesCompany;
  });

  // Sort Computation
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      const nameA = a.name || a.medicineName || "";
      const nameB = b.name || b.medicineName || "";
      comparison = nameA.localeCompare(nameB);
    } else if (sortField === "price") {
      const priceA = a.price || a.mrp || 0;
      const priceB = b.price || b.mrp || 0;
      comparison = priceA - priceB;
    } else if (sortField === "rejectedDate") {
      const dateA = new Date(a.rejectedAt || a.createdAt).getTime();
      const dateB = new Date(b.rejectedAt || b.createdAt).getTime();
      comparison = (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Pagination Computation
  const totalPages = Math.ceil(sortedMedicines.length / itemsPerPage);
  const paginatedMedicines = (() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedMedicines.slice(startIndex, startIndex + itemsPerPage);
  })();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Date constants to filter today's actions
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // e.g. "15 Jul 2026"

  // Dynamic Statistics Calculations
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const totalRejectedCount = rejectedList.length;

  const rejectedTodayCount = rejectedList.filter((m) => {
    if (!m.rejectedAt) return false;
    const date = new Date(m.rejectedAt);
    return !isNaN(date.getTime()) && date.toDateString() === now.toDateString();
  }).length;

  const rejectedThisWeekCount = rejectedList.filter((m) => {
    if (!m.rejectedAt) return false;
    const date = new Date(m.rejectedAt);
    return !isNaN(date.getTime()) && date >= oneWeekAgo;
  }).length;

  // Last rejected medicine details
  const sortedRejectedByDate = [...rejectedList].sort((a, b) => {
    const dateA = new Date(a.rejectedAt || a.createdAt).getTime();
    const dateB = new Date(b.rejectedAt || b.createdAt).getTime();
    return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
  });
  
  const lastRejectedItem = sortedRejectedByDate[0];
  const lastRejectionText = lastRejectedItem ? (lastRejectedItem.name || lastRejectedItem.medicineName) : "N/A";
  const lastRejectionDate = lastRejectedItem ? lastRejectedItem.rejectedAt : "N/A";

  const getCategoryBadgeClass = (category: string) => {
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

  const getReasonBadgeClass = (reason: string) => {
    switch (reason) {
      case "Expired Product":
        return "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors";
      case "Missing Regulatory Approval":
      case "Missing License":
        return "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors";
      case "Incorrect Drug Information":
        return "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors";
      case "Duplicate Listing":
        return "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors";
      case "Pricing Error":
        return "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors";
      case "Incomplete Information":
      case "Incomplete Details":
        return "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors";
      case "Invalid Manufacturer":
        return "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors";
      default:
        return "bg-red-50/70 text-red-600 border border-red-150 hover:bg-red-50 transition-colors";
    }
  };

  return (
    <main className="flex-1 h-full max-h-[calc(100vh-75px)] p-3.5 md:p-4 flex flex-col justify-between overflow-hidden space-y-3 bg-[#F8FAFC]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-dark-navy text-white rounded-xl shadow-2xl border border-primary/20 animate-fade-in select-none max-w-sm md:max-w-md">
          <svg className="w-5 h-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* STATISTICS CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 shrink-0">
        
        {/* Card 1: Total Rejected */}
        <Card className="!p-3.5 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Total Rejected
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {totalRejectedCount}
              </h3>
            </div>
            <div className="p-2.5 bg-danger/10 text-danger rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 block mt-2.5">
            Disapproved medical listings
          </span>
        </Card>

        {/* Card 2: Rejected Today */}
        <Card className="!p-3.5 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Rejected Today
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {rejectedTodayCount}
              </h3>
            </div>
            <div className="p-2.5 bg-danger/5 text-danger rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-bold text-danger block mt-2.5">
            Synced from compliance logs
          </span>
        </Card>

        {/* Card 3: Rejected This Week */}
        <Card className="!p-3.5 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Rejected This Week
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {rejectedThisWeekCount}
              </h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 block mt-2.5">
            Current calendar week
          </span>
        </Card>

        {/* Card 4: Latest Rejection */}
        <Card className="!p-3.5 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block truncate">
                Latest Rejection
              </span>
              <h3 className="text-base font-extrabold text-dark-navy mt-1 tracking-tight truncate" title={lastRejectionText}>
                {lastRejectionText}
              </h3>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0 ml-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 block mt-2.5 truncate">
            Rejected on {lastRejectionDate}
          </span>
        </Card>

      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shrink-0">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search by medicine name, company, batch number or rejection reason..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-xs text-dark-navy bg-white border border-border-color rounded-xl outline-hidden shadow-[0_2px_10px_rgba(15,41,64,0.02)] placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all duration-200 focus:shadow-md"
          />
          <div className="absolute left-3.5 top-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Filters Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFilterOpen((prev) => !prev);
                setIsSortOpen(false);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold border rounded-xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] transition-all cursor-pointer select-none active:scale-95 ${
                isFilterOpen || selectedCategoryFilter !== "All" || selectedCompanyFilter !== "All"
                  ? "border-primary text-primary bg-primary/5 font-extrabold"
                  : "border-border-color text-slate-600 bg-white hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filter
              {(selectedCategoryFilter !== "All" || selectedCompanyFilter !== "All") && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>

            {/* Filters Dropdown Popover */}
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-64 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-5 animate-fade-in space-y-4">
                  
                  {/* Category Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Drug Category
                    </label>
                    <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategoryFilter(cat);
                            setCurrentPage(1);
                          }}
                          className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                            selectedCategoryFilter === cat
                              ? "bg-primary/10 text-primary font-extrabold"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Company Filter */}
                  <div className="border-t border-slate-100 pt-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Manufacturer
                    </label>
                    <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
                      {companies.map((comp) => (
                        <button
                          key={comp}
                          onClick={() => {
                            setSelectedCompanyFilter(comp);
                            setCurrentPage(1);
                          }}
                          className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                            selectedCompanyFilter === comp
                              ? "bg-primary/10 text-primary font-extrabold"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {comp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  {(selectedCategoryFilter !== "All" || selectedCompanyFilter !== "All") && (
                    <button
                      onClick={() => {
                        setSelectedCategoryFilter("All");
                        setSelectedCompanyFilter("All");
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                      className="w-full py-2 text-center text-xs font-bold text-danger bg-danger/5 hover:bg-danger/10 rounded-xl transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sort By Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsFilterOpen(false);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold border rounded-xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] transition-all cursor-pointer select-none active:scale-95 ${
                isSortOpen
                  ? "border-primary text-primary bg-primary/5 font-extrabold"
                  : "border-border-color text-slate-600 bg-white hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0-1v12m0 0l4-4m-4 4" />
              </svg>
              Sort
            </button>

            {/* Sort Popover */}
            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-4 animate-fade-in space-y-3.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Sort Attribute
                    </label>
                    <div className="flex flex-col gap-1">
                      {[
                        { label: "Medicine Name", field: "name" as const },
                        { label: "Price / MRP", field: "price" as const },
                        { label: "Rejection Date", field: "rejectedDate" as const },
                      ].map((item) => (
                        <button
                          key={item.field}
                          onClick={() => {
                            setSortField(item.field);
                            setIsSortOpen(false);
                          }}
                          className={`text-left text-xs font-semibold px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                            sortField === item.field
                              ? "bg-primary/10 text-primary font-bold"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Order</span>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg">
                      <button
                        onClick={() => setSortOrder("asc")}
                        className={`px-2 py-1 text-[10px] font-extrabold rounded-md cursor-pointer transition-colors ${
                          sortOrder === "asc" ? "bg-white text-dark-navy shadow-xs" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        ASC
                      </button>
                      <button
                        onClick={() => setSortOrder("desc")}
                        className={`px-2 py-1 text-[10px] font-extrabold rounded-md cursor-pointer transition-colors ${
                          sortOrder === "desc" ? "bg-white text-dark-navy shadow-xs" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        DESC
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CSV Export Button */}
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="!w-auto !py-2.5 !px-4 text-xs font-bold rounded-xl border border-border-color text-slate-600 bg-white hover:bg-slate-50 cursor-pointer active:scale-95 shadow-[0_2px_10px_rgba(15,41,64,0.02)] flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </Button>

          {/* Clear Filters Button */}
          {(selectedCategoryFilter !== "All" || selectedCompanyFilter !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategoryFilter("All");
                setSelectedCompanyFilter("All");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="text-xs font-extrabold text-danger hover:underline cursor-pointer transition-all ml-1"
            >
              Clear Filters
            </button>
          )}

        </div>
      </div>

      {/* DATA TABLE LISTING CARD OR EMPTY STATE */}
      <Card noPadding className="shadow-[0_4px_25px_-5px_rgba(15,41,64,0.04)] overflow-hidden flex-1 flex flex-col justify-between min-h-0">
        {filteredMedicines.length === 0 ? (
          /* EMPTY STATE ILLUSTRATION */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto select-none animate-fade-in">
            <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-6 border border-danger/20 shadow-md">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-dark-navy tracking-tight">
              No Rejected Medicines
            </h3>
            <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
              Rejected medicine listings will appear here whenever an administrator rejects a pending medicine.
            </p>
            
            <div className="mt-7 flex flex-col sm:flex-row gap-3 w-full">
              <Link href="/dashboard/pending" className="w-full">
                <Button className="!py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl w-full active:scale-95 transition-all cursor-pointer">
                  Go to Pending Medicines
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* TABLE RENDER DATA LISTING */
          <div className="flex flex-col flex-1 justify-between min-h-0 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-border-color select-none">
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Medicine Name
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Company
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Category
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Batch Number
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Rejected By
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Rejected Date
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Rejection Reason
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Expiry Date
                    </th>
                    <th className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-border-color">
                  {paginatedMedicines.map((med) => (
                    <tr
                      key={med.id}
                      className="hover:bg-slate-50/30 transition-colors duration-150"
                    >
                      {/* Column 1: Status */}
                      <td className="px-4 py-2 select-none">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-danger/10 text-danger border border-danger/15 hover:scale-105 transition-transform duration-150">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rejected
                        </span>
                      </td>

                      {/* Column 2: Details */}
                      <td className="px-4 py-2">
                        <div className="flex flex-col gap-0.5">
                          <span
                            onClick={() => setSelectedMedicine(med)}
                            className="text-xs font-extrabold text-dark-navy hover:text-danger hover:underline cursor-pointer transition-colors"
                          >
                            {med.name || med.medicineName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 leading-none block">
                            by {med.company}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Company */}
                      <td className="px-4 py-2 text-xs font-semibold text-slate-500">
                        {med.company}
                      </td>

                      {/* Column 4: Category badge */}
                      <td className="px-4 py-2 select-none">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${getCategoryBadgeClass(med.category)}`}>
                          {med.category}
                        </span>
                      </td>

                      {/* Column 5: Batch */}
                      <td className="px-4 py-2 text-xs font-semibold text-slate-500">
                        {med.batchNumber || med.batch}
                      </td>

                      {/* Column 6: Rejected By */}
                      <td className="px-4 py-2 text-xs font-semibold text-slate-600">
                        {med.rejectedBy || "Admin User"}
                      </td>

                      {/* Column 7: Rejected At date */}
                      <td className="px-4 py-2 text-xs font-medium text-slate-400">
                        {formatDate(med.rejectedAt) || "N/A"}
                      </td>

                      {/* Column 8: Rejection Reason (colored badge with tooltip) */}
                      <td className="px-4 py-2 select-none">
                        <span 
                          title={med.rejectionReason} 
                          className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wide cursor-help inline-block max-w-[140px] truncate ${getReasonBadgeClass(med.rejectionReason || "")}`}
                        >
                          {med.rejectionReason}
                        </span>
                      </td>

                      {/* Column 9: Expiry Date */}
                      <td className="px-4 py-2 text-xs font-semibold text-slate-400">
                        {formatDate(med.expiryDate || med.expiry)}
                      </td>

                      {/* Column 10: Actions Controls */}
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Details action button */}
                          <Button
                            onClick={() => setSelectedMedicine(med)}
                            variant="outline"
                            className="!py-1 !px-2.5 !w-auto text-[11px] font-bold rounded-lg border border-border-color text-slate-500 hover:bg-slate-50 cursor-pointer active:scale-95 transition-all bg-white"
                          >
                            View Details
                          </Button>

                          {/* Download report button */}
                          <button
                            onClick={() => handleDownloadReport(med)}
                            title="Download Report"
                            className="p-1 rounded-lg border border-border-color text-slate-400 hover:text-dark-navy bg-white hover:bg-slate-50 cursor-pointer active:scale-95 transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>

                          {/* Restore optional button */}
                          <button
                            onClick={() => handleRestore(med)}
                            title="Restore Listing"
                            className="p-1 rounded-lg border border-border-color text-slate-400 hover:text-[#22C55E] hover:border-[#22C55E]/30 bg-white hover:bg-emerald-50 cursor-pointer active:scale-95 transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H17.5" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARD PAGINATION FOOTER */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border-color px-4 py-2 select-none bg-slate-50/20">
                <span className="text-xs font-semibold text-slate-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, sortedMedicines.length)} of{" "}
                  {sortedMedicines.length} entries
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 rounded-lg border border-border-color text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers list */}
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 text-xs font-extrabold rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/10"
                            : "border border-border-color text-slate-500 hover:bg-slate-50 bg-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 rounded-lg border border-border-color text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* DETAIL MODAL PANEL */}
      <RejectedMedicineDetailsModal
        isOpen={selectedMedicine !== null}
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onDownloadReport={handleDownloadReport}
      />

    </main>
  );
}
