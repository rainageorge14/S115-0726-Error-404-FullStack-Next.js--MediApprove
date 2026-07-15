"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
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

interface MedicineContextType {
  medicines: Medicine[];
  activities: Activity[];
  approveMedicine: (id: string, adminName: string) => Promise<boolean>;
  rejectMedicine: (id: string, adminName: string, reason: string, notes?: string) => Promise<boolean>;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

// Initial state mapping from raw mock files
const getInitialMedicines = (): Medicine[] => {
  const mappedPending: Medicine[] = pendingRaw.map((m) => ({
    ...m,
    medicineName: m.name,
    category: (m.badges?.find((b) => b.type === "form")?.label as any) || "Tablet",
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

export const MedicineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(getInitialMedicines);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  // Approve workflow logic
  const approveMedicine = async (id: string, adminName: string): Promise<boolean> => {
    // Simulate database network lag
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simulate verification check failures:
    // If the medicine ID is "med-4" (Aspirin), we mock validation rejection to trigger the error toast!
    if (id === "med-4") {
      return false;
    }

    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const currentDate = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }); // e.g. "14 Jul 2026"
          return {
            ...med,
            status: "approved",
            approvedBy: adminName,
            approvedAt: currentDate,
          };
        }
        return med;
      })
    );

    // Append to activities feed
    const target = medicines.find((m) => m.id === id);
    if (target) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          medicineName: target.name,
          action: "approved",
          user: adminName,
          time: "Just now",
        },
        ...prev,
      ]);
    }

    return true;
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

    let targetName = "";
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          targetName = med.name;
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

    if (targetName) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          medicineName: targetName,
          action: "rejected",
          user: adminName,
          time: "Just now",
        },
        ...prev,
      ]);
    }

    return true;
  };

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        activities,
        approveMedicine,
        rejectMedicine,
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
