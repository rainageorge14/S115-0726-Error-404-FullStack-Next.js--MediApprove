import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NotificationPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

export const NotificationPagination: React.FC<NotificationPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
}) => {
  return (
    <div className="py-2.5 px-4 border-t border-[#E2E8F0] flex items-center justify-between select-none font-sans text-left">
      <span className="text-xs font-bold text-slate-400">
        Showing {startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems} notifications
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 bg-white border border-[#CBD5E1] rounded-lg text-slate-600 hover:bg-[#F8FAFC] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed select-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-slate-700 px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 bg-white border border-[#CBD5E1] rounded-lg text-slate-600 hover:bg-[#F8FAFC] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed select-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
