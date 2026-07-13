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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation and UI states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    
    // Email Validation
    if (!email) {
      setEmailError("Email address is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password Validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginStatus("idle");
    setStatusMessage("");

    // Simulate API authorization request
    setTimeout(() => {
      setIsLoading(false);
      // Hardcoded credentials for admin simulation
      if (email === "admin@mediapprove.com" && password === "password") {
        setLoginStatus("success");
        setStatusMessage("Access Granted! Loading portal...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setLoginStatus("error");
        setStatusMessage("Invalid email address or password.");
      }
    }, 1500);
  };

  return (
    <AuthLayout>
      {/* Auth Screen Header */}
      <AuthHeader
        title="Welcome Back!"
        subtitle="Sign in to continue"
      />

      {/* Login Form */}
      {loginStatus === "success" ? (
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
          <h4 className="text-lg font-bold text-dark-navy">Authentication Successful</h4>
          <p className="text-sm text-slate-500 mt-1">{statusMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSignIn} className="flex flex-col gap-5">
          
          {/* Status Message for Errors */}
          {loginStatus === "error" && (
            <div className="p-3.5 text-sm font-semibold text-danger bg-danger/10 border border-danger/20 rounded-xl animate-shake">
              {statusMessage}
            </div>
          )}

          {/* Email Input */}
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

          {/* Password Input with Right-aligned Forgot Password Link */}
          <PasswordInput
            id="password"
            label="Password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
            error={passwordError}
            rightLabel={
              <a
                href="#"
                className="font-bold text-primary hover:text-primary-hover hover:underline transition-all duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password recovery path triggered.");
                }}
              >
                Forgot password?
              </a>
            }
            required
            autoComplete="current-password"
          />

          {/* Remember Me Checkbox */}
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="Remember me"
          />

          {/* Sign In Button */}
          <Button type="submit" isLoading={isLoading} className="mt-2.5">
            Sign In
          </Button>

          {/* Redirect to Signup */}
          <div className="text-center mt-2.5 text-xs sm:text-sm font-semibold text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors ml-1.5"
            >
              Sign Up
            </Link>
          </div>
        </form>
      )}

      {/* Auth Screen Security Footer */}
      <AuthFooter />
    </AuthLayout>
  );
}
