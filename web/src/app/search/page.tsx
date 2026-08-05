import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { StockCard } from "@/components/StockCard";
import { searchStocks } from "@/data/stocks";
import type { Market } from "@/lib/types";

const marketTabs: Array<{ key: Market | "전체"; label: string }> = [
  { key: "전체", label: "전체" },
  { key: "코스피", label: "코스피" },
  { key: "코스닥", label: "코스닥" },
  { key: "미국", label: "미국" },
];

function buildHref(q: string, market: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (market !== "전체") params.set("market", market);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; market?: string }>;
}) {
  const { q = "", market = "전체" } = await searchParams;

  const results = searchStocks(q, market as Market | "전체");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-slate-900">종목 검색</h1>
        <SearchBar defaultValue={q} className="max-w-md" />
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {marketTabs.map((tab) => {
          const isActive = tab.key === market;
          return (
            <Link
              key={tab.key}
              href={buildHref(q, tab.key)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {results.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((stock) => (
            <StockCard key={stock.id} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
