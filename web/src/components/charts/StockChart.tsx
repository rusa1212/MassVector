"use client";

import { useMemo, useRef, useState } from "react";
import type { PriceBar } from "@/lib/priceHistory";
import type { ForecastPoint } from "@/lib/technicalAnalysis";

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 320;
const PADDING = { top: 16, right: 16, bottom: 28, left: 56 };

const COLORS = {
  grid: "oklch(1 0 0 / 0.07)",
  axisLabel: "oklch(0.58 0.01 275)",
  close: "oklch(0.97 0.005 275)",
  ma5: "oklch(0.85 0 275 / 0.8)",
  ma20: "oklch(0.58 0.01 275)",
  forecast: "oklch(0.7 0.13 285)",
  forecastBand: "oklch(0.7 0.13 285 / 0.18)",
  crosshair: "oklch(0.58 0.01 275 / 0.5)",
};

interface ChartPoint {
  date: string;
  close: number | null;
  ma5: number | null;
  ma20: number | null;
  forecast: number | null;
  forecastUpper: number | null;
  forecastLower: number | null;
  isForecast: boolean;
}

function formatPrice(value: number): string {
  return value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
}

export function StockChart({
  bars,
  ma5,
  ma20,
  forecast,
  visibleBars,
  height = 288,
}: {
  bars: PriceBar[];
  ma5?: (number | null)[];
  ma20?: (number | null)[];
  forecast?: ForecastPoint[];
  visibleBars?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = useMemo<ChartPoint[]>(() => {
    const start = visibleBars ? Math.max(bars.length - visibleBars, 0) : 0;
    const history: ChartPoint[] = bars.slice(start).map((bar, i) => ({
      date: bar.date,
      close: bar.close,
      ma5: ma5 ? ma5[start + i] : null,
      ma20: ma20 ? ma20[start + i] : null,
      forecast: null,
      forecastUpper: null,
      forecastLower: null,
      isForecast: false,
    }));

    if (!forecast || forecast.length === 0) return history;

    const lastClose = bars[bars.length - 1].close;
    const bridge: ChartPoint = {
      date: bars[bars.length - 1].date,
      close: lastClose,
      ma5: null,
      ma20: null,
      forecast: lastClose,
      forecastUpper: lastClose,
      forecastLower: lastClose,
      isForecast: true,
    };

    const future: ChartPoint[] = forecast.map((point) => ({
      date: point.date,
      close: null,
      ma5: null,
      ma20: null,
      forecast: point.value,
      forecastUpper: point.upper,
      forecastLower: point.lower,
      isForecast: true,
    }));

    return [...history, bridge, ...future];
  }, [bars, ma5, ma20, forecast, visibleBars]);

  const { minY, maxY } = useMemo(() => {
    const values: number[] = [];
    for (const p of points) {
      if (p.close !== null) values.push(p.close);
      if (p.ma5 !== null) values.push(p.ma5);
      if (p.ma20 !== null) values.push(p.ma20);
      if (p.forecastUpper !== null) values.push(p.forecastUpper);
      if (p.forecastLower !== null) values.push(p.forecastLower);
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.08 || max * 0.02 || 1;
    return { minY: min - pad, maxY: max + pad };
  }, [points]);

  const chartWidth = VIEW_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = VIEW_HEIGHT - PADDING.top - PADDING.bottom;
  const n = points.length;

  const xAt = (i: number) =>
    PADDING.left + (n <= 1 ? 0 : (i / (n - 1)) * chartWidth);
  const yAt = (value: number) =>
    PADDING.top + (1 - (value - minY) / (maxY - minY || 1)) * chartHeight;

  const buildPath = (accessor: (p: ChartPoint) => number | null) => {
    let d = "";
    let drawing = false;
    points.forEach((p, i) => {
      const value = accessor(p);
      if (value === null) {
        drawing = false;
        return;
      }
      const x = xAt(i);
      const y = yAt(value);
      d += drawing ? ` L ${x} ${y}` : ` M ${x} ${y}`;
      drawing = true;
    });
    return d.trim();
  };

  const closePath = buildPath((p) => p.close);
  const ma5Path = ma5 ? buildPath((p) => p.ma5) : "";
  const ma20Path = ma20 ? buildPath((p) => p.ma20) : "";
  const forecastPath = forecast ? buildPath((p) => p.forecast) : "";

  const bandPath = useMemo(() => {
    if (!forecast) return "";
    const upperPts: string[] = [];
    const lowerPts: string[] = [];
    points.forEach((p, i) => {
      if (p.forecastUpper === null || p.forecastLower === null) return;
      const x = xAt(i);
      upperPts.push(`${x},${yAt(p.forecastUpper)}`);
      lowerPts.unshift(`${x},${yAt(p.forecastLower)}`);
    });
    if (upperPts.length === 0) return "";
    return `M ${upperPts.join(" L ")} L ${lowerPts.join(" L ")} Z`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, forecast, minY, maxY]);

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    minY + ((maxY - minY) * i) / (yTicks - 1),
  );

  const xTickCount = Math.min(6, n);
  const xTickIndexes = Array.from({ length: xTickCount }, (_, i) =>
    Math.round((i / Math.max(xTickCount - 1, 1)) * (n - 1)),
  );

  const handlePointerMove: React.PointerEventHandler<SVGSVGElement> = (e) => {
    const svg = svgRef.current;
    if (!svg || n === 0) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * VIEW_WIDTH;
    const ratio = (relX - PADDING.left) / chartWidth;
    const index = Math.round(ratio * (n - 1));
    setHoverIndex(Math.min(Math.max(index, 0), n - 1));
  };

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const hoverX = hoverIndex !== null ? xAt(hoverIndex) : null;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-full w-full touch-none select-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {yTickValues.map((value, i) => (
          <g key={i}>
            <line
              x1={PADDING.left}
              x2={VIEW_WIDTH - PADDING.right}
              y1={yAt(value)}
              y2={yAt(value)}
              stroke={COLORS.grid}
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 8}
              y={yAt(value)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill={COLORS.axisLabel}
            >
              {formatPrice(Math.round(value))}
            </text>
          </g>
        ))}

        {xTickIndexes.map((idx) => (
          <text
            key={idx}
            x={xAt(idx)}
            y={VIEW_HEIGHT - PADDING.bottom + 16}
            textAnchor="middle"
            fontSize={10}
            fill={COLORS.axisLabel}
          >
            {points[idx]?.date.slice(5)}
          </text>
        ))}

        {bandPath && <path d={bandPath} fill={COLORS.forecastBand} />}

        {ma20Path && (
          <path d={ma20Path} fill="none" stroke={COLORS.ma20} strokeWidth={1.5} />
        )}
        {ma5Path && (
          <path d={ma5Path} fill="none" stroke={COLORS.ma5} strokeWidth={1.5} />
        )}
        {closePath && (
          <path d={closePath} fill="none" stroke={COLORS.close} strokeWidth={2} />
        )}
        {forecastPath && (
          <path
            d={forecastPath}
            fill="none"
            stroke={COLORS.forecast}
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        )}

        {hoverX !== null && (
          <line
            x1={hoverX}
            x2={hoverX}
            y1={PADDING.top}
            y2={VIEW_HEIGHT - PADDING.bottom}
            stroke={COLORS.crosshair}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}
        {hovered && hovered.close !== null && hoverX !== null && (
          <circle cx={hoverX} cy={yAt(hovered.close)} r={3.5} fill={COLORS.close} />
        )}
        {hovered && hovered.forecast !== null && hoverX !== null && (
          <circle cx={hoverX} cy={yAt(hovered.forecast)} r={3.5} fill={COLORS.forecast} />
        )}
      </svg>

      {hovered && (
        <div
          className="glass-card pointer-events-none absolute top-2 rounded-lg px-3 py-2 text-xs"
          style={{
            left: `${Math.min(Math.max((hoverX! / VIEW_WIDTH) * 100, 8), 78)}%`,
          }}
        >
          <div className="font-medium text-fg-muted">{hovered.date}</div>
          {hovered.close !== null && (
            <div className="tabular-nums text-fg">종가 {formatPrice(hovered.close)}</div>
          )}
          {hovered.isForecast && hovered.forecast !== null && (
            <div className="tabular-nums text-forecast">
              예측 {formatPrice(hovered.forecast)}
              {hovered.forecastUpper !== null && hovered.forecastLower !== null && (
                <span className="text-fg-subtle">
                  {" "}
                  ({formatPrice(hovered.forecastLower)} ~ {formatPrice(hovered.forecastUpper)})
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
