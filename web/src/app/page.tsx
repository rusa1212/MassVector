import Link from "next/link";
import { StockCard } from "@/components/StockCard";
import { WatchlistSummary } from "@/components/WatchlistSummary";
import { getPopularStocks } from "@/data/stocks";

export default function Home() {
  const popularStocks = getPopularStocks();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4 rounded-2xl bg-slate-900 px-6 py-10 text-white sm:px-10">
        <span className="text-sm font-medium text-slate-300">
          MassVector 주가 예측 서비스
        </span>
        <h1 className="max-w-xl text-2xl font-bold leading-snug sm:text-3xl">
          관심 있는 종목을 검색하고, 과거 흐름과 예측을 한눈에 확인해보세요.
        </h1>
        <p className="max-w-xl text-sm text-slate-300">
          현재는 화면 구조를 먼저 구성한 프로토타입 단계로, 실제 시세와 예측
          데이터는 추후 API 연동을 통해 제공될 예정입니다.
        </p>
        <Link
          href="/search"
          className="w-fit rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
        >
          종목 검색하러 가기
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            인기 검색 종목
          </h2>
          <Link href="/search" className="text-sm text-slate-500 hover:text-slate-800">
            전체보기
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularStocks.map((stock) => (
            <StockCard key={stock.id} stock={stock} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          내 관심 종목
        </h2>
        <WatchlistSummary />
      </section>
    </div>
  );
}
