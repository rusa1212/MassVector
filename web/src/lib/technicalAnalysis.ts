import type { PriceBar } from "@/lib/priceHistory";

export interface ForecastPoint {
  date: string;
  value: number;
  upper: number;
  lower: number;
}

export type TrendDirection = "상승" | "하락" | "횡보";
export type RsiStatus = "과매수" | "과매도" | "중립";
export type MaCrossSignal = "골든크로스" | "데드크로스" | "없음";

export interface StockAnalysis {
  trend: TrendDirection;
  periodChangePercent: number;
  ma5: (number | null)[];
  ma20: (number | null)[];
  ma60: (number | null)[];
  rsi: number | null;
  rsiStatus: RsiStatus;
  volatilityPercent: number;
  maCross: MaCrossSignal;
  support: number;
  resistance: number;
  forecast: ForecastPoint[];
  insights: string[];
}

function addTradingDays(dateStr: string, count: number): string {
  const date = new Date(`${dateStr}T00:00:00+09:00`);
  let remaining = count;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function sma(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i += 1) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    result.push(i >= period - 1 ? sum / period : null);
  }
  return result;
}

export function rsi(closes: number[], period = 14): number | null {
  if (closes.length <= period) return null;
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i += 1) {
    const delta = closes[i] - closes[i - 1];
    if (delta >= 0) avgGain += delta;
    else avgLoss -= delta;
  }
  avgGain /= period;
  avgLoss /= period;

  for (let i = period + 1; i < closes.length; i += 1) {
    const delta = closes[i] - closes[i - 1];
    const gain = delta > 0 ? delta : 0;
    const loss = delta < 0 ? -delta : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function annualizedVolatilityPercent(closes: number[], window = 20): number {
  const slice = closes.slice(-window - 1);
  if (slice.length < 2) return 0;
  const returns: number[] = [];
  for (let i = 1; i < slice.length; i += 1) {
    returns.push(Math.log(slice[i] / slice[i - 1]));
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  const dailyStdev = Math.sqrt(variance);
  return dailyStdev * Math.sqrt(252) * 100;
}

function linearRegression(values: number[]): { slope: number; intercept: number; residualStdev: number } {
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    num += (i - xMean) * (values[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;

  let residualSumSq = 0;
  for (let i = 0; i < n; i += 1) {
    const predicted = slope * i + intercept;
    residualSumSq += (values[i] - predicted) ** 2;
  }
  const residualStdev = Math.sqrt(residualSumSq / n);

  return { slope, intercept, residualStdev };
}

function buildForecast(bars: PriceBar[], horizon = 10): ForecastPoint[] {
  const regressionWindow = Math.min(30, bars.length);
  const recent = bars.slice(-regressionWindow);
  const closes = recent.map((bar) => bar.close);
  const { slope, intercept, residualStdev } = linearRegression(closes);

  const lastDate = bars[bars.length - 1].date;
  const points: ForecastPoint[] = [];
  for (let h = 1; h <= horizon; h += 1) {
    const x = regressionWindow - 1 + h;
    const value = Math.max(intercept + slope * x, 0.01);
    const band = residualStdev * Math.sqrt(1 + h / 3);
    points.push({
      date: addTradingDays(lastDate, h),
      value: Math.round(value * 100) / 100,
      upper: Math.round((value + band) * 100) / 100,
      lower: Math.round(Math.max(value - band, 0.01) * 100) / 100,
    });
  }
  return points;
}

export function buildStockAnalysis(bars: PriceBar[]): StockAnalysis {
  const closes = bars.map((bar) => bar.close);
  const ma5 = sma(closes, 5);
  const ma20 = sma(closes, 20);
  const ma60 = sma(closes, 60);

  const lookback = Math.min(20, bars.length - 1);
  const periodChangePercent =
    ((closes[closes.length - 1] - closes[closes.length - 1 - lookback]) /
      closes[closes.length - 1 - lookback]) *
    100;

  let trend: TrendDirection = "횡보";
  if (periodChangePercent >= 2) trend = "상승";
  else if (periodChangePercent <= -2) trend = "하락";

  const rsiValue = rsi(closes);
  let rsiStatus: RsiStatus = "중립";
  if (rsiValue !== null) {
    if (rsiValue >= 70) rsiStatus = "과매수";
    else if (rsiValue <= 30) rsiStatus = "과매도";
  }

  const volatilityPercent = annualizedVolatilityPercent(closes);

  let maCross: MaCrossSignal = "없음";
  const prevMa5 = ma5[ma5.length - 2];
  const prevMa20 = ma20[ma20.length - 2];
  const currMa5 = ma5[ma5.length - 1];
  const currMa20 = ma20[ma20.length - 1];
  if (
    prevMa5 !== null &&
    prevMa20 !== null &&
    currMa5 !== null &&
    currMa20 !== null
  ) {
    if (prevMa5 <= prevMa20 && currMa5 > currMa20) maCross = "골든크로스";
    else if (prevMa5 >= prevMa20 && currMa5 < currMa20) maCross = "데드크로스";
  }

  const supportWindow = closes.slice(-60);
  const roundToDisplay = (value: number) =>
    value >= 100 ? Math.round(value) : Math.round(value * 100) / 100;
  const support = roundToDisplay(Math.min(...supportWindow));
  const resistance = roundToDisplay(Math.max(...supportWindow));

  const forecast = buildForecast(bars);
  const forecastChangePercent =
    ((forecast[forecast.length - 1].value - closes[closes.length - 1]) /
      closes[closes.length - 1]) *
    100;

  const insights: string[] = [];
  insights.push(
    trend === "상승"
      ? `최근 20거래일간 ${periodChangePercent.toFixed(1)}% 상승하며 상승 추세를 보이고 있습니다.`
      : trend === "하락"
        ? `최근 20거래일간 ${periodChangePercent.toFixed(1)}% 하락하며 하락 추세를 보이고 있습니다.`
        : `최근 20거래일간 ${periodChangePercent.toFixed(1)}%로 뚜렷한 방향성 없이 횡보하고 있습니다.`,
  );

  if (maCross === "골든크로스") {
    insights.push("5일 이동평균선이 20일 이동평균선을 상향 돌파하는 골든크로스가 발생했습니다.");
  } else if (maCross === "데드크로스") {
    insights.push("5일 이동평균선이 20일 이동평균선을 하향 돌파하는 데드크로스가 발생했습니다.");
  }

  if (rsiValue !== null) {
    insights.push(
      rsiStatus === "과매수"
        ? `RSI가 ${rsiValue.toFixed(1)}로 과매수 구간에 진입해 단기 조정 가능성이 있습니다.`
        : rsiStatus === "과매도"
          ? `RSI가 ${rsiValue.toFixed(1)}로 과매도 구간에 있어 단기 반등 가능성이 있습니다.`
          : `RSI는 ${rsiValue.toFixed(1)}로 중립 수준을 유지하고 있습니다.`,
    );
  }

  insights.push(
    `연환산 변동성은 약 ${volatilityPercent.toFixed(1)}%로, 최근 60거래일 지지선은 ${support.toLocaleString(
      "ko-KR",
    )}, 저항선은 ${resistance.toLocaleString("ko-KR")} 수준입니다.`,
  );

  insights.push(
    `추세선 기반 예측 모델은 향후 ${forecast.length}거래일간 ${
      forecastChangePercent >= 0 ? "+" : ""
    }${forecastChangePercent.toFixed(1)}%의 가격 변동을 시사합니다. (참고용 예측이며 투자 조언이 아닙니다)`,
  );

  return {
    trend,
    periodChangePercent,
    ma5,
    ma20,
    ma60,
    rsi: rsiValue,
    rsiStatus,
    volatilityPercent,
    maCross,
    support,
    resistance,
    forecast,
    insights,
  };
}
