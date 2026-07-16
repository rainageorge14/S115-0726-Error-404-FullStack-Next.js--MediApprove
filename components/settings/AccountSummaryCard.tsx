import React from "react";
import { Card } from "@/components/ui/Card";

interface AccountSummaryCardProps {
  name: string;
  role: string;
  department: string;
  email: string;
  memberSince: string;
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  name,
  role,
  department,
  email,
  memberSince,
}) => {
  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] select-none">
      <h3 className="text-base font-bold text-[#0F172A] tracking-tight mb-5">Account Summary</h3>
      
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Admin Name</span>
          <span className="text-sm font-extrabold text-[#0F172A] mt-1 block">{name}</span>
        </div>
        <div className="pt-3 border-t border-[#F1F5F9]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Role</span>
          <span className="text-sm font-extrabold text-primary mt-1 block">{role}</span>
        </div>
        <div className="pt-3 border-t border-[#F1F5F9]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Department</span>
          <span className="text-sm font-extrabold text-[#0F172A] mt-1 block">{department}</span>
        </div>
        <div className="pt-3 border-t border-[#F1F5F9]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email</span>
          <span className="text-sm font-extrabold text-[#0F172A] mt-1 block">{email}</span>
        </div>
        <div className="pt-3 border-t border-[#F1F5F9]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Member Since</span>
          <span className="text-sm font-extrabold text-[#0F172A] mt-1 block">{memberSince}</span>
        </div>
      </div>
    </Card>
  );
};
