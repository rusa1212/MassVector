import type { StockAnalysis } from "@/lib/technicalAnalysis";

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "positive" | "negative" | "neutral" | "accent";
}) {
  const toneClass = {
    positive: "bg-up/10 text-up",
    negative: "bg-down/10 text-down",
    neutral: "bg-white/10 text-fg-muted",
    accent: "bg-forecast/10 text-forecast",
  }[tone];

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneClass}`}>
      {label}
    </span>
  );
}

export function AnalysisPanel({ analysis }: { analysis: StockAnalysis }) {
  const trendTone =
    analysis.trend === "상승" ? "positive" : analysis.trend === "하락" ? "negative" : "neutral";
  const rsiTone =
    analysis.rsiStatus === "과매수"
      ? "negative"
      : analysis.rsiStatus === "과매도"
        ? "positive"
        : "neutral";

  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex flex-wrap gap-2">
        <Badge label={`추세 ${analysis.trend}`} tone={trendTone} />
        {analysis.rsi !== null && (
          <Badge label={`RSI ${analysis.rsi.toFixed(0)} · ${analysis.rsiStatus}`} tone={rsiTone} />
        )}
        {analysis.maCross !== "없음" && (
          <Badge
            label={analysis.maCross}
            tone={analysis.maCross === "골든크로스" ? "positive" : "negative"}
          />
        )}
        <Badge label={`변동성 ${analysis.volatilityPercent.toFixed(1)}%`} tone="accent" />
      </div>

      <ul className="flex flex-col gap-1.5 text-sm text-fg-muted">
        {analysis.insights.map((insight, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-fg-subtle">·</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
