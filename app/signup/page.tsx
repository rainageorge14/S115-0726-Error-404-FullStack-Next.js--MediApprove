"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { AuthFooter } from "@/components/ui/AuthFooter";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  
  // Field states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation & Loading states
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Inline Validation
  const validateForm = () => {
    let isValid = true;

    // Full Name
    if (!fullName.trim()) {
      setFullNameError("Please enter your full name.");
      isValid = false;
    } else {
      setFullNameError("");
    }

    // Email
    if (!email) {
      setEmailError("Please enter your email address.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Phone Number
    if (!phone.trim()) {
      setPhoneError("Please enter your phone number.");
      isValid = false;
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
      setPhoneError("Please enter a valid phone number.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    // Password
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // Agree Terms
    if (!agreeTerms) {
      setTermsError("You must agree to the Terms & Conditions and Privacy Policy.");
      isValid = false;
    } else {
      setTermsError("");
    }

    return isValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setEmailError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, phone, password }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setSignupSuccess(true);
        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setEmailError(data.message || "An error occurred during registration.");
      }
    } catch {
      setIsLoading(false);
      setEmailError("A connection error occurred. Please try again.");
    }
  };

  return (
    <AuthLayout>
      {/* Auth Screen Header */}
      <AuthHeader
        title="Create Account"
        subtitle="Create your administrator account to access the medicine approval dashboard."
      />

      {/* Main Content Area */}
      {signupSuccess ? (
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
          <h4 className="text-lg font-bold text-dark-navy">Account Created Successfully</h4>
          <p className="text-sm text-slate-500 mt-1">
            Welcome to MediApprove! Redirecting to login screen...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          
          {/* Full Name */}
          <Input
            id="fullName"
            label="Full Name"
            placeholder="e.g. John Doe"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (fullNameError) setFullNameError("");
            }}
            error={fullNameError}
            required
            autoComplete="name"
          />

          {/* Email Address */}
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="e.g. john@mediapprove.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            error={emailError}
            required
            autoComplete="email"
          />

          {/* Phone Number */}
          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="e.g. +1 (555) 000-0000"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (phoneError) setPhoneError("");
            }}
            error={phoneError}
            required
            autoComplete="tel"
          />

          {/* Password */}
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
            error={passwordError}
            required
            autoComplete="new-password"
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) setConfirmPasswordError("");
            }}
            error={confirmPasswordError}
            required
            autoComplete="new-password"
          />

          {/* Terms & Conditions Checkbox */}
          <Checkbox
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (termsError) setTermsError("");
            }}
            error={termsError}
            label={
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors">
                  Privacy Policy
                </Link>
                .
              </span>
            }
          />

          {/* Submit Button */}
          <Button type="submit" isLoading={isLoading} className="mt-2.5">
            Create Account
          </Button>

          {/* Bottom redirection Link */}
          <div className="text-center mt-2.5 text-xs sm:text-sm font-semibold text-slate-500">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors ml-1.5"
            >
              Login
            </Link>
          </div>
        </form>
      )}

      {/* Auth Screen Security Footer */}
      <AuthFooter />
    </AuthLayout>
  );
}
