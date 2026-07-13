"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export default function ActionLogsPage() {
  return (
    <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
      <Card className="max-w-md text-center py-10 px-8 select-none">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
        </div>
        <h3 className="text-lg font-extrabold text-dark-navy">System Action Audits</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          The security audit logs for all administrative actions are currently archiving. Please check back for updates soon!
        </p>
      </Card>
    </main>
  );
}
