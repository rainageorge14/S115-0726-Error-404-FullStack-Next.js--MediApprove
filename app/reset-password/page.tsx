"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { AuthFooter } from "@/components/ui/AuthFooter";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Real-time validations
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const isFormValid =
    isMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setResetStatus("error");
      setStatusMessage("Invalid reset link. Token is missing.");
      return;
    }

    if (!isFormValid) {
      setResetStatus("error");
      setStatusMessage("Please ensure all password requirements are met.");
      return;
    }

    setIsLoading(true);
    setResetStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setResetStatus("success");
        setStatusMessage("Password changed successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setResetStatus("error");
        setStatusMessage(data.message || "Failed to reset password.");
      }
    } catch {
      setIsLoading(false);
      setResetStatus("error");
      setStatusMessage("A connection error occurred. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 bg-danger/10 border border-danger/20 rounded-2xl animate-shake my-6">
        <div className="flex items-center justify-center w-12 h-12 bg-danger text-white rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h4 className="text-lg font-bold text-dark-navy">Invalid Reset Link</h4>
        <p className="text-sm text-slate-500 mt-2">
          This password reset link is invalid because the token parameter is missing.
        </p>
        <div className="w-full mt-6">
          <Link href="/" className="w-full block">
            <Button variant="outline">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        title="Reset Password"
        subtitle="Choose a strong, secure new password for your MediApprove account."
      />

      {resetStatus === "success" ? (
        <div className="flex flex-col items-center justify-center text-center p-6 bg-success/10 border border-success/20 rounded-2xl animate-fade-in my-6">
          <div className="flex items-center justify-center w-12 h-12 bg-success text-white rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-dark-navy">Password Updated</h4>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {statusMessage}
          </p>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          {resetStatus === "error" && (
            <div className="p-3.5 text-sm font-semibold text-danger bg-danger/10 border border-danger/20 rounded-xl animate-shake">
              {statusMessage}
            </div>
          )}

          {/* New Password Input */}
          <PasswordInput
            id="password"
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {/* Confirm Password Input */}
          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {/* Password Requirements Checklist */}
          <div className="p-4 bg-slate-50 rounded-xl border border-border-color flex flex-col gap-2 mt-2">
            <span className="text-xs font-bold text-dark-navy/70 uppercase tracking-wide">
              Password Requirements
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-1 text-xs">
              <RequirementItem satisfied={isMinLength} label="Min. 8 characters" />
              <RequirementItem satisfied={hasUppercase} label="At least 1 uppercase" />
              <RequirementItem satisfied={hasLowercase} label="At least 1 lowercase" />
              <RequirementItem satisfied={hasNumber} label="At least 1 number" />
              <RequirementItem satisfied={hasSpecial} label="At least 1 special char" />
              <RequirementItem satisfied={passwordsMatch} label="Passwords match" />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} disabled={!isFormValid} className="mt-2.5">
            Reset Password
          </Button>

          <div className="text-center mt-2.5 text-xs sm:text-sm font-semibold text-slate-500">
            Cancel and return to{" "}
            <Link
              href="/"
              className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors ml-1.5"
            >
              Sign In
            </Link>
          </div>
        </form>
      )}
    </>
  );
}

function RequirementItem({ satisfied, label }: { satisfied: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {satisfied ? (
        <span className="text-success flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </span>
      ) : (
        <span className="text-slate-300 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        </span>
      )}
      <span className={`font-semibold ${satisfied ? "text-slate-600" : "text-slate-400"}`}>
        {label}
      </span>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-8">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-xs font-semibold text-slate-500 mt-4">Loading Reset Form...</span>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
      <AuthFooter />
    </AuthLayout>
  );
}
