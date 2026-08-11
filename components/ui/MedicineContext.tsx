"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { initialMedicines as pendingRaw } from "@/lib/mockMedicines";
import { initialApprovedMedicines as approvedRaw } from "@/lib/mockApprovedMedicines";

export interface Medicine {
  id: string;
  name: string; // compatibility
  medicineName: string; // requested
  company: string;
  category: "Capsule" | "Tablet" | "Injection" | "Syrup" | "Ointment" | "Drops";
  batchNumber: string; // requested
  batch: string; // compatibility
  price: number;
  dosage: string;
  expiryDate: string; // requested
  expiry: string; // compatibility
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: string; // requested
  submittedOn: string; // compatibility
  composition: string;
  description: string;
  documents?: { name: string; size: string; url: string }[];
  image: string;
  badges?: { label: string; type: "dosage" | "form" | "route" }[];
  mrp?: number;
  manufacturingDate?: string;
  licenseNumber?: string;
  approvedDate?: string;
}

export interface Activity {
  id: string;
  medicineName: string;
  action: "approved" | "rejected" | "pending";
  user: string;
  time: string;
}

export interface ActionLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  action: "Approved" | "Rejected" | "Login" | "Logout" | "Profile Updated" | "Medicine Created" | "Medicine Updated" | "Password Changed" | "Client Created" | "Client Updated";
  medicineId: string;
  medicineName: string;
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  remarks: string;
  previousStatus?: string;
  newStatus?: string;
  additionalNotes?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "approval" | "rejection" | "pending" | "login" | "security" | "report";
  status: "unread" | "read";
  adminName: string;
  medicineName: string;
  createdAt: string;
  isRead: boolean;
  actionUrl: string;
}

interface MedicineContextType {
  medicines: Medicine[];
  activities: Activity[];
  actionLogs: ActionLog[];
  notifications: Notification[];
  approveMedicine: (id: string, adminName: string) => Promise<boolean>;
  rejectMedicine: (id: string, adminName: string, reason: string, notes?: string) => Promise<boolean>;
  addActionLog: (log: Omit<ActionLog, "id" | "timestamp">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<Notification, "id" | "createdAt" | "isRead" | "status">) => void;
  timeFormat: "12h" | "24h";
  setTimeFormat: (format: "12h" | "24h") => void;
  formatTime: (timeInput: string | Date | null | undefined) => string;
  dateFormat: string;
  setDateFormat: (format: string) => void;
  formatDate: (dateInput: string | Date | null | undefined) => string;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

// Initial state mapping from raw mock files
const getInitialMedicines = (): Medicine[] => {
  const mappedPending: Medicine[] = pendingRaw.map((m) => ({
    ...m,
    medicineName: m.name,
    category: (m.badges?.find((b) => b.type === "form")?.label as Medicine["category"]) || "Tablet",
    batchNumber: m.batch || "B-GEN-991",
    batch: m.batch || "B-GEN-991",
    price: 150,
    dosage: "One tablet daily, or as advised by a physician",
    expiryDate: m.expiry || "12/2028",
    expiry: m.expiry || "12/2028",
    status: "pending",
    createdAt: m.submittedOn,
    submittedOn: m.submittedOn,
  }));

  const mappedApproved: Medicine[] = approvedRaw.map((m) => ({
    ...m,
    medicineName: m.name,
    batch: m.batchNumber,
    expiry: m.expiryDate,
    submittedOn: m.manufacturingDate,
    createdAt: m.manufacturingDate,
    image: m.image || "/medicine-placeholder.png",
    status: "approved",
    approvedBy: m.approvedBy || "Admin User",
    approvedAt: m.approvedDate || "20 July 2026",
  }));

  const initialRejected: Medicine[] = [
    {
      id: "med-rej-1",
      name: "Metformin Hydrochloride",
      medicineName: "Metformin Hydrochloride",
      company: "Lupin Ltd.",
      category: "Tablet",
      batchNumber: "B-MET-88910",
      batch: "B-MET-88910",
      price: 120,
      dosage: "Twice daily after meals",
      expiryDate: "15 Jan 2028",
      expiry: "15 Jan 2028",
      status: "rejected",
      createdAt: "10 May 2026",
      submittedOn: "10 May 2026",
      composition: "Metformin Hydrochloride IP 500mg",
      description: "Oral antihyperglycemic agent used for managing type 2 diabetes.",
      image: "/medicine-placeholder.png",
      rejectedBy: "Admin User",
      rejectedAt: "12 Jul 2026",
      rejectionReason: "Expired Product",
      adminNotes: "The expiry date of this batch is already past or too near. Re-submission with a fresh batch is required.",
      badges: [
        { label: "500mg", type: "dosage" },
        { label: "Tablet", type: "form" },
        { label: "Oral", type: "route" },
      ],
      licenseNumber: "DL-19401-20"
    },
    {
      id: "med-rej-2",
      name: "Augmentin Duo",
      medicineName: "Augmentin Duo",
      company: "Cipla Ltd.",
      category: "Syrup",
      batchNumber: "B-AUG-77211",
      batch: "B-AUG-77211",
      price: 245,
      dosage: "5ml every 12 hours",
      expiryDate: "15 Jan 2028",
      expiry: "15 Jan 2028",
      status: "rejected",
      createdAt: "12 May 2026",
      submittedOn: "12 May 2026",
      composition: "Amoxicillin 200mg + Clavulanic Acid 28.5mg per 5ml",
      description: "Antibacterial combination product for oral pediatric suspension.",
      image: "/medicine-placeholder.png",
      rejectedBy: "Super Admin",
      rejectedAt: "14 Jul 2026",
      rejectionReason: "Missing Regulatory Approval",
      adminNotes: "Missing regulatory FDA license certificate in the uploaded PDF documents.",
      badges: [
        { label: "228.5mg", type: "dosage" },
        { label: "Syrup", type: "form" },
        { label: "Oral", type: "route" },
      ],
      licenseNumber: "DL-99321-22"
    }
  ];

  return [...mappedPending, ...mappedApproved, ...initialRejected];
};

const initialActivities: Activity[] = [
  { id: "act-1", medicineName: "Lipitor 20mg", action: "approved", user: "Admin User", time: "2 min ago" },
  { id: "act-2", medicineName: "Dolo 650mg", action: "rejected", user: "Admin User", time: "10 min ago" },
  { id: "act-3", medicineName: "Amoxil 500mg", action: "approved", user: "Super Admin", time: "1 hour ago" },
  { id: "act-4", medicineName: "Calpol 350mg", action: "pending", user: "Admin User", time: "3 hours ago" },
];

const initialActionLogs: ActionLog[] = [
  {
    id: "LOG-000124",
    timestamp: "20 July 2026, 10:35 AM",
    adminId: "ADM-001",
    adminName: "Admin User",
    adminEmail: "admin@mediapprove.com",
    adminRole: "Super Admin",
    action: "Approved",
    medicineId: "med-app-1",
    medicineName: "Paracetamol 650mg",
    ipAddress: "192.168.1.10",
    browser: "Chrome",
    os: "Windows 11",
    device: "Chrome / Windows 11",
    remarks: "Medicine approved by Admin User",
    previousStatus: "Pending",
    newStatus: "Approved",
    additionalNotes: "Batch verification successful. All documentation meets compliance requirements."
  },
  {
    id: "LOG-000123",
    timestamp: "20 July 2026, 10:15 AM",
    adminId: "ADM-001",
    adminName: "Admin User",
    adminEmail: "admin@mediapprove.com",
    adminRole: "Super Admin",
    action: "Rejected",
    medicineId: "med-rej-1",
    medicineName: "Amoxicillin 500mg",
    ipAddress: "192.168.1.10",
    browser: "Chrome",
    os: "Windows 11",
    device: "Chrome / Windows 11",
    remarks: "Medicine rejected by Admin User",
    previousStatus: "Pending",
    newStatus: "Rejected",
    additionalNotes: "Batch B-MET-88910 rejected: Expired Product. Expiry date is in the past."
  },
  {
    id: "LOG-000122",
    timestamp: "20 July 2026, 09:45 AM",
    adminId: "ADM-001",
    adminName: "Admin User",
    adminEmail: "admin@mediapprove.com",
    adminRole: "Super Admin",
    action: "Login",
    medicineId: "N/A",
    medicineName: "N/A",
    ipAddress: "192.168.1.10",
    browser: "Chrome",
    os: "Windows 11",
    device: "Chrome / Windows 11",
    remarks: "Admin Login",
    previousStatus: "Logged Out",
    newStatus: "Logged In",
    additionalNotes: "Session initiated successfully from authorized office IP range."
  },
  {
    id: "LOG-000121",
    timestamp: "20 July 2026, 09:30 AM",
    adminId: "ADM-002",
    adminName: "Sarah Connor",
    adminEmail: "sarah@mediapprove.com",
    adminRole: "Admin",
    action: "Medicine Created",
    medicineId: "med-pending-3",
    medicineName: "Metformin 500mg",
    ipAddress: "192.168.1.45",
    browser: "Safari",
    os: "macOS Sequoia",
    device: "Safari / macOS",
    remarks: "Medicine listing created",
    previousStatus: "N/A",
    newStatus: "Pending Review",
    additionalNotes: "New drug application batch submitted by Lupin Ltd."
  },
  {
    id: "LOG-000120",
    timestamp: "19 July 2026, 04:20 PM",
    adminId: "ADM-001",
    adminName: "Admin User",
    adminEmail: "admin@mediapprove.com",
    adminRole: "Super Admin",
    action: "Approved",
    medicineId: "med-app-2",
    medicineName: "Azithromycin 250mg",
    ipAddress: "192.168.1.10",
    browser: "Chrome",
    os: "Windows 11",
    device: "Chrome / Windows 11",
    remarks: "Medicine approved by Admin User",
    previousStatus: "Pending",
    newStatus: "Approved",
    additionalNotes: "Standard fast-track approval given."
  },
  {
    id: "LOG-000119",
    timestamp: "19 July 2026, 03:10 PM",
    adminId: "ADM-001",
    adminName: "Admin User",
    adminEmail: "admin@mediapprove.com",
    adminRole: "Super Admin",
    action: "Rejected",
    medicineId: "med-rej-2",
    medicineName: "Ibuprofen 400mg",
    ipAddress: "192.168.1.10",
    browser: "Firefox",
    os: "Windows 11",
    device: "Firefox / Windows 11",
    remarks: "Medicine rejected by Admin User",
    previousStatus: "Pending",
    newStatus: "Rejected",
    additionalNotes: "Batch B-AUG-77211: Missing FDA certificate document."
  },
  {
    id: "LOG-000118",
    timestamp: "19 July 2026, 11:15 AM",
    adminId: "ADM-003",
    adminName: "John Doe",
    adminEmail: "john@mediapprove.com",
    adminRole: "Admin",
    action: "Profile Updated",
    medicineId: "N/A",
    medicineName: "N/A",
    ipAddress: "192.168.1.12",
    browser: "Edge",
    os: "Windows 11",
    device: "Edge / Windows 11",
    remarks: "Profile updated",
    previousStatus: "Old Profile",
    newStatus: "New Profile",
    additionalNotes: "Updated contact phone number and department designation."
  },
  {
    id: "LOG-000117",
    timestamp: "18 July 2026, 02:30 PM",
    adminId: "ADM-001",
    adminName: "Admin User",
    adminEmail: "admin@mediapprove.com",
    adminRole: "Super Admin",
    action: "Password Changed",
    medicineId: "N/A",
    medicineName: "N/A",
    ipAddress: "192.168.1.10",
    browser: "Chrome",
    os: "Windows 11",
    device: "Chrome / Windows 11",
    remarks: "Password updated successfully",
    additionalNotes: "Security credential update enforced. Old session tokens revoked."
  },
  {
    id: "LOG-000116",
    timestamp: "18 July 2026, 09:15 AM",
    adminId: "ADM-003",
    adminName: "John Doe",
    adminEmail: "john@mediapprove.com",
    adminRole: "Admin",
    action: "Logout",
    medicineId: "N/A",
    medicineName: "N/A",
    ipAddress: "192.168.1.12",
    browser: "Edge",
    os: "Windows 11",
    device: "Edge / Windows 11",
    remarks: "Admin Logout",
    additionalNotes: "User terminated session voluntarily."
  },
  {
    id: "LOG-000115",
    timestamp: "17 July 2026, 05:40 PM",
    adminId: "ADM-002",
    adminName: "Sarah Connor",
    adminEmail: "sarah@mediapprove.com",
    adminRole: "Admin",
    action: "Client Created",
    medicineId: "N/A",
    medicineName: "N/A",
    ipAddress: "192.168.1.45",
    browser: "Safari",
    os: "macOS Sequoia",
    device: "Safari / macOS",
    remarks: "New pharmaceutical client registered",
    additionalNotes: "Client organization: Pfizer Global India. Primary contact added."
  },
  {
    id: "LOG-000114",
    timestamp: "17 July 2026, 01:25 PM",
    adminId: "ADM-002",
    adminName: "Sarah Connor",
    adminEmail: "sarah@mediapprove.com",
    adminRole: "Admin",
    action: "Client Updated",
    medicineId: "N/A",
    medicineName: "N/A",
    ipAddress: "192.168.1.45",
    browser: "Safari",
    os: "macOS Sequoia",
    device: "Safari / macOS",
    remarks: "Client information modified",
    additionalNotes: "Updated shipping details and license renewal date for Cipla Ltd."
  },
  {
    id: "LOG-000113",
    timestamp: "17 July 2026, 10:10 AM",
    adminId: "ADM-001",
    adminName: "Admin User",
    adminEmail: "admin@mediapprove.com",
    adminRole: "Super Admin",
    action: "Medicine Updated",
    medicineId: "med-pending-2",
    medicineName: "Lipitor 20mg",
    ipAddress: "192.168.1.10",
    browser: "Chrome",
    os: "Windows 11",
    device: "Chrome / Windows 11",
    remarks: "Medicine listing details modified",
    additionalNotes: "Corrected composition text fields and adjusted retail price."
  }
];

const getInitialNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: "notif-1",
      title: "Medicine Approved",
      description: "Paracetamol 650mg submitted by Cipla has been approved.",
      type: "approval",
      status: "unread",
      adminName: "Raina George",
      medicineName: "Paracetamol 650mg",
      createdAt: new Date(now.getTime() - 2 * 60000).toISOString(),
      isRead: false,
      actionUrl: "/dashboard/approved"
    },
    {
      id: "notif-2",
      title: "Medicine Rejected",
      description: "Azithromycin 500mg rejected because expiry information is missing.",
      type: "rejection",
      status: "unread",
      adminName: "Vinayak Kulkarni",
      medicineName: "Azithromycin 500mg",
      createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
      isRead: false,
      actionUrl: "/dashboard/rejected"
    },
    {
      id: "notif-3",
      title: "New Medicine Submitted",
      description: "Ibuprofen 400mg has been added to the approval queue.",
      type: "pending",
      status: "unread",
      adminName: "N/A",
      medicineName: "Ibuprofen 400mg",
      createdAt: new Date(now.getTime() - 30 * 60000).toISOString(),
      isRead: false,
      actionUrl: "/dashboard/pending"
    },
    {
      id: "notif-4",
      title: "Security Alert",
      description: "Password successfully changed.",
      type: "security",
      status: "unread",
      adminName: "Admin User",
      medicineName: "N/A",
      createdAt: new Date(now.getTime() - 4 * 3600000).toISOString(),
      isRead: false,
      actionUrl: "/dashboard/profile"
    },
    {
      id: "notif-5",
      title: "Weekly Report Generated",
      description: "Analytics report is ready to download.",
      type: "report",
      status: "read",
      adminName: "N/A",
      medicineName: "N/A",
      createdAt: new Date(now.getTime() - 28 * 3600000).toISOString(),
      isRead: true,
      actionUrl: "/dashboard/reports"
    },
    {
      id: "notif-6",
      title: "New Admin Login",
      description: "Super Admin logged in from Pune.",
      type: "login",
      status: "read",
      adminName: "Super Admin",
      medicineName: "N/A",
      createdAt: new Date(now.getTime() - 1 * 3600000).toISOString(),
      isRead: true,
      actionUrl: "/dashboard/action-logs"
    }
  ];
};

export const MedicineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(getInitialMedicines);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>(initialActionLogs);
  const [notifications, setNotifications] = useState<Notification[]>(getInitialNotifications);
  const [timeFormat, setTimeFormatState] = useState<"12h" | "24h">("12h");
  const [dateFormat, setDateFormatState] = useState<string>("DD MMM YYYY");

  // Load preferences on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFormat = localStorage.getItem("timeFormat");
      if (savedFormat === "12h" || savedFormat === "24h") {
        setTimeFormatState(savedFormat);
      }
      const savedDateFormat = localStorage.getItem("dateFormat");
      if (savedDateFormat) {
        setDateFormatState(savedDateFormat);
      }
    }

    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user && data.user.timeFormat) {
          const apiFormat = data.user.timeFormat;
          if (apiFormat === "12h" || apiFormat === "24h") {
            setTimeFormatState(apiFormat);
            localStorage.setItem("timeFormat", apiFormat);
          }
        }
      })
      .catch((e) => console.error("Failed to fetch settings from profile", e));
  }, []);

  const setTimeFormat = (format: "12h" | "24h") => {
    setTimeFormatState(format);
    if (typeof window !== "undefined") {
      localStorage.setItem("timeFormat", format);
    }
  };

  const setDateFormat = (format: string) => {
    setDateFormatState(format);
    if (typeof window !== "undefined") {
      localStorage.setItem("dateFormat", format);
    }
  };

  const formatDate = (dateInput: string | Date | null | undefined): string => {
    if (!dateInput) return "";
    let date: Date;

    if (typeof dateInput === "string") {
      if (
        dateInput.includes("ago") ||
        dateInput.toLowerCase() === "just now" ||
        dateInput.toLowerCase() === "n/a"
      ) {
        return dateInput;
      }
      date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        return dateInput;
      }
    } else {
      date = dateInput;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = date.getMonth();
    const monthShort = monthsShort[monthIndex];
    const monthNum = String(monthIndex + 1).padStart(2, "0");

    if (dateFormat === "YYYY-MM-DD") {
      return `${year}-${monthNum}-${day}`;
    } else if (dateFormat === "MM/DD/YYYY") {
      return `${monthNum}/${day}/${year}`;
    } else {
      return `${day} ${monthShort} ${year}`;
    }
  };

  const formatTime = (timeInput: string | Date | null | undefined): string => {
    if (!timeInput) return "";
    if (
      typeof timeInput === "string" &&
      (timeInput.includes("ago") ||
        timeInput.toLowerCase() === "just now" ||
        timeInput.toLowerCase() === "n/a")
    ) {
      return timeInput;
    }

    let date: Date;
    let originalCustomPart = "";

    if (typeof timeInput === "string") {
      const match = timeInput.match(/^(\d{1,2}\s+[A-Za-z]+\s+\d{4}),\s+(\d{1,2}:\d{2}\s+[AP]M)$/i);
      if (match) {
        originalCustomPart = match[1];
        const timePart = match[2];
        const hmTokens = timePart.split(":");
        let hours = parseInt(hmTokens[0], 10);
        const minutesStr = hmTokens[1].substring(0, 2);
        const ampm = hmTokens[1].substring(2).trim().toUpperCase();

        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        if (timeFormat === "24h") {
          const hh = String(hours).padStart(2, "0");
          return `${formatDate(originalCustomPart)}, ${hh}:${minutesStr}`;
        } else {
          const ampmResult = hours >= 12 ? "PM" : "AM";
          let hh = hours % 12;
          if (hh === 0) hh = 12;
          const hhStr = String(hh).padStart(2, "0");
          return `${formatDate(originalCustomPart)}, ${hhStr}:${minutesStr} ${ampmResult}`;
        }
      }

      date = new Date(timeInput);
      if (isNaN(date.getTime())) {
        return timeInput;
      }
    } else {
      date = timeInput;
    }

    if (timeFormat === "24h") {
      const formattedDate = formatDate(date);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${formattedDate}, ${hours}:${minutes}`;
    } else {
      const formattedDate = formatDate(date);
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      if (hours === 0) hours = 12;
      const hh = String(hours).padStart(2, "0");
      return `${formattedDate}, ${hh}:${minutes} ${ampm}`;
    }
  };

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mediapprove_notifications");
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse notifications from localStorage", e);
        }
      }
    }
  }, []);

  // Save notifications to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mediapprove_notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, status: "read" } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, status: "read" }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif: Omit<Notification, "id" | "createdAt" | "isRead" | "status">) => {
    setNotifications((prev) => [
      {
        ...notif,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        isRead: false,
        status: "unread",
      },
      ...prev,
    ]);
  };

  const addActionLog = (log: Omit<ActionLog, "id" | "timestamp">) => {
    const formattedDate = formatDate(new Date());
    const formattedTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const timestamp = `${formattedDate}, ${formattedTime}`;

    setActionLogs((prev) => {
      // Find the next LOG ID
      let nextNum = 125;
      if (prev.length > 0) {
        const topId = prev[0].id;
        const num = parseInt(topId.replace("LOG-", ""));
        if (!isNaN(num)) {
          nextNum = num + 1;
        }
      }
      const nextId = `LOG-${String(nextNum).padStart(6, "0")}`;

      return [
        {
          ...log,
          id: nextId,
          timestamp,
        },
        ...prev,
      ];
    });
  };

  // Approve workflow logic
  const approveMedicine = async (
  id: string,
  adminName: string
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/medicines/${id}/approve`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return false;
    }

    setMedicines((prev) =>
      prev.map((med) =>
        med.id === id
          ? {
              ...med,
              status: "approved",
              approvedBy: data.admin?.name || adminName,
              approvedAt: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            }
          : med
      )
    );

    return true;
  } catch (error) {
    console.error("Approve request failed:", error);
    return false;
  }
};
  
  // Reject workflow logic
  const rejectMedicine = async (
    id: string,
    adminName: string,
    reason: string,
    notes?: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }); // e.g. "15 Jul 2026"

    let target: Medicine | undefined;
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          target = med;
          return {
            ...med,
            status: "rejected",
            rejectedBy: adminName,
            rejectedAt: currentDate,
            rejectionReason: reason,
            adminNotes: notes || "",
          };
        }
        return med;
      })
    );

    if (target) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          medicineName: target!.name,
          action: "rejected",
          user: adminName,
          time: "Just now",
        },
        ...prev,
      ]);

      // Generate Action Log
      addActionLog({
        adminId: adminName === "Admin User" ? "ADM-001" : "ADM-002",
        adminName,
        adminEmail: adminName === "Admin User" ? "admin@mediapprove.com" : "sarah@mediapprove.com",
        adminRole: adminName === "Admin User" ? "Super Admin" : "Admin",
        action: "Rejected",
        medicineId: target.id,
        medicineName: target.name,
        ipAddress: "192.168.1.10",
        browser: "Chrome",
        os: "Windows 11",
        device: "Chrome / Windows 11",
        remarks: `Medicine rejected by ${adminName}`,
        previousStatus: "Pending",
        newStatus: "Rejected",
        additionalNotes: `Reason: ${reason}. Notes: ${notes || "None"}`
      });

      // Generate Notification
      addNotification({
        title: "Medicine Rejected",
        description: `${target.name} rejected because ${reason}.`,
        type: "rejection",
        adminName,
        medicineName: target.name,
        actionUrl: "/dashboard/rejected"
      });
    }

    return true;
  };

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        activities,
        actionLogs,
        notifications,
        approveMedicine,
        rejectMedicine,
        addActionLog,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,
        timeFormat,
        setTimeFormat,
        formatTime,
        dateFormat,
        setDateFormat,
        formatDate,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicines = () => {
  const context = useContext(MedicineContext);
  if (context === undefined) {
    throw new Error("useMedicines must be used within a MedicineProvider");
  }
  return context;
};
