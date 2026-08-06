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
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
      />
      <div className="glass-card relative w-full max-w-sm rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-base font-medium text-fg">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto text-fg-subtle hover:text-fg"
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
