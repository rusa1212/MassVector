import Link from "next/link";
import { ChangeText } from "@/components/StockCard";
import { WatchlistSummary } from "@/components/WatchlistSummary";
import { AuroraLayer } from "@/components/AuroraLayer";
import { StockChart } from "@/components/charts/StockChart";
import { getPopularStocks, getAllStocks, getStockById } from "@/data/stocks";
import { getPriceHistory } from "@/lib/priceHistory";
import { buildStockAnalysis } from "@/lib/technicalAnalysis";

const stats = [
  { label: "커버 종목 수", value: `${getAllStocks().length}개` },
  { label: "분석 지표", value: "이평·RSI·변동성 5종" },
  { label: "데이터 상태", value: "정적 목데이터" },
  { label: "데이터 소스", value: "API 연동 예정" },
];

const features = [
  {
    number: "01",
    title: "과거 주가 분석",
    description: "이동평균·RSI·변동성 지표로 종목의 흐름을 파악해요.",
  },
  {
    number: "02",
    title: "추세 기반 예측",
    description: "회귀 모델로 향후 가격 구간을 추정해요. (참고용)",
  },
  {
    number: "03",
    title: "관심 종목 관리",
    description: "관심 종목을 등록하고 알림 조건을 설정해요.",
  },
  {
    number: "04",
    title: "종목 비교",
    description: "최대 3개 종목의 시세와 등락률을 나란히 비교해요.",
  },
];

const steps = [
  {
    number: "01",
    title: "종목 검색",
    description: "이름 또는 티커로 원하는 종목을 찾아보세요.",
  },
  {
    number: "02",
    title: "분석 확인",
    description: "과거 흐름과 예측 구간을 한눈에 확인하세요.",
  },
  {
    number: "03",
    title: "관심 종목 등록",
    description: "알림을 설정하고 꾸준히 지켜보세요.",
  },
];

export default function Home() {
  const popularStocks = getPopularStocks();
  const demoStock = getStockById("005930")!;
  const demoBars = getPriceHistory(demoStock);
  const demoAnalysis = buildStockAnalysis(demoBars);

  return (
    <div className="flex flex-col gap-20 py-4 sm:gap-28">
      {/* 히어로 */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-hairline bg-surface px-6 py-20 sm:px-12 sm:py-28">
        <AuroraLayer variant="top" />
        <div className="relative z-10 flex max-w-2xl flex-col gap-6">
          <span
            className="animate-fade-up w-fit rounded-full border border-hairline px-3 py-1 text-xs font-medium tracking-[0.12em] text-fg-subtle uppercase"
          >
            실시간 주가 분석 &amp; 예측
          </span>
          <h1
            className="animate-fade-up text-gradient-fade text-5xl leading-[1.15] font-medium tracking-normal sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            흐름을 읽고,
            <br />
            다음을 그려보세요.
          </h1>
          <p
            className="animate-fade-up max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            관심 있는 종목을 검색하고, 과거 흐름과 추세 기반 예측을 한 화면에서
            확인해보세요. 지금은 화면 구조를 먼저 구성한 프로토타입 단계로,
            실제 시세와 예측 데이터는 추후 API 연동을 통해 제공될 예정입니다.
          </p>
          <div
            className="animate-fade-up flex flex-wrap gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              종목 검색하러 가기
            </Link>
            <Link
              href="#chart-demo"
              className="inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-white/5"
            >
              분석 데모 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 지표 바 */}
      <section className="grid grid-cols-2 divide-x divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-surface sm:grid-cols-4 sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 px-5 py-6">
            <span className="text-xs font-medium tracking-[0.12em] text-fg-subtle uppercase">
              {stat.label}
            </span>
            <span className="text-xl font-medium tabular-nums text-fg sm:text-2xl">
              {stat.value}
            </span>
          </div>
        ))}
      </section>

      {/* 핵심 차트 데모 */}
      <section id="chart-demo" className="scroll-mt-24">
        <div className="glass-card flex flex-col gap-6 rounded-[20px] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium tracking-[0.12em] text-fg-subtle uppercase">
                분석 데모
              </span>
              <h2 className="text-2xl font-medium text-fg">
                {demoStock.name} 과거 흐름 &amp; 예측
              </h2>
            </div>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <span className="text-2xl font-medium tabular-nums text-fg">
                {demoStock.price.toLocaleString("ko-KR")}
              </span>
              <ChangeText
                changeAmount={demoStock.changeAmount}
                changePercent={demoStock.changePercent}
              />
            </div>
          </div>
          <StockChart
            bars={demoBars}
            ma5={demoAnalysis.ma5}
            ma20={demoAnalysis.ma20}
            forecast={demoAnalysis.forecast}
            visibleBars={60}
            height={340}
          />
          <p className="text-sm text-fg-subtle">
            {demoAnalysis.insights[0]} 표시된 예측 구간은 목데이터 기반 추세
            모델의 참고용 추정치이며 투자 조언이 아닙니다.
          </p>
        </div>
      </section>

      {/* 기능 4카드 */}
      <section className="relative isolate">
        <AuroraLayer variant="bottom" />
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="glass-card relative flex flex-col gap-2 overflow-hidden rounded-2xl p-6"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-3 bottom-1 text-6xl font-medium text-white/10 tabular-nums select-none"
              >
                {feature.number}
              </span>
              <h3 className="relative text-lg font-medium text-fg">{feature.title}</h3>
              <p className="relative text-sm text-fg-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 작동 방식 */}
      <section className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col gap-2">
            <span className="text-sm font-medium tabular-nums text-fg-subtle">
              {step.number}
            </span>
            <h3 className="text-lg font-medium text-fg">{step.title}</h3>
            <p className="text-sm text-fg-muted">{step.description}</p>
          </div>
        ))}
      </section>

      {/* 종목 리스트 프리뷰 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-fg">인기 검색 종목</h2>
          <Link href="/search" className="text-sm text-fg-subtle hover:text-fg">
            전체보기
          </Link>
        </div>
        <div className="glass-card overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline text-xs text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">종목명</th>
                <th className="px-4 py-3 font-medium">시장</th>
                <th className="px-4 py-3 font-medium">현재가</th>
                <th className="px-4 py-3 font-medium">등락률</th>
              </tr>
            </thead>
            <tbody>
              {popularStocks.map((stock) => (
                <tr
                  key={stock.id}
                  className="border-b border-hairline transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/stock/${stock.id}`}
                      className="font-medium text-fg hover:underline"
                    >
                      {stock.name}
                    </Link>
                    <span className="ml-2 text-xs text-fg-subtle">{stock.ticker}</span>
                  </td>
                  <td className="px-4 py-3 text-fg-subtle">{stock.market}</td>
                  <td className="px-4 py-3 tabular-nums text-fg">
                    {stock.price.toLocaleString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <ChangeText
                      changeAmount={stock.changeAmount}
                      changePercent={stock.changePercent}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 내 관심 종목 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-fg">내 관심 종목</h2>
        <WatchlistSummary />
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-5 rounded-3xl bg-surface px-6 py-16 text-center sm:px-12">
        <h2 className="max-w-lg text-2xl font-medium text-fg sm:text-3xl">
          지금 관심 종목을 등록하고 분석을 시작해보세요.
        </h2>
        <Link
          href="/search"
          className="inline-flex items-center justify-center rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
        >
          종목 검색하러 가기
        </Link>
      </section>
    </div>
  );
}
