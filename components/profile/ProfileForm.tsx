import React from "react";
import { Card } from "@/components/ui/Card";
import { InputField } from "./InputField";
import { PasswordInput } from "./PasswordInput";
import { PrimaryButton } from "./PrimaryButton";

interface ProfileFormProps {
  fullName: string;
  email: string;
  phone: string;
  errors: Record<string, string>;
  setFullName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmNewPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  currentPasswordRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  fullName,
  email,
  phone,
  errors,
  setFullName,
  setEmail,
  setPhone,
  setCurrentPassword,
  setNewPassword,
  setConfirmNewPassword,
  onSubmit,
  currentPasswordRef,
}) => {
  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] flex flex-col h-full justify-between">
      <div className="border-b border-[#E2E8F0] pb-4 mb-4 select-none text-left">
        <h3 className="text-[22px] font-semibold text-[#0F172A] tracking-tight">Admin Information</h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">Update your personal information</p>
      </div>

      <form onSubmit={onSubmit} className="flex-1 flex flex-col justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3.5">
          {/* Full Name */}
          <InputField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            placeholder="Enter full name"
          />

          {/* Email Address */}
          <InputField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="Enter email address"
            type="email"
          />

          {/* Phone Number */}
          <InputField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="Enter phone number"
          />

          {/* Current Password */}
          <PasswordInput
            ref={currentPasswordRef}
            label="Current Password"
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            placeholder="Enter current password"
          />

          {/* New Password */}
          <PasswordInput
            label="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            placeholder="Enter new password"
          />

          {/* Confirm New Password */}
          <PasswordInput
            label="Confirm New Password"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            error={errors.confirmNewPassword}
            placeholder="Confirm new password"
          />
        </div>

        {/* Update Profile Button */}
        <div className="pt-2 md:col-span-2">
          <PrimaryButton>Update Profile</PrimaryButton>
        </div>
      </form>
    </Card>
  );
};
