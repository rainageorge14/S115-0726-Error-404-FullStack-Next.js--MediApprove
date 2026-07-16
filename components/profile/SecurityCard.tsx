import React from "react";
import { Card } from "@/components/ui/Card";

interface SecurityCardProps {
  onActionClick: () => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ onActionClick }) => {
  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] flex flex-col items-center justify-center text-center space-y-4 select-none">
      <div className="w-16 h-16 bg-[#14B8C5]/10 rounded-full flex items-center justify-center text-[#14B8C5]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <div className="space-y-1 max-w-[220px]">
        <h4 className="text-xs font-semibold text-[#64748B] leading-relaxed">Update your password regularly for security</h4>
      </div>

      <button
        onClick={onActionClick}
        type="button"
        className="w-full sm:w-auto px-6 h-[44px] flex items-center justify-center font-bold text-slate-600 bg-white border border-[#E2E8F0] rounded-[10px] hover:bg-[#F8FAFC] transition-colors cursor-pointer select-none"
      >
        Change Password
      </button>
    </Card>
  );
};
