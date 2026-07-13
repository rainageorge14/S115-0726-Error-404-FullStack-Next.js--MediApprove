"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
      <Card className="max-w-md text-center py-10 px-8 select-none">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-extrabold text-dark-navy">Administrator Profile Settings</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          The settings dashboard for managing user accounts and credentials is under configuration. Please check back for updates soon!
        </p>
      </Card>
    </main>
  );
}
