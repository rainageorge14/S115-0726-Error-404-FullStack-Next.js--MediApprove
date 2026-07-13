"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarMenuItem {
  name: string;
  category: string;
  icon: string;
  href: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarMenu: SidebarMenuItem[] = [
    { name: "Dashboard", category: "", icon: "dashboard", href: "/dashboard" },
    { name: "Pending Medicines", category: "MANAGE", icon: "pending", href: "/dashboard/pending" },
    { name: "Approved Medicine", category: "MANAGE", icon: "approved", href: "/dashboard/approved" },
    { name: "Rejected Medicine", category: "MANAGE", icon: "rejected", href: "/dashboard/rejected" },
    { name: "Action Logs", category: "ACTIVITY", icon: "logs", href: "/dashboard/action-logs" },
    { name: "Reports", category: "ACTIVITY", icon: "reports", href: "/dashboard/reports" },
    { name: "Profile", category: "SETTINGS", icon: "profile", href: "/dashboard/profile" },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  // Get active menu title from current path
  const getActiveTitle = () => {
    const active = sidebarMenu.find((m) => m.href === pathname);
    return active ? active.name : "Dashboard";
  };

  // Helper to render sidebar icons
  const renderIcon = (type: string, isActive: boolean) => {
    const strokeColor = isActive ? "currentColor" : "#94A3B8";

    switch (type) {
      case "dashboard":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case "pending":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "approved":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "rejected":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "logs":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case "reports":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "profile":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-dark-navy antialiased">

      {/* SIDEBAR */}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-navy text-slate-300 min-h-screen shrink-0 border-r border-border-color/10 select-none">
        {/* Sidebar Brand Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/30">
          <div className="w-9 h-9">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect x="25" y="15" width="60" height="80" rx="10" fill="#FFFFFF" stroke="#0EA5B7" strokeWidth="6" />
              <path d="M45 15C45 11 50 10 55 10H65C70 10 75 11 75 15V18H45V15Z" fill="#0F2940" />
              <g transform="rotate(-30, 45, 75)">
                <path d="M30 65H42V85C42 88.3 39.3 91 36 91C32.7 91 30 88.3 30 85V65Z" fill="#0F2940" />
                <path d="M30 65H42V45C42 41.7 39.3 39 36 39C32.7 39 30 41.7 30 45V65Z" fill="#0EA5B7" />
                <rect x="29" y="63" width="14" height="4" fill="#FFFFFF" rx="1" />
              </g>
              <g filter="drop-shadow(0px 2px 4px rgba(15, 41, 64, 0.15))">
                <path d="M70 65C70 65 70 70 70 75C70 85 85 92 85 92C85 92 100 85 100 75C100 70 100 65 100 65L85 60L70 65Z" fill="url(#sideShieldGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M80 76.5L83.5 80L90.5 73" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <linearGradient id="sideShieldGrad" x1="85" y1="60" x2="85" y2="92" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0EA5B7" />
                  <stop offset="100%" stopColor="#097E8C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-[#0EA5B7]">Medi</span>
            <span className="text-white">Approve</span>
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-7 overflow-y-auto">
          {["", "MANAGE", "ACTIVITY", "SETTINGS"].map((cat) => {
            const items = sidebarMenu.filter((m) => m.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-1.5">
                {cat && (
                  <h4 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {cat}
                  </h4>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer ${isActive
                            ? "bg-primary text-white shadow-md shadow-primary/10"
                            : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                          }`}
                      >
                        {renderIcon(item.icon, isActive)}
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-slate-700/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold rounded-xl text-slate-400 hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-navy/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-navy text-slate-300 flex flex-col md:hidden transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/30">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-extrabold text-[#0EA5B7]">Medi</span>
            <span className="text-lg font-extrabold text-white">Approve</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4 px-4 space-y-6 overflow-y-auto">
          {["", "MANAGE", "ACTIVITY", "SETTINGS"].map((cat) => {
            const items = sidebarMenu.filter((m) => m.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-1">
                {cat && (
                  <h4 className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {cat}
                  </h4>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold rounded-xl cursor-pointer ${isActive ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800/40"
                          }`}
                      >
                        {renderIcon(item.icon, isActive)}
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold rounded-xl text-slate-400 hover:text-danger cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">

        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-border-color sticky top-0 z-30 px-6 py-4 md:py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-border-color text-dark-navy md:hidden hover:bg-slate-50 cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-dark-navy tracking-tight leading-none">
                {getActiveTitle()}
              </h2>
              <p className="text-xs md:text-sm font-semibold text-slate-400 mt-1.5 hidden sm:block">
                Overview of medicine Listing and recent activity
              </p>
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-dark-navy rounded-xl border border-border-color transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3 select-none">
              {/* User Avatar Circle */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 border border-border-color select-none">
                AU
              </div>
              <div className="text-left hidden lg:block">
                <h4 className="text-sm font-bold text-dark-navy leading-none">
                  Admin User
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5 block">
                  Super Admin
                </span>
              </div>
              {/* Chevron icon */}
              <svg className="w-3.5 h-3.5 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Child Pages main content */}
        {children}

      </div>
    </div>
  );
}
