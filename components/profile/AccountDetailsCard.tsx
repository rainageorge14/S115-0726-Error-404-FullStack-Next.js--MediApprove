import React, { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Camera, Trash2 } from "lucide-react";

interface AccountDetailsCardProps {
  role: string;
  memberSince: string;
  lastLogin: string;
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
}

export const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({
  role,
  memberSince,
  lastLogin,
  avatarUrl,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onAvatarChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6 rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] select-none text-center">
      <h3 className="text-base font-bold text-[#0F172A] tracking-tight mb-5 text-left">Account Details</h3>

      {/* Photo Upload Section */}
      <div className="flex flex-col items-center mb-6">
        <div
          onClick={handleContainerClick}
          className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 cursor-pointer overflow-hidden group relative transition-all duration-200 hover:border-primary shadow-inner"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-extrabold text-slate-400 uppercase">AU</span>
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white">
            <Camera className="w-5 h-5 mb-0.5 text-white/90" />
            <span className="text-[10px] font-bold text-white/95">Change</span>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleContainerClick}
            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer select-none"
          >
            Upload Photo
          </button>
          {avatarUrl && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <button
                onClick={handleRemove}
                className="text-xs font-bold text-danger hover:text-danger/80 transition-colors flex items-center gap-1 cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 text-left border-t border-[#F1F5F9] pt-5">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Role</span>
          <span className="text-sm font-extrabold text-[#0F172A] mt-1 block">{role}</span>
        </div>
        <div className="pt-3 border-t border-[#F1F5F9]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Member Since</span>
          <span className="text-sm font-extrabold text-[#0F172A] mt-1 block">{memberSince}</span>
        </div>
        <div className="pt-3 border-t border-[#F1F5F9]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Last Login</span>
          <span className="text-sm font-extrabold text-[#0F172A] mt-1 block">{lastLogin}</span>
        </div>
      </div>
    </Card>
  );
};
