import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { AlertOctagon, ShieldAlert, LogOut, Trash2 } from "lucide-react";

interface DangerZoneCardProps {
  onDeactivate: () => void;
  onLogoutAll: () => void;
  onDeleteSessions: () => void;
  onDeleteAccount: (password: string) => void;
}

export const DangerZoneCard: React.FC<DangerZoneCardProps> = ({
  onDeactivate,
  onLogoutAll,
  onDeleteSessions,
  onDeleteAccount,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleConfirmDelete = () => {
    if (!password) return;
    setIsConfirmOpen(false);
    onDeleteAccount(password);
    setPassword("");
  };

  return (
    <>
      <Card className="p-6 rounded-[16px] border border-[#FECACA] bg-[#FEF2F2] shadow-[0_6px_20px_rgba(239,68,68,0.02)] select-none text-left">
        <div className="flex items-center gap-3 border-b border-[#FEE2E2] pb-3 mb-4 select-none">
          <div className="p-2 bg-danger/10 text-danger rounded-xl">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-danger uppercase tracking-wider leading-none">Danger Zone</h3>
            <span className="text-[10px] text-danger/70 font-semibold mt-1 block">Critical actions regarding compliance credentials</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onDeactivate}
              className="flex items-center gap-2 px-4 h-10 text-xs font-bold text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span>Deactivate Account</span>
            </button>

            <button
              onClick={onLogoutAll}
              className="flex items-center gap-2 px-4 h-10 text-xs font-bold text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Logout All Devices</span>
            </button>

            <button
              onClick={onDeleteSessions}
              className="flex items-center gap-2 px-4 h-10 text-xs font-bold text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
              <span>Delete Sessions</span>
            </button>
          </div>

          <button
            onClick={() => setIsConfirmOpen(true)}
            className="flex items-center justify-center gap-2 px-5 h-10 text-xs font-bold text-white bg-danger hover:bg-[#DC2626] rounded-[10px] shadow-md shadow-danger/10 transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-navy/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl shadow-2xl border border-border-color p-6 max-w-sm w-full text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0F172A]">Delete Compliance Account</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Are you absolutely sure you want to permanently delete your administrator account? This action is irreversible and will remove all audit logs associations.
              </p>
            </div>
            
            {/* Password input verification */}
            <div className="text-left space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Enter Current Password</label>
              <input
                type="password"
                placeholder="Confirm password to delete"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs text-dark-navy bg-white border border-[#CBD5E1] rounded-xl outline-hidden focus:border-[#EF4444] focus:ring-3 focus:ring-[#EF4444]/10 transition-all"
              />
            </div>

            <div className="flex gap-2 items-center justify-center pt-2">
              <button
                onClick={() => {
                  setIsConfirmOpen(false);
                  setPassword("");
                }}
                className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!password}
                onClick={handleConfirmDelete}
                className={`flex-1 py-2 text-xs font-bold text-white rounded-xl shadow-md cursor-pointer transition-colors ${
                  !password
                    ? "bg-[#EF4444]/40 cursor-not-allowed"
                    : "bg-danger hover:bg-[#DC2626]"
                }`}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
