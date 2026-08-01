"use client";

import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-600"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
