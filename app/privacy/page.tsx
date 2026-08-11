"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-border-color shadow-[0_4px_20px_rgba(15,41,64,0.03)] p-6 md:p-10 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border-color pb-4">
          <div className="flex items-center gap-3">
            <Logo variant="small" />
            <h1 className="text-xl md:text-2xl font-extrabold text-dark-navy">Privacy Policy</h1>
          </div>
          <Link href="/signup">
            <Button variant="outline" className="!py-1.5 !px-3.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 border-border-color text-slate-500 hover:text-dark-navy">
              Back to Sign Up
            </Button>
          </Link>
        </div>

        <div className="text-xs md:text-sm text-slate-600 space-y-4 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
          <p className="font-semibold text-slate-500">Effective Date: August 11, 2026</p>
          
          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">1. Information We Collect</h3>
          <p>
            We collect the basic administrative details you provide upon registration, including your full name, business email address, phone number, and password hashes for authentication purposes.
          </p>

          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">2. Audit & Access Logging</h3>
          <p>
            To maintain medical compliance and auditing standards, we automatically log user actions, including login events, medicine approval, and rejection reasons, alongside IP address, browser type, and timestamp data.
          </p>

          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">3. Data Sharing</h3>
          <p>
            We do not sell or rent administrative user data to third parties. Data is only utilized internally for system preference synchronization, logging history, and notifying relevant actors of compliance actions.
          </p>

          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">4. Security Measures</h3>
          <p>
            We employ industry-standard encryption protocols (like cryptographically salted bcrypt password hashing and JSON Web Tokens) to secure user data and guard against unauthorized system access.
          </p>

          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">5. Contact Information</h3>
          <p>
            If you have questions regarding this Privacy Policy or system logging data, please contact the main administrator desk.
          </p>
        </div>

        <div className="border-t border-border-color pt-4 flex justify-end">
          <Link href="/signup">
            <Button className="!py-2 !px-5 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-white">
              I Understand
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
