export function SearchBar({
  defaultValue = "",
  className = "",
}: {
  defaultValue?: string;
  className?: string;
}) {
  return (
    <form action="/search" method="GET" className={`flex ${className}`}>
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder="종목명 또는 티커 검색"
        className="w-full rounded-l-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
      />
      <button
        type="submit"
        className="rounded-r-lg border border-l-0 border-slate-300 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700"
      >
        검색
      </button>
    </form>
  );
}
