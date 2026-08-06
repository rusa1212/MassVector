import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-fg-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-xl border border-hairline bg-white/5 px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-subtle focus:border-forecast focus:ring-1 focus:ring-forecast ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-down">{error}</p>}
    </div>
  );
}
