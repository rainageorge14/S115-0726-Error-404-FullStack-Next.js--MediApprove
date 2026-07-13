"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export default function ReportsPage() {
  return (
    <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
      <Card className="max-w-md text-center py-10 px-8 select-none">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-extrabold text-dark-navy">Analytical Reports Center</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          The compilation of compliance reports and listings statistics is being processed. Please check back for updates soon!
        </p>
      </Card>
    </main>
  );
}
