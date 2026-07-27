"use client";

import React, { useState, useEffect } from "react";
import { useMedicines } from "@/components/ui/MedicineContext";
import { GeneralSettingsCard, GeneralSettingsData } from "@/components/settings/GeneralSettingsCard";
import { NotificationSettingsCard, NotificationSettingsData } from "@/components/settings/NotificationSettingsCard";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";

export default function SettingsPage() {
  const { addActionLog } = useMedicines();
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

  // --- Actions ---
  const handleSaveGeneral = (data: GeneralSettingsData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("org", data.org);
      localStorage.setItem("timezone", data.timezone);
      localStorage.setItem("dateFormat", data.dateFormat);
      localStorage.setItem("timeFormat", data.timeFormat);
      localStorage.setItem("theme", data.theme);

      // Apply the theme immediately
      if (data.theme === "dark" || (data.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      window.dispatchEvent(new Event("themeChanged"));
    }

    addActionLog({
      adminId: "admin-1",
      adminName: "Admin User",
      adminEmail: "admin@mediapprove.com",
      adminRole: "Super Admin",
      action: "Profile Updated",
      medicineId: "N/A",
      medicineName: "N/A",
      ipAddress: "192.168.1.1",
      browser: "Chrome",
      os: "Windows 11",
      device: "Desktop",
      remarks: `Updated general preferences (Org: ${data.org})`
    });
    showToast("General settings updated successfully");
  };

  const handleUpdateNotifications = (data: NotificationSettingsData) => {
    addActionLog({
      adminId: "admin-1",
      adminName: "Admin User",
      adminEmail: "admin@mediapprove.com",
      adminRole: "Super Admin",
      action: "Profile Updated",
      medicineId: "N/A",
      medicineName: "N/A",
      ipAddress: "192.168.1.1",
      browser: "Chrome",
      os: "Windows 11",
      device: "Desktop",
      remarks: "Updated email/browser notification filters"
    });
    showToast("Notification preferences updated");
  };

  // Removed Security and System Preferences Handlers


  // --- Danger Zone ---
  const handleDeactivate = () => {
    showToast("Account deactivation request sent to corporate admin");
  };

  const handleLogoutAll = () => {
    showToast("All active sessions logged out successfully");
  };

  const handleDeleteSessions = () => {
    showToast("All temporary sessions deleted");
  };

  const handleDeleteAccount = () => {
    showToast("Account deleted successfully. Logging out...");
  };

  return (
    <main className="flex-1 p-[24px] flex flex-col bg-[#F8FAFC] lg:h-[calc(100vh-72px)] lg:overflow-hidden select-none min-h-0">
      
      {/* Toast Alert Popups */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-dark-navy text-white rounded-xl shadow-2xl border border-primary/20 animate-fade-in select-none">
          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* SINGLE COLUMN FULL-WIDTH LAYOUT */}
      <div className="flex flex-col gap-[20px] flex-1 min-h-0 lg:overflow-y-auto pr-1">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] items-stretch">
          {/* Card 1: General */}
          <GeneralSettingsCard onSave={handleSaveGeneral} />

          {/* Card 2: Notifications */}
          <NotificationSettingsCard onChange={handleUpdateNotifications} />
        </div>

        {/* Card 5: Danger Zone */}
        <div className="mt-1">
          <DangerZoneCard
            onDeactivate={handleDeactivate}
            onLogoutAll={handleLogoutAll}
            onDeleteSessions={handleDeleteSessions}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>

      </div>

    </main>
  );
}
