"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export default function ApprovedMedicinesPage() {
  return (
    <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
      <Card className="max-w-md text-center py-10 px-8 select-none">
        <div className="w-16 h-16 bg-[#22C55E]/10 text-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-extrabold text-dark-navy">Approved Medicines Registry</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          The records folder for all approved listings is currently syncing. Please check back for updates soon!
        </p>
      </Card>
    </main>
  );
}
