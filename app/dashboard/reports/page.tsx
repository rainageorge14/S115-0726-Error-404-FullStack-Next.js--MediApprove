"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useMedicines } from "@/components/ui/MedicineContext";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

interface ReportItem {
  id: string;
  name: string;
  category: "Medicine Report" | "Approval Report" | "Rejection Report" | "Audit Report" | "Admin Activity";
  generatedBy: string;
  generatedOn: string;
  status: "Completed" | "Pending" | "Failed";
}

const getExportTimestamp = () => Date.now();

export default function ReportsPage() {
  const { medicines, actionLogs } = useMedicines();
  const [isMounted, setIsMounted] = useState(false);

  // States
  const [reports, setReports] = useState<ReportItem[]>([
    { id: "RPT-1024", name: "Monthly Approval Report", category: "Approval Report", generatedBy: "Admin User", generatedOn: "20 July 2026, 11:20 AM", status: "Completed" },
    { id: "RPT-1023", name: "Quarterly Drug Audit Trails", category: "Audit Report", generatedBy: "Sarah Connor", generatedOn: "19 July 2026, 04:30 PM", status: "Completed" },
    { id: "RPT-1022", name: "Cipla Submission Analysis", category: "Medicine Report", generatedBy: "John Doe", generatedOn: "19 July 2026, 10:15 AM", status: "Completed" },
    { id: "RPT-1021", name: "Security Compliance Review", category: "Audit Report", generatedBy: "Admin User", generatedOn: "18 July 2026, 02:40 PM", status: "Completed" },
    { id: "RPT-1020", name: "Pending Medicine Lifecycle", category: "Medicine Report", generatedBy: "Sarah Connor", generatedOn: "17 July 2026, 09:12 AM", status: "Completed" },
    { id: "RPT-1019", name: "Rejected Ingredients Log", category: "Rejection Report", generatedBy: "John Doe", generatedOn: "16 July 2026, 05:10 PM", status: "Completed" },
    { id: "RPT-1018", name: "Admin Audit Activity Ledger", category: "Admin Activity", generatedBy: "Admin User", generatedOn: "15 July 2026, 01:25 PM", status: "Completed" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Popover open states
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  if (!isMounted) {
    return (
      <main className="flex-1 p-6 md:p-8 space-y-6 bg-[#F8FAFC]">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded-lg w-1/4" />
          <div className="h-6 bg-slate-200 rounded-lg w-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="h-32 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  // --- Dynamic Stats Computations ---
  const totalMedicines = medicines.length + 420; // adding baseline
  const pendingCount = medicines.filter((m) => m.status === "pending").length + 25;
  const approvedCount = medicines.filter((m) => m.status === "approved").length + 330;
  const rejectedCount = medicines.filter((m) => m.status === "rejected").length + 65;
  
  const approvalRate = Math.round((approvedCount / (approvedCount + rejectedCount)) * 100) || 84;
  const totalAdminActions = actionLogs.length + 1580;

  // --- Charts Data Aggregations ---
  // Chart 1: Donut Status
  const donutData = [
    { name: "Pending", value: pendingCount, color: "#F59E0B" },
    { name: "Approved", value: approvedCount, color: "#22C55E" },
    { name: "Rejected", value: rejectedCount, color: "#EF4444" },
  ];

  // Chart 2: Daily Approval trend (past week simulation)
  const dailyTrendData = [
    { day: "14 Jul", Approved: 12 },
    { day: "15 Jul", Approved: 18 },
    { day: "16 Jul", Approved: 15 },
    { day: "17 Jul", Approved: 22 },
    { day: "18 Jul", Approved: 19 },
    { day: "19 Jul", Approved: 28 },
    { day: "20 Jul", Approved: medicines.filter(m => m.status === "approved" && m.approvedAt?.includes("20 July 2026")).length + 32 },
  ];

  // Chart 3: Monthly Medicine processing
  const monthlyData = [
    { month: "May", Approved: 140, Rejected: 32, Pending: 15 },
    { month: "June", Approved: 185, Rejected: 45, Pending: 28 },
    { month: "July", Approved: approvedCount, Rejected: rejectedCount, Pending: pendingCount },
  ];

  // Chart 4: Top Performing Admins (approvals vs rejections)
  const adminPerformanceData = [
    {
      name: "Admin User",
      Approvals: actionLogs.filter(log => log.adminName === "Admin User" && log.action === "Approved").length + 82,
      Rejections: actionLogs.filter(log => log.adminName === "Admin User" && log.action === "Rejected").length + 15
    },
    {
      name: "Sarah Connor",
      Approvals: actionLogs.filter(log => log.adminName === "Sarah Connor" && log.action === "Approved").length + 52,
      Rejections: actionLogs.filter(log => log.adminName === "Sarah Connor" && log.action === "Rejected").length + 12
    },
    {
      name: "John Doe",
      Approvals: actionLogs.filter(log => log.adminName === "John Doe" && log.action === "Approved").length + 38,
      Rejections: actionLogs.filter(log => log.adminName === "John Doe" && log.action === "Rejected").length + 8
    }
  ];

  // Chart 5: Approval vs Rejection Ratio
  const ratioData = [
    { name: "Approved", value: approvedCount, color: "#22C55E" },
    { name: "Rejected", value: rejectedCount, color: "#EF4444" },
  ];

  // Chart 6: System Activity Timeline (area chart of daily audit events)
  const activityData = [
    { day: "14 Jul", Activities: 120 },
    { day: "15 Jul", Activities: 145 },
    { day: "16 Jul", Activities: 132 },
    { day: "17 Jul", Activities: 180 },
    { day: "18 Jul", Activities: 165 },
    { day: "19 Jul", Activities: 210 },
    { day: "20 Jul", Activities: actionLogs.filter(log => log.timestamp.includes("20 July 2026")).length + 225 },
  ];

  // --- Report Table Computations ---
  const handleGenerateReport = (customName?: string, customCategory?: ReportItem["category"]) => {
    const formattedDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + ", " + new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const nextId = `RPT-${1000 + reports.length + 18}`;
    const reportName = customName || `${selectedTypeFilter !== "All" ? selectedTypeFilter : "Custom"} Analysis Report`;
    const reportCategory = customCategory || (selectedTypeFilter !== "All" ? (selectedTypeFilter as ReportItem["category"]) : "Medicine Report");

    const newReport: ReportItem = {
      id: nextId,
      name: reportName,
      category: reportCategory,
      generatedBy: "Admin User",
      generatedOn: formattedDate,
      status: "Completed"
    };

    setReports((prev) => [newReport, ...prev]);
    showToast(`Successfully generated new report: "${reportName}" (${nextId})`);
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showToast(`Deleted report ${id}.`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDateFilter("All");
    setSelectedTypeFilter("All");
    setCurrentPage(1);
    showToast("Filters reset successfully.");
  };

  const triggerDownload = (rpt: ReportItem) => {
    const text = `
=========================================
        MEDIAPPROVE ANALYTICS REPORT
=========================================
Report ID     : ${rpt.id}
Report Name   : ${rpt.name}
Report Type   : ${rpt.category}
Generated By  : ${rpt.generatedBy}
Generated On  : ${rpt.generatedOn}
Status        : ${rpt.status}
-----------------------------------------
STATISTICAL AGGREGATES:
Total Processed Medicines: ${totalMedicines}
Approved Drugs Count     : ${approvedCount}
Rejected Drugs Count     : ${rejectedCount}
Approval Rate            : ${approvalRate}%
Total Admin Action Logs  : ${totalAdminActions}
-----------------------------------------
Report Registry Signed. Certified Secure.
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rpt.id}_${rpt.name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${rpt.id} document successfully.`);
  };

  // CSV Export Table Dump
  const handleExportCSV = () => {
    const headers = ["Report ID", "Report Name", "Category", "Generated By", "Generated On", "Status"];
    const rows = filteredReports.map((r) => [
      r.id,
      `"${r.name}"`,
      `"${r.category}"`,
      `"${r.generatedBy}"`,
      `"${r.generatedOn}"`,
      r.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Generated_Reports_Metadata_${getExportTimestamp()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV metadata spreadsheet downloaded.");
  };

  // Export JSON Dump
  const handleExportJSON = () => {
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredReports, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `Reports_List_Dump_${getExportTimestamp()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("JSON report metadata exported.");
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // Filtering Reports logic
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedTypeFilter === "All" || r.category === selectedTypeFilter;

    // Date range filter simulation
    let matchesDate = true;
    if (selectedDateFilter !== "All") {
      if (selectedDateFilter === "Today") {
        matchesDate = r.generatedOn.includes("20 July 2026");
      } else if (selectedDateFilter === "7days") {
        matchesDate = r.generatedOn.includes("20 July") || r.generatedOn.includes("19 July") || r.generatedOn.includes("18 July") || r.generatedOn.includes("17 July") || r.generatedOn.includes("16 July") || r.generatedOn.includes("15 July") || r.generatedOn.includes("14 July");
      }
    }

    return matchesSearch && matchesType && matchesDate;
  });

  // Pagination computes
  const totalReportsCount = filteredReports.length;
  const totalPages = Math.ceil(totalReportsCount / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 space-y-6 md:space-y-8 overflow-y-auto bg-[#F8FAFC]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-dark-navy text-white rounded-xl shadow-2xl border border-primary/20 animate-fade-in select-none">
          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="border-b border-border-color pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-dark-navy tracking-tight">Reports & Analytics</h1>
        <p className="text-sm font-semibold text-slate-400 mt-1">
          Monitor medicine approval trends, administrator activity, and overall system performance through interactive analytics.
        </p>
      </div>

      {/* REPORT SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        {/* Total Medicines Processed */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Total Processed</span>
              <h3 className="text-2xl font-extrabold text-dark-navy mt-1 tracking-tight">{totalMedicines}</h3>
            </div>
            <div className="p-2.5 bg-info/10 text-info rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-4">All processed entries</span>
        </Card>

        {/* Pending Medicines */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Pending Review</span>
              <h3 className="text-2xl font-extrabold text-warning mt-1 tracking-tight">{pendingCount}</h3>
            </div>
            <div className="p-2.5 bg-warning/10 text-warning rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-4">Awaiting catalog review</span>
        </Card>

        {/* Approved Medicines */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Approved Drugs</span>
              <h3 className="text-2xl font-extrabold text-success mt-1 tracking-tight">{approvedCount}</h3>
            </div>
            <div className="p-2.5 bg-success/10 text-success rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-4">Authorized catalogue</span>
        </Card>

        {/* Rejected Medicines */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Rejected Drugs</span>
              <h3 className="text-2xl font-extrabold text-danger mt-1 tracking-tight">{rejectedCount}</h3>
            </div>
            <div className="p-2.5 bg-danger/10 text-danger rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-4">Blacklisted applications</span>
        </Card>

        {/* Approval Rate */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Approval Rate</span>
              <h3 className="text-2xl font-extrabold text-primary mt-1 tracking-tight">{approvalRate}%</h3>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-4">Catalog ratio compliance</span>
        </Card>

        {/* Total Admin Actions */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Audit Actions</span>
              <h3 className="text-2xl font-extrabold text-purple-600 mt-1 tracking-tight">{totalAdminActions}</h3>
            </div>
            <div className="p-2.5 bg-purple-500/10 text-purple-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-4">Total operations logged</span>
        </Card>

      </div>

      {/* FILTER & CONTROL TOOLBAR */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 text-sm text-dark-navy bg-white border border-border-color rounded-2xl outline-hidden shadow-[0_2px_10px_rgba(15,41,64,0.02)] placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all duration-200"
          />
          <div className="absolute left-4 top-3.5 text-slate-400">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Date range selection */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDateOpen(!isDateOpen);
                setIsTypeOpen(false);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white border rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] transition-all cursor-pointer ${
                isDateOpen || selectedDateFilter !== "All" ? "border-primary text-primary" : "border-border-color hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date: {selectedDateFilter === "All" ? "All time" : selectedDateFilter}
            </button>

            {isDateOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDateOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-2.5 flex flex-col gap-1 animate-fade-in">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mb-1">Date Window</span>
                  {["All", "Today", "Last 7 Days", "Last 30 Days"].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDateFilter(d === "Last 7 Days" ? "7days" : d === "Last 30 Days" ? "30days" : d);
                        setCurrentPage(1);
                        setIsDateOpen(false);
                      }}
                      className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                        (selectedDateFilter === "7days" && d === "Last 7 Days") || (selectedDateFilter === "30days" && d === "Last 30 Days") || selectedDateFilter === d
                          ? "bg-primary/10 text-primary"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Report category type select */}
          <div className="relative">
            <button
              onClick={() => {
                setIsTypeOpen(!isTypeOpen);
                setIsDateOpen(false);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white border rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] transition-all cursor-pointer ${
                isTypeOpen || selectedTypeFilter !== "All" ? "border-primary text-primary" : "border-border-color hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Type: {selectedTypeFilter === "All" ? "All Reports" : selectedTypeFilter}
            </button>

            {isTypeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsTypeOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-52 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-2.5 flex flex-col gap-1 animate-fade-in">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mb-1">Report Category</span>
                  {["All", "Medicine Report", "Approval Report", "Rejection Report", "Audit Report", "Admin Activity"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTypeFilter(t);
                        setCurrentPage(1);
                        setIsTypeOpen(false);
                      }}
                      className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                        selectedTypeFilter === t ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Action Buttons */}
          <button
            onClick={() => handleGenerateReport()}
            className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/15 rounded-2xl cursor-pointer hover:scale-[1.01] transition-transform"
          >
            Generate Report
          </button>
          
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] hover:bg-slate-50 cursor-pointer"
            title="Export CSV"
          >
            CSV
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] hover:bg-slate-50 cursor-pointer"
            title="Export JSON"
          >
            JSON
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 text-slate-400 hover:text-dark-navy bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] hover:bg-slate-50 cursor-pointer"
            title="Print Friendly view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>

          <button
            onClick={handleResetFilters}
            className="p-2.5 text-slate-400 hover:text-dark-navy bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] hover:bg-slate-50 cursor-pointer"
            title="Reset Filters"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </button>

        </div>
      </div>

      {/* CHARTS GRAPHICS BLOCK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Chart 1: Donut Status */}
        <Card className="p-5 flex flex-col space-y-4 animate-fade-in shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-dark-navy tracking-tight">Medicine Status Distribution</h4>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Summary of listings states</span>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute text-center select-none pointer-events-none">
              <span className="text-2xl font-extrabold text-dark-navy">{medicines.length}</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Total active</span>
            </div>
          </div>
          <div className="flex justify-around items-center pt-2">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart 2: Daily Approval trend */}
        <Card className="p-5 flex flex-col space-y-4 animate-fade-in shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-dark-navy tracking-tight">Daily Approval Trend</h4>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Approved medicines over time</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="Approved" stroke="#22C55E" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Monthly Medicine processing */}
        <Card className="p-5 flex flex-col space-y-4 animate-fade-in shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-dark-navy tracking-tight">Monthly Processing Analytics</h4>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Status breakdown comparative months</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                <Bar dataKey="Approved" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rejected" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Top performing Administrators */}
        <Card className="p-5 flex flex-col space-y-4 animate-fade-in shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-dark-navy tracking-tight">Top Performing Administrators</h4>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Action outcomes sorted by admins</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminPerformanceData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: "#0F172A", fontWeight: "bold" }} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                <Bar dataKey="Approvals" fill="#22C55E" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Rejections" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 5: Approval vs Rejection Ratio */}
        <Card className="p-5 flex flex-col space-y-4 animate-fade-in shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-dark-navy tracking-tight">Approval vs Rejection Ratio</h4>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Comparative ratio of outcomes</span>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}
                  labelLine={false}
                >
                  {ratioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 6: System Activity Timeline */}
        <Card className="p-5 flex flex-col space-y-4 animate-fade-in shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-dark-navy tracking-tight">System Activity Timeline</h4>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Total audit events trends</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Activities" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorAct)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* QUICK REPORTS PANELS */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-dark-navy tracking-tight">Quick Action Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          
          {/* Card 1 */}
          <Card className="p-4 hover:translate-y-[-2px] transition-transform duration-200 select-none bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-success/15 text-success flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-dark-navy leading-snug">Medicine Approval Report</h5>
              <p className="text-[10px] text-slate-400 leading-tight">Summarized timeline of drug catalog acceptances.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Medicine Approval Report", "Approval Report")}
              className="w-full text-center py-1.5 bg-success/10 hover:bg-success text-success hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Generate
            </button>
          </Card>

          {/* Card 2 */}
          <Card className="p-4 hover:translate-y-[-2px] transition-transform duration-200 select-none bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-danger/15 text-danger flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-dark-navy leading-snug">Rejection Analysis</h5>
              <p className="text-[10px] text-slate-400 leading-tight">Detailed reasons, batch expirations, documents missing.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Rejection Analysis Report", "Rejection Report")}
              className="w-full text-center py-1.5 bg-danger/10 hover:bg-danger text-danger hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Generate
            </button>
          </Card>

          {/* Card 3 */}
          <Card className="p-4 hover:translate-y-[-2px] transition-transform duration-200 select-none bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-info/15 text-info flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-dark-navy leading-snug">Audit Log Summary</h5>
              <p className="text-[10px] text-slate-400 leading-tight">Security logs, logins, IP locations compliance report.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("System Audit Log Summary", "Audit Report")}
              className="w-full text-center py-1.5 bg-info/10 hover:bg-info text-info hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Generate
            </button>
          </Card>

          {/* Card 4 */}
          <Card className="p-4 hover:translate-y-[-2px] transition-transform duration-200 select-none bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-dark-navy leading-snug">Daily Activity Report</h5>
              <p className="text-[10px] text-slate-400 leading-tight">Timeline breakdown of all 24h admin operations.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Daily Activity Report", "Admin Activity")}
              className="w-full text-center py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Generate
            </button>
          </Card>

          {/* Card 5 */}
          <Card className="p-4 hover:translate-y-[-2px] transition-transform duration-200 select-none bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-dark-navy leading-snug">Monthly Performance</h5>
              <p className="text-[10px] text-slate-400 leading-tight">Key metrics tracking processing speed and ratios.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Monthly Performance Ledger", "Admin Activity")}
              className="w-full text-center py-1.5 bg-purple-500/10 hover:bg-purple-600 text-purple-600 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Generate
            </button>
          </Card>

          {/* Card 6 */}
          <Card className="p-4 hover:translate-y-[-2px] transition-transform duration-200 select-none bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-warning/15 text-warning flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-dark-navy leading-snug">Client Submission Report</h5>
              <p className="text-[10px] text-slate-400 leading-tight">Breakdown of listings submitted by pharmaceutical partners.</p>
            </div>
            <button
              onClick={() => handleGenerateReport("Client Submission Analytics", "Medicine Report")}
              className="w-full text-center py-1.5 bg-warning/10 hover:bg-warning text-warning hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Generate
            </button>
          </Card>

        </div>
      </div>

      {/* ADMIN PERFORMANCE RANKING & SYSTEM INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Admin Performance table */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-extrabold text-dark-navy tracking-tight">Administrator Rankings</h3>
          <Card className="p-0 overflow-hidden shadow-sm animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-50 border-b border-border-color select-none">
                    <th className="px-5 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Rank</th>
                    <th className="px-5 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Name</th>
                    <th className="px-5 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Approvals</th>
                    <th className="px-5 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Rejections</th>
                    <th className="px-5 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Success Rate</th>
                    <th className="px-5 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Avg Review Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {[
                    { rank: 1, name: "Admin User", role: "Super Admin", app: adminPerformanceData[0].Approvals, rej: adminPerformanceData[0].Rejections, success: "88%", time: "2m 12s" },
                    { rank: 2, name: "Sarah Connor", role: "Admin", app: adminPerformanceData[1].Approvals, rej: adminPerformanceData[1].Rejections, success: "85%", time: "2m 45s" },
                    { rank: 3, name: "John Doe", role: "Admin", app: adminPerformanceData[2].Approvals, rej: adminPerformanceData[2].Rejections, success: "82%", time: "1m 55s" }
                  ].map((adm) => (
                    <tr key={adm.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 text-center font-extrabold text-xs text-slate-400">{adm.rank}</td>
                      <td className="px-5 py-4">
                        <div>
                          <span className="text-xs font-bold text-dark-navy block">{adm.name}</span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{adm.role}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center text-xs font-bold text-success">{adm.app}</td>
                      <td className="px-5 py-4 text-center text-xs font-bold text-danger">{adm.rej}</td>
                      <td className="px-5 py-4 text-center text-xs font-bold text-primary">{adm.success}</td>
                      <td className="px-5 py-4 text-right text-xs font-bold text-slate-600 font-mono">{adm.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Insights AI-style */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-dark-navy tracking-tight font-sans">System AI Insights</h3>
          <div className="space-y-4 flex flex-col h-full">
            
            {/* Card 1 */}
            <div className="p-4 bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] flex gap-3 items-center select-none hover:translate-y-[-1px] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h5 className="text-xs font-bold text-dark-navy">Approval rate increased by 12%</h5>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Strong catalog additions in capsules & injections this month.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] flex gap-3 items-center select-none hover:translate-y-[-1px] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xs font-bold text-dark-navy">Most rejected category: Tablets</h5>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Primarily due to mismatch in formulation certificates.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] flex gap-3 items-center select-none hover:translate-y-[-1px] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xs font-bold text-dark-navy">Average review time: 2m 15s</h5>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Decreased by 18 seconds compared to June 2026 logs.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-4 bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] flex gap-3 items-center select-none hover:translate-y-[-1px] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xs font-bold text-dark-navy">Highest activity day: Monday</h5>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Peak listing creations by client APIs after weekends.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* REPORTS REGISTRY TABLE & TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
        
        {/* Table list: Column 1, 2, 3 */}
        <div className="lg:col-span-3 flex flex-col">
          <h3 className="text-lg font-extrabold text-dark-navy tracking-tight mb-4">Generated Reports Log</h3>
          
          {currentReports.length === 0 ? (
            <Card className="flex flex-col items-center justify-center text-center py-16 px-6 select-none h-full animate-fade-in">
              <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h4 className="text-base font-extrabold text-dark-navy">No Reports Generated</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed font-semibold">
                Generate reports to monitor medicine approvals, administrator activity, and system performance.
              </p>
              <button
                onClick={() => handleGenerateReport()}
                className="mt-5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md cursor-pointer"
              >
                Generate Report
              </button>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden shadow-sm flex flex-col h-full justify-between flex-1 animate-fade-in">
              <div className="w-full flex-1">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border-color select-none">
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Report ID</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Report Name</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Generated By</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {currentReports.map((rpt) => (
                      <tr key={rpt.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-3.5 font-mono text-xs font-extrabold text-slate-500 group-hover:text-primary transition-colors">{rpt.id}</td>
                        <td className="px-5 py-3.5 text-xs font-bold text-dark-navy">{rpt.name}</td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-slate-500">{rpt.category}</td>
                        <td className="px-5 py-3.5">
                          <div className="text-xs font-bold text-dark-navy">{rpt.generatedBy}</div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{rpt.generatedOn.split(", ")[0]}</div>
                        </td>
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 bg-success/10 text-success border border-success/20 rounded-full uppercase tracking-wider">
                            {rpt.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => triggerDownload(rpt)}
                              className="p-1.5 bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-400 rounded-lg border border-border-color cursor-pointer"
                              title="Download Report"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteReport(rpt.id)}
                              className="p-1.5 bg-slate-50 hover:bg-danger/10 hover:text-danger text-slate-400 rounded-lg border border-border-color cursor-pointer"
                              title="Delete Report"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION PANEL */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border-t border-border-color select-none">
                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                  Showing <span className="font-extrabold text-dark-navy">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-extrabold text-dark-navy">{Math.min(indexOfLastItem, totalReportsCount)}</span> of{" "}
                  <span className="font-extrabold text-dark-navy">{totalReportsCount}</span> Reports
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 border rounded-xl transition-all cursor-pointer ${
                      currentPage === 1 ? "text-slate-300 bg-slate-50 border-slate-200" : "text-slate-500 bg-white border-border-color hover:bg-slate-50 hover:text-dark-navy"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        currentPage === i + 1
                          ? "bg-primary text-white shadow-md shadow-primary/10"
                          : "bg-white text-slate-500 border border-border-color hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 border rounded-xl transition-all cursor-pointer ${
                      currentPage === totalPages ? "text-slate-300 bg-slate-50 border-slate-200" : "text-slate-500 bg-white border-border-color hover:bg-slate-50"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Recent reports list: Column 4 */}
        <div className="flex flex-col">
          <h3 className="text-lg font-extrabold text-dark-navy tracking-tight mb-4">Recent Outputs</h3>
          <Card className="p-5 shadow-sm flex flex-col space-y-4 h-full flex-1 justify-between animate-fade-in">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Latest Generations</span>
            </div>

            <div className="relative border-l-2 border-slate-100 pl-6 ml-3 flex-1 flex flex-col justify-between py-1 min-h-[300px]">
              {reports.slice(0, 5).map((rpt) => (
                <div key={rpt.id} className="relative select-none hover:translate-x-1 transition-transform duration-200">
                  {/* Circle Node indicator */}
                  <div className="absolute -left-10 top-0.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-md">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md font-mono">{rpt.id}</span>
                    <h4 className="text-xs font-bold text-dark-navy mt-1.5 leading-snug">{rpt.name}</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">
                      by {rpt.generatedBy} &bull; {rpt.generatedOn.split(", ")[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </main>
  );
}
