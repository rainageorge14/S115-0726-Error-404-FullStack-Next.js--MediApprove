"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { useMedicines, Notification } from "@/components/ui/MedicineContext";
import { Card } from "@/components/ui/Card";
import { CheckSquare, Square, CheckCircle, Trash2, Archive } from "lucide-react";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { NotificationStats } from "@/components/notifications/NotificationStats";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationSearch } from "@/components/notifications/NotificationSearch";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";
import { NotificationPagination } from "@/components/notifications/NotificationPagination";
import { NotificationEmpty } from "@/components/notifications/NotificationEmpty";
import { NotificationSkeleton } from "@/components/notifications/NotificationSkeleton";

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsPageContent />
    </DashboardLayout>
  );
}

function NotificationsPageContent() {
  const {
    notifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useMedicines();

  // Search and filter states
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Selection states for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Refresh Loader Simulation
  const [loading, setLoading] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Notifications list refreshed successfully.");
    }, 800);
  };

  // Reset pagination on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [search, activeTab, dateFilter]);

  // Date filter comparison helper
  const matchesDateFilter = (createdAt: string) => {
    if (dateFilter === "all") return true;
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / 86400000;

    if (dateFilter === "today") {
      return date.toDateString() === now.toDateString();
    }
    if (dateFilter === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return date.toDateString() === yesterday.toDateString();
    }
    if (dateFilter === "7days") {
      return diffDays <= 7;
    }
    if (dateFilter === "30days") {
      return diffDays <= 30;
    }
    return true;
  };

  // Filtered notifications
  const filtered = (notifications || []).filter((n) => {
    // 1. Search (Medicine Name, Admin Name, Company Name, Notification Title, Action Type)
    const searchLower = search.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(searchLower) ||
      n.description.toLowerCase().includes(searchLower) ||
      n.medicineName.toLowerCase().includes(searchLower) ||
      n.adminName.toLowerCase().includes(searchLower) ||
      n.type.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // 2. Date Filter
    if (!matchesDateFilter(n.createdAt)) return false;

    // 3. Tab Type Filter (All, Unread, Approvals, Rejections, Pending, System, Security, Reports)
    if (activeTab !== "all") {
      if (activeTab === "unread" && n.isRead) return false;
      if (activeTab === "approvals" && n.type !== "approval") return false;
      if (activeTab === "rejections" && n.type !== "rejection") return false;
      if (activeTab === "pending" && n.type !== "pending") return false;
      if (activeTab === "system" && !["login", "report", "pending"].includes(n.type)) return false;
      if (activeTab === "security" && n.type !== "security") return false;
      if (activeTab === "reports" && n.type !== "report") return false;
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Checkbox handlers
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const paginatedIds = paginated.map((n) => n.id);
    const allSelectedOnPage = paginatedIds.every((id) => selectedIds.includes(id));

    if (allSelectedOnPage) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedIds.includes(id)));
    } else {
      setSelectedIds((prev) => {
        const union = new Set([...prev, ...paginatedIds]);
        return Array.from(union);
      });
    }
  };

  // Bulk actions
  const handleBulkMarkRead = () => {
    selectedIds.forEach((id) => markAsRead(id));
    setSelectedIds([]);
    showToast(`${selectedIds.length} notifications marked as read`);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteNotification(id));
    setSelectedIds([]);
    showToast(`${selectedIds.length} notifications deleted`);
  };

  const handleBulkArchive = () => {
    selectedIds.forEach((id) => markAsRead(id)); // Mock archive as marking as read
    setSelectedIds([]);
    showToast(`${selectedIds.length} notifications archived`);
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setDrawerOpen(true);
    // Mark as read when viewing
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  return (
    <main className="flex-1 pt-4 pb-4 px-6 flex flex-col bg-[#F8FAFC] overflow-hidden select-none font-sans h-[calc(100vh-72px)]">
      
      {/* Toast alert popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-dark-navy text-white rounded-xl shadow-2xl border border-primary/20 animate-fade-in select-none">
          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Content Header / Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-3.5 select-none flex-wrap">
        {/* Search bar */}
        <NotificationSearch value={search} onChange={setSearch} />

        {/* Right side items */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Badge count indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14B8C5]/10 rounded-full border border-[#14B8C5]/20">
            <span className="w-2 h-2 rounded-full bg-[#14B8C5] animate-ping" />
            <span className="text-xs font-bold text-[#14B8C5]">{unreadCount} Unread</span>
          </div>

          {/* Mark All as Read Button */}
          <button
            onClick={() => {
              markAllAsRead();
              showToast("All notifications marked as read");
            }}
            disabled={unreadCount === 0}
            className="px-4 h-[42px] text-xs font-bold text-[#14B8C5] bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* TOP Summary Cards */}
      <NotificationStats notifications={notifications || []} />

      {/* Main card */}
      <Card noPadding className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] flex flex-col">
        
        {/* Filters chips and date filter toolbar */}
        <NotificationFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {/* Bulk Action Controls */}
        {paginated.length > 0 && (
          <div className="px-5 py-3 border-b border-[#F1F5F9] bg-slate-50/50 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer select-none"
              >
                {paginated.map((n) => n.id).every((id) => selectedIds.includes(id)) ? (
                  <CheckSquare className="w-4.5 h-4.5 text-primary" />
                ) : (
                  <Square className="w-4.5 h-4.5 text-slate-300" />
                )}
                <span>Select All on Page</span>
              </button>
              
              {selectedIds.length > 0 && (
                <span className="text-[11px] font-bold text-slate-400">
                  {selectedIds.length} Selected
                </span>
              )}
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2.5 animate-fade-in">
                <button
                  onClick={handleBulkMarkRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-primary bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-primary/80" />
                  <span>Mark Read</span>
                </button>
                <button
                  onClick={handleBulkArchive}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-400" />
                  <span>Archive</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-danger bg-white border border-danger/25 rounded-lg hover:bg-red-50 transition-colors cursor-pointer select-none"
                >
                  <Trash2 className="w-3.5 h-3.5 text-danger/80" />
                  <span>Delete Selected</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scrollable list */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <NotificationSkeleton />
          ) : paginated.length > 0 ? (
            paginated.map((n) => {
              const isChecked = selectedIds.includes(n.id);
              return (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                  onViewDetails={handleViewDetails}
                  isChecked={isChecked}
                  onCheckToggle={() => handleSelectToggle(n.id)}
                />
              );
            })
          ) : (
            <NotificationEmpty onRefresh={handleRefresh} />
          )}
        </div>

        {/* Footer Pagination */}
        {filtered.length > itemsPerPage && (
          <NotificationPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            startIndex={startIndex}
            endIndex={startIndex + itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

      </Card>

      {/* Side Details Drawer */}
      <NotificationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notification={selectedNotification}
      />
      
    </main>
  );
}
