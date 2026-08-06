export function PlaceholderChart({ label }: { label: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-hairline text-fg-subtle">
      <span className="text-3xl">📈</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs">API 연동 예정</span>
    </div>
  );
}
