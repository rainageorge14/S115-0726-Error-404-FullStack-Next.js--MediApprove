"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMedicines } from "@/components/ui/MedicineContext";
import { NotificationBadge } from "./NotificationBadge";

export const NotificationBell: React.FC = () => {
  const { notifications } = useMedicines();
  const router = useRouter();

  const unreadCount = notifications ? notifications.filter((n) => !n.isRead).length : 0;

  return (
    <button
      onClick={() => router.push("/notifications")}
      className="relative p-2 border border-border-color text-dark-navy rounded-xl cursor-pointer select-none focus:outline-none"
    >
      <svg className="w-5 h-5 text-dark-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      
      {/* Badge count */}
      <NotificationBadge count={unreadCount} />
    </button>
  );
};
