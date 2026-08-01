import type { NewsItem } from "@/lib/types";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>{item.source}</span>
        <span>·</span>
        <span>{item.date}</span>
      </div>
      <h3 className="font-semibold text-slate-900">{item.title}</h3>
      <p className="text-sm text-slate-600">{item.summary}</p>
    </article>
  );
}
