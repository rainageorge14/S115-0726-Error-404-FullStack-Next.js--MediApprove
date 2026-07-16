import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ToggleSwitch } from "./ToggleSwitch";

interface SecuritySettingsCardProps {
  onUpdate: (data: any) => void;
}

export const SecuritySettingsCard: React.FC<SecuritySettingsCardProps> = ({ onUpdate }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [tfa, setTfa] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [timeout, setTimeoutVal] = useState("15m");

  const [showPass, setShowPass] = useState<Record<string, boolean>>({});

  const toggleShow = (key: string) => {
    setShowPass(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      currentPassword,
      newPassword,
      confirmPassword,
      tfa,
      autoLogout,
      rememberDevice,
      loginAlerts,
      timeout,
    });
  };

  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] flex flex-col justify-between">
      <div className="border-b border-[#E2E8F0] pb-3 mb-4 select-none text-left">
        <h3 className="text-[22px] font-semibold text-[#0F172A] tracking-tight">Security</h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">Manage administrative credentials, MFA, and device access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Passwords fields with toggles */}
        {["currentPassword", "newPassword", "confirmPassword"].map((key) => {
          const isCurrent = key === "currentPassword";
          const isNew = key === "newPassword";
          const label = isCurrent ? "Current Password" : isNew ? "New Password" : "Confirm Password";
          const value = isCurrent ? currentPassword : isNew ? newPassword : confirmPassword;
          const setter = isCurrent ? setCurrentPassword : isNew ? setNewPassword : setConfirmPassword;

          return (
            <div key={key} className="flex flex-col gap-1 w-full text-left">
              <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">{label}</label>
              <div className="relative flex items-center">
                <input
                  type={showPass[key] ? "text" : "password"}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full pl-4 pr-11 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
                />
                <button
                  type="button"
                  onClick={() => toggleShow(key)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-dark-navy focus:outline-hidden transition-colors cursor-pointer select-none"
                >
                  {showPass[key] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815L21 21m-3.96-3.96l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Toggles */}
        <div className="space-y-1.5 pt-2">
          <ToggleSwitch
            label="Enable Two Factor Authentication"
            description="Use hardware keys or authenticator apps"
            checked={tfa}
            onChange={setTfa}
          />
          <ToggleSwitch
            label="Auto Logout After Inactivity"
            description="Automatically log out if inactive"
            checked={autoLogout}
            onChange={setAutoLogout}
          />
          <ToggleSwitch
            label="Remember Device"
            description="Trust this browser session for 30 days"
            checked={rememberDevice}
            onChange={setRememberDevice}
          />
          <ToggleSwitch
            label="Login Alerts"
            description="Notify when login occurs from a new IP"
            checked={loginAlerts}
            onChange={setLoginAlerts}
          />
        </div>

        {/* Session Timeout */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">Session Timeout</label>
          <select
            value={timeout}
            onChange={(e) => setTimeoutVal(e.target.value)}
            className="w-full px-3 h-[42px] text-[15px] text-slate-800 bg-white border border-[#CBD5E1] rounded-[10px] outline-hidden focus:border-[#14B8C5] focus:ring-4 focus:ring-[#14B8C5]/10"
          >
            <option value="15m">15 Minutes</option>
            <option value="30m">30 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-11 flex items-center justify-center font-bold text-white bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] rounded-[10px] transition-all duration-200 cursor-pointer shadow-xs select-none"
          >
            Update Security
          </button>
        </div>
      </form>
    </Card>
  );
};
