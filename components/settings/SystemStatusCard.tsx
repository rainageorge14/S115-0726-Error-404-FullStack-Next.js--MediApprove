import React from "react";
import { Card } from "@/components/ui/Card";

interface SystemStatusCardProps {
  dbConnected: boolean;
  apiRunning: boolean;
  authHealthy: boolean;
  storageUsage: number;
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  dbConnected,
  apiRunning,
  authHealthy,
  storageUsage,
}) => {
  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] select-none">
      <h3 className="text-base font-bold text-[#0F172A] tracking-tight mb-5">System Status</h3>
      
      <div className="space-y-4">
        {/* Database */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Database</span>
            <span className="text-xs font-bold text-slate-400 mt-0.5">PostgreSQL server connection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${dbConnected ? "bg-[#16A34A] animate-pulse" : "bg-danger"}`} />
            <span className="text-xs font-extrabold text-[#0F172A]">{dbConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        {/* API Gateway */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">API Gateway</span>
            <span className="text-xs font-bold text-slate-400 mt-0.5">Restful backend services</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${apiRunning ? "bg-[#16A34A]" : "bg-danger"}`} />
            <span className="text-xs font-extrabold text-[#0F172A]">{apiRunning ? "Running" : "Offline"}</span>
          </div>
        </div>

        {/* Authentication */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Authentication</span>
            <span className="text-xs font-bold text-slate-400 mt-0.5">OAuth & session healthcheck</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${authHealthy ? "bg-[#16A34A]" : "bg-danger"}`} />
            <span className="text-xs font-extrabold text-[#0F172A]">{authHealthy ? "Healthy" : "Critical"}</span>
          </div>
        </div>

        {/* Storage */}
        <div className="pt-3 border-t border-[#F1F5F9] text-left">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage Usage</span>
            <span className="text-xs font-extrabold text-[#0F172A]">{storageUsage}%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#16A34A] h-2 rounded-full transition-all duration-500"
              style={{ width: `${storageUsage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
