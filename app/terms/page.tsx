"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-border-color shadow-[0_4px_20px_rgba(15,41,64,0.03)] p-6 md:p-10 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border-color pb-4">
          <div className="flex items-center gap-3">
            <Logo variant="small" />
            <h1 className="text-xl md:text-2xl font-extrabold text-dark-navy">Terms & Conditions</h1>
          </div>
          <Link href="/signup">
            <Button variant="outline" className="!py-1.5 !px-3.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 border-border-color text-slate-500 hover:text-dark-navy">
              Back to Sign Up
            </Button>
          </Link>
        </div>

        <div className="text-xs md:text-sm text-slate-600 space-y-4 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
          <p className="font-semibold text-slate-500">Effective Date: August 11, 2026</p>
          
          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">1. Acceptance of Terms</h3>
          <p>
            By accessing or signing up for the MediApprove platform, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, you must not use or access the services.
          </p>

          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">2. Account Responsibility</h3>
          <p>
            As an administrator, you are solely responsible for maintaining the confidentiality of your credentials and account information. Any actions taken under your credentials will be deemed your responsibility.
          </p>

          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">3. Data Validation & Medicine Compliance</h3>
          <p>
            All medicine approvals, rejections, and review decisions must comply with relevant international pharmaceutical standards and guidelines. Any intentional manipulation or falsification of compliance check details is strictly prohibited and subject to immediate account termination.
          </p>

          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">4. Limitations of Liability</h3>
          <p>
            MediApprove provides administrative check logs and tracking helpers. We are not liable for final physical distribution errors or compliance oversights occurring downstream in external supply chain layers.
          </p>

          <h3 className="text-sm md:text-base font-extrabold text-dark-navy mt-4">5. Amendments</h3>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the platform following updates constitutes agreement to the amended terms.
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
