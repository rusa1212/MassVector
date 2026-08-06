import type { StockAnalysis } from "@/lib/technicalAnalysis";

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "up" | "down" | "neutral" | "highlight";
}) {
  const toneClass = {
    up: "bg-red-50 text-red-600",
    down: "bg-blue-50 text-blue-600",
    neutral: "bg-slate-100 text-slate-500",
    highlight: "bg-violet-50 text-violet-600",
  }[tone];

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneClass}`}>
      {label}
    </span>
  );
}

export function AnalysisPanel({ analysis }: { analysis: StockAnalysis }) {
  const trendTone =
    analysis.trend === "상승" ? "up" : analysis.trend === "하락" ? "down" : "neutral";
  const rsiTone =
    analysis.rsiStatus === "과매수"
      ? "up"
      : analysis.rsiStatus === "과매도"
        ? "down"
        : "neutral";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2">
        <Badge label={`추세 ${analysis.trend}`} tone={trendTone} />
        {analysis.rsi !== null && (
          <Badge label={`RSI ${analysis.rsi.toFixed(0)} · ${analysis.rsiStatus}`} tone={rsiTone} />
        )}
        {analysis.maCross !== "없음" && (
          <Badge
            label={analysis.maCross}
            tone={analysis.maCross === "골든크로스" ? "up" : "down"}
          />
        )}
        <Badge label={`변동성 ${analysis.volatilityPercent.toFixed(1)}%`} tone="highlight" />
      </div>

      <ul className="flex flex-col gap-1.5 text-sm text-slate-600">
        {analysis.insights.map((insight, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-slate-300">·</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
