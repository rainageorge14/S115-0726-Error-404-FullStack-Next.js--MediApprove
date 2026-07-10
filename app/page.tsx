"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
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
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
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
      } else {
        setLoginStatus("error");
        setStatusMessage("Invalid email address or password.");
      }
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center flex-1 min-h-screen w-full p-4 bg-dark-navy sm:p-6 md:p-8 select-none">
      {/* Centered Login Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_15px_50px_-15px_rgba(15,41,64,0.45)] overflow-hidden transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT PANEL */}
          <div className="hidden md:flex flex-col justify-between p-10 lg:p-14 bg-left-panel-bg text-left border-r border-border-color min-h-[580px]">
            {/* Top Heading */}
            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-bold tracking-wider text-primary uppercase">
                Admin Portal
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-dark-navy mt-1.5 leading-tight tracking-tight">
                Medicine Approval System
              </h1>
              <p className="text-slate-500 text-sm lg:text-base leading-relaxed mt-4 max-w-[280px] font-medium">
                Review and approve medicine listings submitted by our registered companies.
              </p>
            </div>

            {/* Central Brand Asset Badge & Tagline (from reusable Logo component) */}
            <div className="flex items-center justify-center flex-1 my-6">
              <Logo variant="large" />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 bg-white min-h-[500px] md:min-h-[580px]">
            
            {/* Small Logo branding at the top */}
            <div className="flex justify-center mb-8">
              <Logo variant="small" />
            </div>

            {/* Heading & Subheading */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-extrabold tracking-tight text-dark-navy">
                Welcome Back!
              </h3>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                Sign in to continue
              </p>
            </div>

            {/* Login Form */}
            {loginStatus === "success" ? (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-success/10 border border-success/20 rounded-2xl animate-fade-in">
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
                <Input
                  id="password"
                  label="Password"
                  type="password"
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
                <div className="flex items-center justify-between mt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    {/* Custom Checkbox Box */}
                    <div className="w-5 h-5 border border-border-color rounded-md bg-white peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-all duration-150 group-hover:border-primary">
                      {/* Check icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="white"
                        className="w-3 h-3 scale-0 peer-checked:group-[input]:scale-100 transition-transform duration-150"
                        style={{ transform: rememberMe ? "scale(1)" : "scale(0)" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-500 select-none group-hover:text-dark-navy transition-colors">
                      Remember me
                    </span>
                  </label>
                </div>

                {/* Sign In Button */}
                <Button type="submit" isLoading={isLoading} className="mt-4">
                  Sign In
                </Button>
              </form>
            )}

            {/* Micro-note regarding mockup capabilities */}
            <div className="mt-8 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Authorized Access Only
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
