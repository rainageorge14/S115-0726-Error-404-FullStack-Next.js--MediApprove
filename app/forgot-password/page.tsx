"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { AuthFooter } from "@/components/ui/AuthFooter";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const validateForm = () => {
    if (!email) {
      setEmailError("Email address is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setRequestStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setRequestStatus("success");
        setStatusMessage(data.message || "A secure password reset link has been emailed to you.");
      } else {
        setRequestStatus("error");
        setStatusMessage(data.message || "An error occurred. Please try again.");
      }
    } catch {
      setIsLoading(false);
      setRequestStatus("error");
      setStatusMessage("A connection error occurred. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Forgot Password"
        subtitle="Provide your registered email address below, and we will send you instructions to reset your password safely."
      />

      {requestStatus === "success" ? (
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
          <h4 className="text-lg font-bold text-dark-navy">Request Sent</h4>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            If an account with this email exists, a password reset link has been sent.
          </p>
          <div className="w-full mt-6">
            <Link href="/" className="w-full block">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRequestReset} className="flex flex-col gap-5">
          {requestStatus === "error" && (
            <div className="p-3.5 text-sm font-semibold text-danger bg-danger/10 border border-danger/20 rounded-xl animate-shake">
              {statusMessage}
            </div>
          )}

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="admin@mediapprove.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            error={emailError}
            required
            autoComplete="email"
          />

          <Button type="submit" isLoading={isLoading} className="mt-2.5">
            Continue
          </Button>

          <div className="text-center mt-2.5 text-xs sm:text-sm font-semibold text-slate-500">
            Remember your password?{" "}
            <Link
              href="/"
              className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors ml-1.5"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}

      <AuthFooter />
    </AuthLayout>
  );
}
