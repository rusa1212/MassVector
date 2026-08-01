export function PlaceholderChart({ label }: { label: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
      <span className="text-3xl">📈</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs">API 연동 예정</span>
    </div>
  );
}
