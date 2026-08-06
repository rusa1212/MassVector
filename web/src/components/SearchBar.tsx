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
        className="min-w-0 flex-1 rounded-l-full border border-hairline bg-white/5 px-4 py-2 text-sm text-fg outline-none placeholder:text-fg-subtle focus:border-forecast focus:ring-1 focus:ring-forecast"
      />
      <button
        type="submit"
        className="shrink-0 rounded-r-full border border-l-0 border-hairline bg-fg px-4 text-sm font-medium whitespace-nowrap text-bg transition-opacity hover:opacity-85"
      >
        검색
      </button>
    </form>
  );
}
