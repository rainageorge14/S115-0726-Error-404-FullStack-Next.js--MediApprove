import React from "react";

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  if (count <= 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-extrabold text-white animate-pulse shadow-md select-none border border-white">
      {count > 99 ? "99+" : count}
    </span>
  );
};
