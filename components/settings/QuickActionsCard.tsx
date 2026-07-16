import React from "react";
import { Card } from "@/components/ui/Card";
import { Database, FileOutput, RefreshCw, Trash2 } from "lucide-react";

interface QuickActionsCardProps {
  onBackup: () => void;
  onExport: () => void;
  onSync: () => void;
  onClearCache: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onBackup,
  onExport,
  onSync,
  onClearCache,
}) => {
  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] select-none">
      <h3 className="text-base font-bold text-[#0F172A] tracking-tight mb-5">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Backup Database */}
        <button
          onClick={onBackup}
          className="flex items-center gap-2.5 px-4 h-11 text-xs font-bold text-slate-600 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-[#F8FAFC] transition-colors cursor-pointer select-none justify-start"
        >
          <Database className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Backup DB</span>
        </button>

        {/* Export Reports */}
        <button
          onClick={onExport}
          className="flex items-center gap-2.5 px-4 h-11 text-xs font-bold text-slate-600 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-[#F8FAFC] transition-colors cursor-pointer select-none justify-start"
        >
          <FileOutput className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Export Reports</span>
        </button>

        {/* Sync Database */}
        <button
          onClick={onSync}
          className="flex items-center gap-2.5 px-4 h-11 text-xs font-bold text-slate-600 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-[#F8FAFC] transition-colors cursor-pointer select-none justify-start"
        >
          <RefreshCw className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Sync DB</span>
        </button>

        {/* Clear Cache */}
        <button
          onClick={onClearCache}
          className="flex items-center gap-2.5 px-4 h-11 text-xs font-bold text-slate-600 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-[#F8FAFC] transition-colors cursor-pointer select-none justify-start"
        >
          <Trash2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Clear Cache</span>
        </button>
      </div>
    </Card>
  );
};
