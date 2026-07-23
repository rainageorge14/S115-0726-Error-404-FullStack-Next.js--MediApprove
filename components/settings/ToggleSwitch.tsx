import React from "react";

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between py-1.5 select-none">
      <div className="flex flex-col text-left">
        <span className="text-xs font-semibold text-slate-800">{label}</span>
        {description && <span className="text-[10px] text-slate-400 font-medium mt-0.5">{description}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
          checked ? "bg-[#14B8C5]" : "bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4.5" : "translate-x-0"
          }`}
          style={{ backgroundColor: "#ffffff" }}
        />
      </button>
    </div>
  );
};
