"use client";

import React, { useState, useEffect } from "react";
import { useMedicines } from "@/components/ui/MedicineContext";
import { GeneralSettingsCard, GeneralSettingsData } from "@/components/settings/GeneralSettingsCard";
import { NotificationSettingsCard, NotificationSettingsData } from "@/components/settings/NotificationSettingsCard";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";
import { SecuritySettingsCard, SecuritySettingsData } from "@/components/settings/SecuritySettingsCard";
import { SystemStatusCard } from "@/components/settings/SystemStatusCard";

export default function SettingsPage() {
  const { addActionLog, setTimeFormat, setDateFormat } = useMedicines();
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
  const handleSaveGeneral = async (data: GeneralSettingsData) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeFormat: data.timeFormat,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        showToast(resData.message || "Failed to save preferences to database");
        return;
      }

      // Sync settings to the global Context state
      setTimeFormat(data.timeFormat);
      setDateFormat(data.dateFormat);

      if (typeof window !== "undefined") {
        localStorage.setItem("org", data.org);
        localStorage.setItem("timezone", data.timezone);
        localStorage.setItem("dateFormat", data.dateFormat);
        localStorage.setItem("timeFormat", data.timeFormat);
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
        remarks: `Updated general preferences (TimeFormat: ${data.timeFormat})`
      });
      showToast("General settings updated successfully");
    } catch (e) {
      console.error("Save settings error:", e);
      showToast("Failed to save settings");
    }
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
      remarks: `Updated notification filters (Approvals: ${data.approvalAlerts}, Rejections: ${data.rejectedAlerts})`
    });
    showToast("Notification preferences updated");
  };

  const handleUpdateSecurity = async (data: SecuritySettingsData) => {
    if (data.newPassword) {
      if (data.newPassword !== data.confirmPassword) {
        showToast("Passwords do not match");
        return;
      }
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: data.newPassword,
          }),
        });
        const resData = await res.json();
        if (!res.ok || !resData.success) {
          showToast(resData.message || "Failed to update password");
          return;
        }
        showToast("Password updated successfully");
      } catch (e) {
        console.error("Update password error:", e);
        showToast("Failed to update password");
        return;
      }
    }

    addActionLog({
      adminId: "admin-1",
      adminName: "Admin User",
      adminEmail: "admin@mediapprove.com",
      adminRole: "Super Admin",
      action: "Password Changed",
      medicineId: "N/A",
      medicineName: "N/A",
      ipAddress: "192.168.1.1",
      browser: "Chrome",
      os: "Windows 11",
      device: "Desktop",
      remarks: `Updated password or security settings (TFA: ${data.tfa})`
    });
    showToast("Security settings updated successfully");
  };

  // --- Danger Zone ---
  const handleDeactivate = () => {
    showToast("Account deactivation request sent to corporate admin");
  };

  const handleLogoutAll = async () => {
    try {
      const res = await fetch("/api/auth/logout-all", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("All active sessions logged out successfully");
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin");
        }
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        showToast(data.message || "Failed to logout from all devices");
      }
    } catch (e) {
      console.error("Logout all error:", e);
      showToast("Failed to logout from all devices");
    }
  };

  const handleDeleteSessions = () => {
    showToast("All temporary sessions deleted");
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Account deleted successfully. Redirecting...");
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin");
        }
        setTimeout(() => {
          window.location.href = "/signup";
        }, 1000);
      } else {
        showToast(data.message || "Failed to delete account");
      }
    } catch (e) {
      console.error("Delete account error:", e);
      showToast("Failed to delete account");
    }
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

          {/* Card 3: Security */}
          <SecuritySettingsCard onUpdate={handleUpdateSecurity} />

          {/* Card 4: System Status */}
          <SystemStatusCard
            dbConnected={true}
            apiRunning={true}
            authHealthy={true}
            storageUsage={24}
          />
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
