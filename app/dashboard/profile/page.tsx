"use client";

import React, { useState, useEffect } from "react";
import { useMedicines } from "@/components/ui/MedicineContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountDetailsCard } from "@/components/profile/AccountDetailsCard";

export default function ProfilePage() {
  const { addActionLog } = useMedicines();

  // Profile data states
  const [fullName, setFullName] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.name || "Admin User";
        } catch (e) {}
      }
    }
    return "Admin User";
  });
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.email || "admin@netmeds.com";
        } catch (e) {}
      }
    }
    return "admin@netmeds.com";
  });
  const [phone, setPhone] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.phone || "+91 96165 43210";
        } catch (e) {}
      }
    }
    return "+91 96165 43210";
  });
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.role === "ADMIN" ? "Super Admin" : parsed.role || "Super Admin";
        } catch (e) {}
      }
    }
    return "Super Admin";
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("profilePhoto");
    }
    return null;
  });

  const handleAvatarChange = (url: string | null) => {
    setAvatarUrl(url);
    if (url) {
      localStorage.setItem("profilePhoto", url);
      window.dispatchEvent(new Event("profilePhotoChanged"));
      addActionLog({
        adminId: "admin-1",
        adminName: fullName,
        adminEmail: email,
        adminRole: "Super Admin",
        action: "Profile Updated",
        medicineId: "N/A",
        medicineName: "N/A",
        ipAddress: "192.168.1.1",
        browser: "Chrome",
        os: "Windows 11",
        device: "Desktop",
        remarks: "Super Admin updated profile picture"
      });
      setToastMessage("Profile picture updated");
    } else {
      localStorage.removeItem("profilePhoto");
      window.dispatchEvent(new Event("profilePhotoChanged"));
      addActionLog({
        adminId: "admin-1",
        adminName: fullName,
        adminEmail: email,
        adminRole: "Super Admin",
        action: "Profile Updated",
        medicineId: "N/A",
        medicineName: "N/A",
        ipAddress: "192.168.1.1",
        browser: "Chrome",
        os: "Windows 11",
        device: "Desktop",
        remarks: "Super Admin removed profile picture"
      });
      setToastMessage("Profile picture removed");
    }
  };



  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = "Full Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = "Invalid Email Address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone Number cannot be empty";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Audit Event Linkages
    addActionLog({
      adminId: "admin-1",
      adminName: fullName,
      adminEmail: email,
      adminRole: "Super Admin",
      action: "Profile Updated",
      medicineId: "N/A",
      medicineName: "N/A",
      ipAddress: "192.168.1.1",
      browser: "Chrome",
      os: "Windows 11",
      device: "Desktop",
      remarks: "Super Admin updated profile details"
    });

    localStorage.setItem("admin", JSON.stringify({ name: fullName, email, phone, role: role === "Super Admin" ? "ADMIN" : role }));
    window.dispatchEvent(new Event("adminProfileChanged"));

    setToastMessage("Profile changes saved successfully");
  };

  return (
    <main className="flex-1 p-[24px] flex flex-col bg-[#F8FAFC] lg:h-[calc(100vh-72px)] lg:overflow-hidden select-none min-h-0">
      
      {/* Toast popup alerts */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-dark-navy text-white rounded-xl shadow-2xl border border-primary/20 animate-fade-in select-none">
          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[20px] items-start">
        
        {/* Profile Update Section (65% width) */}
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <ProfileForm
            fullName={fullName}
            email={email}
            phone={phone}
            role={role}
            errors={errors}
            setFullName={setFullName}
            setEmail={setEmail}
            setPhone={setPhone}
            onSubmit={handleProfileSubmit}
          />
        </div>

        {/* Right Column (35% width): Account Details */}
        <div className="flex flex-col">
          <AccountDetailsCard
            avatarUrl={avatarUrl}
            onAvatarChange={handleAvatarChange}
          />
        </div>

      </div>

    </main>
  );
}
