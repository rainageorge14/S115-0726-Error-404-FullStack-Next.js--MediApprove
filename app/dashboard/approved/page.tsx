"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ApprovedMedicineDetailsModal } from "@/components/ui/ApprovedMedicineDetailsModal";
import { useMedicines, Medicine } from "@/components/ui/MedicineContext";
import { ApprovedMedicine } from "@/lib/mockApprovedMedicines";

const getExportTimestamp = () => Date.now();

export default function ApprovedMedicinesPage() {
  const { medicines } = useMedicines();
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  
  // Filtering & Sorting UI States
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<"name" | "price" | "approvedDate">("approvedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Pagination UI State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Retrieve approved medicines from global shared state context
  const approvedList = medicines.filter((m) => m.status === "approved");

  // Unique Categories and Companies lists for filtering derived from current approved list
  const categories = ["All", ...Array.from(new Set(approvedList.map((m) => m.category)))];
  const companies = ["All", ...Array.from(new Set(approvedList.map((m) => m.company)))];

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
      "Approved By",
      "Approved Date",
      "Expiry Date",
      "License Number",
    ];

    const rows = filteredMedicines.map((med) => [
      `"${med.name}"`,
      `"${med.company}"`,
      `"${med.category}"`,
      `"${med.batchNumber}"`,
      med.price,
      `"${med.approvedBy || "Admin User"}"`,
      `"${med.approvedAt || med.createdAt}"`,
      `"${med.expiryDate}"`,
      `"${med.licenseNumber || "N/A"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Approved_Medicines_Report_${getExportTimestamp()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV report exported successfully.");
  };

  // Helper: Print label mock action
  const handlePrintLabel = (med: Medicine) => {
    showToast(`Sending label print job for "${med.name}" (Batch: ${med.batchNumber}) to network printer...`);
  };

  // Helper: Download single PDF report mock action
  const handleDownloadReport = (med: Medicine) => {
    const text = `
=========================================
      MEDIAPPROVE CERTIFIED DRUG
=========================================
Drug Name      : ${med.name}
Manufacturer   : ${med.company}
Category       : ${med.category}
Batch Number   : ${med.batchNumber}
License No.    : ${med.licenseNumber || "N/A"}
Approved By    : ${med.approvedBy || "Admin User"}
Approval Date  : ${med.approvedAt || med.createdAt}
Expiries On    : ${med.expiryDate}
Retail Price   : INR ${med.price}
=========================================
Status: SECURE & VERIFIED FOR CATALOGUE
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Registry_Report_${med.name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded approval certification for "${med.name}".`);
  };

  // Filter Computation
  const filteredMedicines = approvedList.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

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
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "price") {
      comparison = a.price - b.price;
    } else if (sortField === "approvedDate") {
      const dateA = new Date(a.approvedAt || a.createdAt).getTime();
      const dateB = new Date(b.approvedAt || b.createdAt).getTime();
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

  // Get current date string to filter today's approvals
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // e.g. "14 Jul 2026"

  // Dynamic Statistics Calculations
  const newlyApprovedCount = approvedList.filter(
    (m) => m.approvedAt === currentDate
  ).length;

  const totalApprovedCount = 453 + (approvedList.length - 15);
  const approvedToday = 3 + newlyApprovedCount;
  const approvedThisWeek = 11 + newlyApprovedCount;

  // Last approved medicine details
  // Filter for newly approved medicines first, then fall back to initial listings
  const sortedApprovedByDate = [...approvedList].sort((a, b) => {
    const dateA = new Date(a.approvedAt || a.createdAt).getTime();
    const dateB = new Date(b.approvedAt || b.createdAt).getTime();
    return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
  });
  
  const lastApprovedItem = sortedApprovedByDate[0];
  const lastApprovalText = lastApprovedItem ? lastApprovedItem.name : "N/A";
  const lastApprovalDate = lastApprovedItem ? (lastApprovedItem.approvedAt || lastApprovedItem.approvedDate) : "N/A";

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

  return (
    <main className="flex-1 p-4 md:p-5 flex flex-col justify-between overflow-hidden space-y-3.5">
      
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
        
        {/* Card 1: Total Approved Medicines */}
        <Card className="!p-3.5 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Approved Medicines
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {totalApprovedCount}
              </h3>
            </div>
            <div className="p-2.5 bg-success/10 text-success rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 block mt-2.5">
            Active in medical directory
          </span>
        </Card>

        {/* Card 2: Approved Today */}
        <Card className="!p-3.5 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Approved Today
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {approvedToday}
              </h3>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-bold text-success block mt-2.5">
            Synced from approval actions
          </span>
        </Card>

        {/* Card 3: Approved This Week */}
        <Card className="!p-3.5 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                Approved This Week
              </span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-0.5 tracking-tight">
                {approvedThisWeek}
              </h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 block mt-2.5">
            Current calendar week
          </span>
        </Card>

        {/* Card 4: Last Approval */}
        <Card className="!p-3.5 hover:translate-y-[-2px] transition-transform duration-200 select-none">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block truncate">
                Last Approved Listing
              </span>
              <h3 className="text-base font-extrabold text-dark-navy mt-1 tracking-tight truncate" title={lastApprovalText}>
                {lastApprovalText}
              </h3>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0 ml-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 block mt-2.5 truncate">
            Granted on {lastApprovalDate}
          </span>
        </Card>

      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shrink-0">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search by medicine name, company, category or batch number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-xs text-dark-navy bg-white border border-border-color rounded-xl outline-hidden shadow-[0_2px_10px_rgba(15,41,64,0.02)] placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all duration-200"
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
                        { label: "Approval Date", field: "approvedDate" as const },
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

        </div>
      </div>

      {/* DATA TABLE LISTING CARD OR EMPTY STATE */}
      <Card noPadding className="shadow-[0_4px_25px_-5px_rgba(15,41,64,0.04)] overflow-hidden flex-1 flex flex-col justify-between min-h-0">
        {filteredMedicines.length === 0 ? (
          /* EMPTY STATE ILLUSTRATION */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto select-none animate-fade-in">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 border border-success/20 shadow-md">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-dark-navy tracking-tight">
              No Approved Medicines Yet
            </h3>
            <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
              Approved medicines will appear here once administrators approve pending medicine listings.
            </p>
            
            <div className="mt-7 flex flex-col sm:flex-row gap-3 w-full">
              <Link href="/dashboard/pending" className="w-full">
                <Button className="!py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl w-full active:scale-95 transition-all">
                  Go to Pending Medicines
                </Button>
              </Link>
              {(selectedCategoryFilter !== "All" || selectedCompanyFilter !== "All" || searchQuery) && (
                <Button
                  onClick={() => {
                    setSelectedCategoryFilter("All");
                    setSelectedCompanyFilter("All");
                    setSearchQuery("");
                  }}
                  variant="outline"
                  className="!py-2.5 text-slate-500 bg-white border border-border-color hover:bg-slate-50 text-xs font-bold rounded-xl w-full active:scale-95 transition-all"
                >
                  Clear Search Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* TABLE RENDER DATA LISTING */
          <div className="flex flex-col flex-1 justify-between min-h-0 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-border-color select-none">
                    <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Approval Status
                    </th>
                    <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Medicine Details
                    </th>
                    <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Category
                    </th>
                    <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Batch Number
                    </th>
                    <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      MRP / Price
                    </th>
                    <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Approvals Info
                    </th>
                    <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Expiry Date
                    </th>
                    <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-right">
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
                      {/* Column 1: Approval Status Indicator Badge */}
                      <td className="px-5 py-2.5 select-none">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-success/10 text-success border border-success/15 hover:scale-105 transition-transform duration-150">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Approved
                        </span>
                      </td>

                      {/* Column 2: Medicine details */}
                      <td className="px-5 py-2.5">
                        <div className="flex flex-col gap-0.5">
                          <span
                            onClick={() => setSelectedMedicine(med)}
                            className="text-sm font-extrabold text-dark-navy hover:text-primary hover:underline cursor-pointer transition-colors"
                          >
                            {med.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 leading-none block">
                            by {med.company}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Category badge */}
                      <td className="px-5 py-2.5 select-none">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${getCategoryBadgeClass(med.category)}`}>
                          {med.category}
                        </span>
                      </td>

                      {/* Column 4: Batch */}
                      <td className="px-5 py-2.5 text-xs font-semibold text-slate-500">
                        {med.batchNumber}
                      </td>

                      {/* Column 5: Price (MRP) */}
                      <td className="px-5 py-2.5 text-sm font-extrabold text-dark-navy">
                        ₹{med.price}
                      </td>

                      {/* Column 6: Approvals details */}
                      <td className="px-5 py-2.5">
                        <div className="flex flex-col gap-0.5 text-xs">
                          <span className="font-semibold text-slate-600 leading-normal">
                            {med.approvedBy || "Admin User"}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 leading-none">
                            {med.approvedAt || med.approvedDate}
                          </span>
                        </div>
                      </td>

                      {/* Column 7: Expiry date */}
                      <td className="px-5 py-2.5 text-xs font-semibold text-slate-400">
                        {med.expiryDate}
                      </td>

                      {/* Column 8: Actions Controls */}
                      <td className="px-5 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Details action button */}
                          <Button
                            onClick={() => setSelectedMedicine(med)}
                            variant="outline"
                            className="!py-1.5 !px-3.5 !w-auto text-xs font-bold rounded-lg border border-border-color text-slate-500 hover:bg-slate-50 cursor-pointer active:scale-95 transition-all"
                          >
                            View Details
                          </Button>

                          {/* Print Label icon button */}
                          <button
                            onClick={() => handlePrintLabel(med)}
                            title="Print Label"
                            className="p-1.5 rounded-lg border border-border-color text-slate-400 hover:text-dark-navy bg-white hover:bg-slate-50 cursor-pointer active:scale-95 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>

                          {/* Download report certification button */}
                          <button
                            onClick={() => handleDownloadReport(med)}
                            title="Download Certificate"
                            className="p-1.5 rounded-lg border border-border-color text-slate-400 hover:text-dark-navy bg-white hover:bg-slate-50 cursor-pointer active:scale-95 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
              <div className="flex items-center justify-between border-t border-border-color px-5 py-2.5 select-none bg-slate-50/20">
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
      <ApprovedMedicineDetailsModal
        isOpen={selectedMedicine !== null}
        medicine={selectedMedicine as ApprovedMedicine | null}
        onClose={() => setSelectedMedicine(null)}
        onDownloadReport={(med) => handleDownloadReport(med as Medicine)}
      />

    </main>
  );
}
