"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press, lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  // Close on clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-navy/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-[16px] shadow-2xl border border-border-color p-6 relative animate-fade-in space-y-5"
      >
        {/* Header Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h3
              id="confirm-title"
              className="text-lg font-extrabold text-dark-navy tracking-tight"
            >
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons Panel */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isLoading}
            className="!py-2.5 text-xs font-bold border border-border-color text-slate-500 hover:bg-slate-50 rounded-xl bg-white"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={isLoading}
            className="!py-2.5 text-xs font-bold !bg-success hover:!bg-emerald-600 active:scale-95 transition-all text-white rounded-xl"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
