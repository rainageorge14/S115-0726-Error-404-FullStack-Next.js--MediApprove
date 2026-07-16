"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMedicines } from "@/components/ui/MedicineContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountDetailsCard } from "@/components/profile/AccountDetailsCard";

export default function ProfilePage() {
  const { addActionLog } = useMedicines();

  // Profile data states
  const [fullName, setFullName] = useState("Admin User");
  const [email, setEmail] = useState("admin@netmeds.com");
  const [phone, setPhone] = useState("+91 96165 43210");

  // Passwords state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState("");

  // Ref for password focus scroll
  const currentPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Load avatar from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("profilePhoto");
      if (stored) {
        setAvatarUrl(stored);
      }
    }
  }, []);

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

    // Password updates check
    const isChangingPassword = currentPassword || newPassword || confirmNewPassword;
    if (isChangingPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Current Password is required to configure new credentials";
      }
      if (!newPassword || newPassword.length < 6) {
        newErrors.newPassword = "Password Too Short (min 6 characters)";
      }
      if (newPassword !== confirmNewPassword) {
        newErrors.confirmNewPassword = "Passwords Don't Match";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Audit Event Linkages
    if (isChangingPassword) {
      addActionLog({
        adminId: "admin-1",
        adminName: fullName,
        adminEmail: email,
        adminRole: "Super Admin",
        action: "Password Changed",
        medicineId: "N/A",
        medicineName: "N/A",
        ipAddress: "192.168.1.1",
        browser: "Chrome",
        os: "Windows 11",
        device: "Desktop",
        remarks: "Super Admin updated password credentials"
      });
    } else {
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
    }

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
            errors={errors}
            setFullName={setFullName}
            setEmail={setEmail}
            setPhone={setPhone}
            setCurrentPassword={setCurrentPassword}
            setNewPassword={setNewPassword}
            setConfirmNewPassword={setConfirmNewPassword}
            onSubmit={handleProfileSubmit}
            currentPasswordRef={currentPasswordRef}
          />
        </div>

        {/* Right Column (35% width): Account Details */}
        <div className="flex flex-col">
          <AccountDetailsCard
            role="Super Admin"
            memberSince="01 Jan 2024"
            lastLogin="20 May 2024, 10:45 AM"
            avatarUrl={avatarUrl}
            onAvatarChange={handleAvatarChange}
          />
        </div>

      </div>

    </main>
  );
}
