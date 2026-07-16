"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useMedicines, ActionLog } from "@/components/ui/MedicineContext";
import { ActionLogDetailsModal } from "@/components/ui/ActionLogDetailsModal";

export default function ActionLogsPage() {
  const { actionLogs, addActionLog } = useMedicines();
  
  // UI states
  const [selectedLog, setSelectedLog] = useState<ActionLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Sorting states
  const [selectedAdminFilter, setSelectedAdminFilter] = useState("All");
  const [selectedActionFilter, setSelectedActionFilter] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All"); // All, Today, Last 7 days, Last 30 days
  const [sortField, setSortField] = useState<"id" | "timestamp">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dropdown open states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Extract unique admins and action types for filters
  const admins = ["All", ...Array.from(new Set(actionLogs.map((log) => log.adminName)))];
  const actions = ["All", ...Array.from(new Set(actionLogs.map((log) => log.action)))];

  // Toast notifier
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Reset all filters
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSearchQuery("");
      setSelectedAdminFilter("All");
      setSelectedActionFilter("All");
      setSelectedDateFilter("All");
      setSortField("id");
      setSortOrder("desc");
      setCurrentPage(1);
      setIsRefreshing(false);
      showToast("Audit logs refreshed and synchronized successfully.");
    }, 600);
  };

  // Parse custom mock timestamps to Javascript Date objects for filtering
  const parseLogDate = (dateStr: string) => {
    // e.g. "20 July 2026, 10:35 AM"
    try {
      const parts = dateStr.split(", ");
      const datePart = parts[0]; // "20 July 2026"
      const timePart = parts[1]; // "10:35 AM"
      
      const dateTokens = datePart.split(" ");
      const day = parseInt(dateTokens[0]);
      const monthStr = dateTokens[1];
      const year = parseInt(dateTokens[2]);

      const months: { [key: string]: number } = {
        January: 0, Feb: 1, February: 1, Mar: 2, March: 2, Apr: 3, April: 3,
        May: 4, Jun: 5, June: 5, Jul: 6, July: 6, Aug: 7, August: 7,
        Sep: 8, September: 8, Oct: 9, October: 9, Nov: 10, November: 10,
        Dec: 11, December: 11
      };
      
      const month = months[monthStr] !== undefined ? months[monthStr] : 6; // default July

      const timeTokens = timePart.split(" ");
      const hmTokens = timeTokens[0].split(":");
      let hours = parseInt(hmTokens[0]);
      const minutes = parseInt(hmTokens[1]);
      const ampm = timeTokens[1]; // "AM" or "PM"

      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      return new Date(year, month, day, hours, minutes);
    } catch (e) {
      return new Date(); // fallback
    }
  };

  // Filter computations
  const filteredLogs = actionLogs.filter((log) => {
    // Search
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.medicineName && log.medicineName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.medicineId && log.medicineId.toLowerCase().includes(searchQuery.toLowerCase()));

    // Admin Filter
    const matchesAdmin =
      selectedAdminFilter === "All" || log.adminName === selectedAdminFilter;

    // Action Filter
    const matchesAction =
      selectedActionFilter === "All" || log.action === selectedActionFilter;

    // Date Filter
    let matchesDate = true;
    if (selectedDateFilter !== "All") {
      const logDate = parseLogDate(log.timestamp);
      // Hardcoded "today" as 20 July 2026 for simulation coherence
      const baseToday = new Date(2026, 6, 20); // July 20, 2026
      const diffTime = Math.abs(baseToday.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (selectedDateFilter === "Today") {
        matchesDate = log.timestamp.startsWith("20 July 2026");
      } else if (selectedDateFilter === "7days") {
        matchesDate = diffDays <= 7;
      } else if (selectedDateFilter === "30days") {
        matchesDate = diffDays <= 30;
      }
    }

    return matchesSearch && matchesAdmin && matchesAction && matchesDate;
  });

  // Sort computation
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let comparison = 0;
    if (sortField === "id") {
      comparison = a.id.localeCompare(b.id);
    } else if (sortField === "timestamp") {
      const dateA = parseLogDate(a.timestamp);
      const dateB = parseLogDate(b.timestamp);
      comparison = dateA.getTime() - dateB.getTime();
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Pagination computations
  const totalItems = sortedLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Dynamic statistics counters
  const totalLogsCount = actionLogs.length;
  const approvalsCount = actionLogs.filter((log) => log.action === "Approved").length;
  const rejectionsCount = actionLogs.filter((log) => log.action === "Rejected").length;
  // Count logs perform on mock "Today" (20 July 2026)
  const todayCount = actionLogs.filter((log) => log.timestamp.includes("20 July 2026")).length;

  // Single Log download text generator
  const triggerSingleDownload = (log: ActionLog) => {
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
    showToast(`Downloaded audit details for ${log.id}.`);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (sortedLogs.length === 0) {
      showToast("No data to export.");
      return;
    }
    const headers = ["Log ID", "Timestamp", "Admin Name", "Admin Role", "Action", "Medicine Name", "Status", "IP Address", "Device"];
    const rows = sortedLogs.map((log) => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.adminName}"`,
      `"${log.adminRole}"`,
      `"${log.action}"`,
      `"${log.medicineName || "N/A"}"`,
      `"${log.newStatus || log.action}"`,
      log.ipAddress,
      `"${log.browser} / ${log.os}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Action_Logs_Audit_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Audit Report exported successfully.");
  };

  // JSON Export
  const handleExportJSON = () => {
    if (sortedLogs.length === 0) {
      showToast("No data to export.");
      return;
    }
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedLogs, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `Action_Logs_Dump_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("JSON Logs data exported successfully.");
  };

  // PDF Cert style export (formatted text file)
  const handleExportPDF = () => {
    if (sortedLogs.length === 0) {
      showToast("No data to export.");
      return;
    }
    let reportText = `========================================================================\n`;
    reportText += `                   MEDIAPPROVE SYSTEM AUDIT REPORT\n`;
    reportText += `                   Generated: ${new Date().toLocaleString()}\n`;
    reportText += `========================================================================\n\n`;
    reportText += `Total Filtered Records: ${sortedLogs.length}\n\n`;
    
    sortedLogs.forEach((log, index) => {
      reportText += `[${index + 1}] Log ID: ${log.id} | Timestamp: ${log.timestamp}\n`;
      reportText += `    Performed By   : ${log.adminName} (${log.adminRole}) [${log.adminEmail}]\n`;
      reportText += `    Action Type    : ${log.action} | Status: ${log.newStatus || "Done"}\n`;
      reportText += `    Details        : ${log.remarks}\n`;
      reportText += `    Medicine       : ${log.medicineName || "N/A"} (${log.medicineId || "N/A"})\n`;
      reportText += `    Client Info    : IP: ${log.ipAddress} | Browser: ${log.browser} | OS: ${log.os}\n`;
      if (log.additionalNotes) {
        reportText += `    Audit Notes    : ${log.additionalNotes}\n`;
      }
      reportText += `------------------------------------------------------------------------\n`;
    });
    
    reportText += `\n=================== Registry End. Certified Audit Trail ===================\n`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Registry_Audit_Report_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("PDF formatted Audit Report downloaded.");
  };

  // Action simulators to trigger real-time actions and logs
  const simulateAction = (type: "Login" | "Logout" | "Profile" | "Client" | "Medicine") => {
    let logPayload: any = {};
    
    switch (type) {
      case "Login":
        logPayload = {
          adminId: "ADM-001",
          adminName: "Admin User",
          adminEmail: "admin@mediapprove.com",
          adminRole: "Super Admin",
          action: "Login",
          medicineId: "N/A",
          medicineName: "N/A",
          ipAddress: "192.168.1.10",
          browser: "Chrome",
          os: "Windows 11",
          device: "Chrome / Windows 11",
          remarks: "Admin Login",
          previousStatus: "Logged Out",
          newStatus: "Logged In",
          additionalNotes: "Interactive dashboard simulation login event generated."
        };
        showToast("Login event simulated successfully!");
        break;
      case "Logout":
        logPayload = {
          adminId: "ADM-001",
          adminName: "Admin User",
          adminEmail: "admin@mediapprove.com",
          adminRole: "Super Admin",
          action: "Logout",
          medicineId: "N/A",
          medicineName: "N/A",
          ipAddress: "192.168.1.10",
          browser: "Chrome",
          os: "Windows 11",
          device: "Chrome / Windows 11",
          remarks: "Admin Logout",
          previousStatus: "Logged In",
          newStatus: "Logged Out",
          additionalNotes: "Dashboard logging session closed."
        };
        showToast("Logout event simulated successfully!");
        break;
      case "Profile":
        logPayload = {
          adminId: "ADM-002",
          adminName: "Sarah Connor",
          adminEmail: "sarah@mediapprove.com",
          adminRole: "Admin",
          action: "Profile Updated",
          medicineId: "N/A",
          medicineName: "N/A",
          ipAddress: "192.168.1.45",
          browser: "Safari",
          os: "macOS Sequoia",
          device: "Safari / macOS",
          remarks: "Profile details updated",
          previousStatus: "Old Profile Context",
          newStatus: "New Profile Config",
          additionalNotes: "Admin updated profile credentials."
        };
        showToast("Profile Update simulated!");
        break;
      case "Client":
        logPayload = {
          adminId: "ADM-003",
          adminName: "John Doe",
          adminEmail: "john@mediapprove.com",
          adminRole: "Admin",
          action: "Client Created",
          medicineId: "N/A",
          medicineName: "N/A",
          ipAddress: "192.168.1.12",
          browser: "Edge",
          os: "Windows 11",
          device: "Edge / Windows 11",
          remarks: "New pharmaceutical manufacturer client registered",
          previousStatus: "N/A",
          newStatus: "Registered Client",
          additionalNotes: "Client organization: Sun Pharmaceutical Industries Ltd."
        };
        showToast("Client Creation simulated!");
        break;
      case "Medicine":
        const randMedName = ["Combiflam Tablet", "Becosules Capsule", "Gelusil Liquid", "Crocin 500mg"][Math.floor(Math.random() * 4)];
        logPayload = {
          adminId: "ADM-002",
          adminName: "Sarah Connor",
          adminEmail: "sarah@mediapprove.com",
          adminRole: "Admin",
          action: "Medicine Created",
          medicineId: `med-pending-${10 + Math.floor(Math.random() * 90)}`,
          medicineName: randMedName,
          ipAddress: "192.168.1.45",
          browser: "Safari",
          os: "macOS Sequoia",
          device: "Safari / macOS",
          remarks: `Medicine listing created: ${randMedName}`,
          previousStatus: "N/A",
          newStatus: "Pending Review",
          additionalNotes: `Simulated creation of drug listing ${randMedName} for licensing review.`
        };
        showToast(`Created Medicine Listing: "${randMedName}"!`);
        break;
    }

    addActionLog(logPayload);
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
        return "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20";
    }
  };

  const getTimelineIcon = (action: string) => {
    switch (action) {
      case "Approved":
        return (
          <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center shadow-lg shadow-success/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "Rejected":
        return (
          <div className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center shadow-lg shadow-danger/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "Login":
      case "Logout":
        return (
          <div className="w-8 h-8 rounded-full bg-info text-white flex items-center justify-center shadow-lg shadow-info/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-5 0a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V9zM2 17h16" />
            </svg>
          </div>
        );
      case "Medicine Created":
      case "Medicine Updated":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-warning text-white flex items-center justify-center shadow-lg shadow-warning/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
            </svg>
          </div>
        );
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-color pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark-navy tracking-tight">Action Logs</h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Monitor and track every administrator action performed within the MediApprove system for security, compliance, and auditing purposes.
          </p>
        </div>

        {/* Real-time Simulator Panel */}
        <div className="bg-white border border-border-color p-3.5 rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] flex flex-col gap-2 max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulate Live Actions</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => simulateAction("Login")}
              className="text-[10px] font-bold px-2 py-1 bg-info/10 text-info border border-info/10 hover:bg-info hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              + Login
            </button>
            <button
              onClick={() => simulateAction("Logout")}
              className="text-[10px] font-bold px-2 py-1 bg-slate-500/10 text-slate-500 border border-slate-500/10 hover:bg-slate-500 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              + Logout
            </button>
            <button
              onClick={() => simulateAction("Profile")}
              className="text-[10px] font-bold px-2 py-1 bg-warning/10 text-warning border border-warning/10 hover:bg-warning hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              + Profile Update
            </button>
            <button
              onClick={() => simulateAction("Client")}
              className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary border border-primary/10 hover:bg-primary hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              + Client Reg
            </button>
            <button
              onClick={() => simulateAction("Medicine")}
              className="text-[10px] font-bold px-2 py-1 bg-purple-500/10 text-purple-600 border border-purple-500/10 hover:bg-purple-600 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              + Create Med
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Actions Card */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Total Actions</span>
              <h3 className="text-3xl font-extrabold text-dark-navy mt-1 tracking-tight">{totalLogsCount}</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-5">All time actions recorded</p>
        </Card>

        {/* Approvals Card */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Approvals</span>
              <h3 className="text-3xl font-extrabold text-[#22C55E] mt-1 tracking-tight">{approvalsCount}</h3>
            </div>
            <div className="p-3 bg-[#22C55E]/10 text-[#22C55E] rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-5">Verified approved Listings</p>
        </Card>

        {/* Rejections Card */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Rejections</span>
              <h3 className="text-3xl font-extrabold text-[#EF4444] mt-1 tracking-tight">{rejectionsCount}</h3>
            </div>
            <div className="p-3 bg-[#EF4444]/10 text-[#EF4444] rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-5">Rejected applications log</p>
        </Card>

        {/* Today's Activities Card */}
        <Card className="hover:translate-y-[-2px] transition-transform duration-200 select-none animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Today's Activities</span>
              <h3 className="text-3xl font-extrabold text-info mt-1 tracking-tight">{todayCount}</h3>
            </div>
            <div className="p-3 bg-info/10 text-info rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-5">Actions logged today</p>
        </Card>

      </div>

      {/* SEARCH, FILTERS, EXPORT TOOLBAR */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
        
        {/* Large Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by admin, medicine, action type, or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 text-sm text-dark-navy bg-white border border-border-color rounded-2xl outline-hidden shadow-[0_2px_10px_rgba(15,41,64,0.02)] placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all duration-200 animate-search-focus"
          />
          <div className="absolute left-4 top-3.5 text-slate-400">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Buttons Controls Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Filters Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
                setIsDateOpen(false);
                setIsExportOpen(false);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white border rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] transition-all cursor-pointer select-none ${
                isFilterOpen || selectedAdminFilter !== "All" || selectedActionFilter !== "All"
                  ? "border-primary text-primary"
                  : "border-border-color hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filter
              {(selectedAdminFilter !== "All" || selectedActionFilter !== "All") && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-60 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-4 space-y-4 animate-fade-in">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Filter by Admin</span>
                    <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                      {admins.map((adm) => (
                        <button
                          key={adm}
                          onClick={() => {
                            setSelectedAdminFilter(adm);
                            setCurrentPage(1);
                            setIsFilterOpen(false);
                          }}
                          className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                            selectedAdminFilter === adm ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {adm}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border-color pt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Filter by Action</span>
                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                      {actions.map((act) => (
                        <button
                          key={act}
                          onClick={() => {
                            setSelectedActionFilter(act);
                            setCurrentPage(1);
                            setIsFilterOpen(false);
                          }}
                          className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                            selectedActionFilter === act ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Date Range Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDateOpen(!isDateOpen);
                setIsFilterOpen(false);
                setIsSortOpen(false);
                setIsExportOpen(false);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white border rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] transition-all cursor-pointer select-none ${
                isDateOpen || selectedDateFilter !== "All"
                  ? "border-primary text-primary"
                  : "border-border-color hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date Range
              {selectedDateFilter !== "All" && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            {isDateOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDateOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-3 flex flex-col gap-1.5 animate-fade-in">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mb-1">Select Range</span>
                  <button
                    onClick={() => { setSelectedDateFilter("All"); setCurrentPage(1); setIsDateOpen(false); }}
                    className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl ${selectedDateFilter === "All" ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => { setSelectedDateFilter("Today"); setCurrentPage(1); setIsDateOpen(false); }}
                    className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl ${selectedDateFilter === "Today" ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => { setSelectedDateFilter("7days"); setCurrentPage(1); setIsDateOpen(false); }}
                    className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl ${selectedDateFilter === "7days" ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => { setSelectedDateFilter("30days"); setCurrentPage(1); setIsDateOpen(false); }}
                    className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl ${selectedDateFilter === "30days" ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    Last 30 Days
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sort Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
                setIsDateOpen(false);
                setIsExportOpen(false);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white border rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] transition-all cursor-pointer select-none ${
                isSortOpen || sortField !== "id" || sortOrder !== "desc"
                  ? "border-primary text-primary"
                  : "border-border-color hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort
            </button>

            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-3 flex flex-col gap-1.5 animate-fade-in">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mb-1">Sort Field</span>
                  <button
                    onClick={() => { setSortField("id"); setIsSortOpen(false); }}
                    className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl ${sortField === "id" ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    Log ID
                  </button>
                  <button
                    onClick={() => { setSortField("timestamp"); setIsSortOpen(false); }}
                    className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl ${sortField === "timestamp" ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    Timestamp
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mt-2 mb-1">Sort Order</span>
                  <button
                    onClick={() => { setSortOrder("desc"); setIsSortOpen(false); }}
                    className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl ${sortOrder === "desc" ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    Descending
                  </button>
                  <button
                    onClick={() => { setSortOrder("asc"); setIsSortOpen(false); }}
                    className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl ${sortOrder === "asc" ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    Ascending
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsExportOpen(!isExportOpen);
                setIsFilterOpen(false);
                setIsSortOpen(false);
                setIsDateOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] hover:bg-slate-50 transition-all cursor-pointer select-none"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>

            {isExportOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-44 bg-white border border-border-color rounded-2xl shadow-xl z-20 p-2 flex flex-col gap-1 animate-fade-in">
                  <button
                    onClick={() => { handleExportCSV(); setIsExportOpen(false); }}
                    className="text-left text-xs font-semibold px-2.5 py-2 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                  <button
                    onClick={() => { handleExportPDF(); setIsExportOpen(false); }}
                    className="text-left text-xs font-semibold px-2.5 py-2 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF Report
                  </button>
                  <button
                    onClick={() => { handleExportJSON(); setIsExportOpen(false); }}
                    className="text-left text-xs font-semibold px-2.5 py-2 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Export JSON Raw
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center p-2.5 text-slate-400 hover:text-dark-navy bg-white border border-border-color rounded-2xl shadow-[0_2px_10px_rgba(15,41,64,0.02)] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Logs"
          >
            <svg className={`w-5 h-5 ${isRefreshing ? "animate-spin text-primary" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
            </svg>
          </button>

        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
        
        {/* COLUMN 1, 2, 3: AUDIT TABLE & PAGINATION */}
        <div className="lg:col-span-3 flex flex-col">
          
          {currentLogs.length === 0 ? (
            /* EMPTY STATE SCREEN */
            <Card className="flex flex-col items-center justify-center text-center py-20 px-6 select-none animate-fade-in h-full">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-border-color text-slate-300 mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-dark-navy tracking-tight">No Activity Logs</h3>
              <p className="text-sm font-semibold text-slate-400 mt-2 max-w-sm leading-relaxed">
                All administrator actions will automatically appear here once the system begins recording audit events.
              </p>
              <Link href="/dashboard" className="mt-6">
                <Button>Return to Dashboard</Button>
              </Link>
            </Card>
          ) : (
            /* DATA AUDIT TABLE CARD */
            <Card className="p-0 overflow-hidden shadow-sm animate-fade-in flex flex-col h-full justify-between flex-1">
              <div className="w-full flex-1">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border-color select-none">
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Log ID</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date & Time</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Medicine Name</th>
                      <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {currentLogs.map((log) => {
                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/50 transition-colors duration-150 group"
                        >
                          {/* Log ID */}
                          <td className="px-5 py-3.5 font-mono text-xs font-extrabold text-slate-600 group-hover:text-primary transition-colors">
                            {log.id}
                          </td>

                          {/* Timestamp */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="text-xs font-bold text-dark-navy">{log.timestamp.split(", ")[0]}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">{log.timestamp.split(", ")[1]}</div>
                          </td>

                          {/* Admin Details */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 border border-border-color flex items-center justify-center font-bold text-[10px] select-none shrink-0">
                                {log.adminName.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <div className="text-xs font-extrabold text-dark-navy leading-tight">{log.adminName}</div>
                                <div className="text-[10px] font-semibold text-slate-400">{log.adminEmail}</div>
                              </div>
                            </div>
                          </td>

                          {/* Action Status Badge */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getActionBadgeClass(log.action)}`}>
                              {log.newStatus || log.action}
                            </span>
                          </td>

                          {/* Medicine Name */}
                          <td className="px-5 py-3.5">
                            {log.medicineName && log.medicineName !== "N/A" ? (
                              <div>
                                <div className="text-xs font-extrabold text-dark-navy leading-tight">{log.medicineName}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5 font-semibold font-mono">
                                  ID: {log.medicineId}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">&mdash;</span>
                            )}
                          </td>

                          {/* Details Row Buttons */}
                          <td className="px-5 py-3.5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setSelectedLog(log)}
                                className="p-1.5 bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-400 rounded-lg border border-border-color transition-colors cursor-pointer"
                                title="View details"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => triggerSingleDownload(log)}
                                className="p-1.5 bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-400 rounded-lg border border-border-color transition-colors cursor-pointer"
                                title="Download Log"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION PANEL */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border-t border-border-color select-none">
                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                  Showing <span className="font-extrabold text-dark-navy">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-extrabold text-dark-navy">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
                  <span className="font-extrabold text-dark-navy">{totalItems}</span> Logs
                </span>

                <div className="flex items-center gap-1">
                  {/* Prev Button */}
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

                  {/* Dynamic page numbers */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    // Render logic for truncated pagination
                    if (totalPages > 5 && pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                      if (pageNum === 2 && currentPage > 3) {
                        return <span key="dots-start" className="px-2 text-slate-400 font-bold text-xs select-none">...</span>;
                      }
                      if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                        return <span key="dots-end" className="px-2 text-slate-400 font-bold text-xs select-none">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`w-9 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-primary text-white shadow-md shadow-primary/10"
                            : "bg-white text-slate-500 border border-border-color hover:bg-slate-50 hover:text-dark-navy"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 border rounded-xl transition-all cursor-pointer ${
                      currentPage === totalPages ? "text-slate-300 bg-slate-50 border-slate-200" : "text-slate-500 bg-white border-border-color hover:bg-slate-50 hover:text-dark-navy"
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

        {/* COLUMN 4: VERTICAL ACTIVITY TIMELINE */}
        <div className="flex flex-col">
          <Card className="p-6 shadow-sm flex flex-col space-y-5 animate-fade-in h-full flex-1 justify-between">
            <div>
              <h3 className="text-base font-bold text-dark-navy tracking-tight">Recent Activity Feed</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Live chronological log transitions</p>
            </div>

            {/* Timeline Tree */}
            <div className="relative border-l-2 border-slate-100 pl-6 ml-3 flex-1 flex flex-col justify-between py-1.5 min-h-[340px]">
              
              {actionLogs.slice(0, 5).map((log) => {
                const parts = log.timestamp.split(", ");
                const time = parts[1] || parts[0];

                return (
                  <div key={log.id} className="relative select-none hover:translate-x-1 transition-transform duration-200 py-1">
                    {/* Floating Connection Node Icon */}
                    <div className="absolute -left-10 top-0.5">
                      {getTimelineIcon(log.action)}
                    </div>
                    
                    {/* Node details */}
                    <div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md font-mono">{time}</span>
                      <h4 className="text-xs font-bold text-dark-navy mt-1">{log.remarks}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                        by {log.adminName} &bull; <span className="font-mono text-[9px]">{log.id}</span>
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          </Card>
        </div>

      </div>

      {/* DETAIL MODAL OVERLAY */}
      <ActionLogDetailsModal
        isOpen={selectedLog !== null}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />

    </main>
  );
}
