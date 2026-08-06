import type { NewsItem } from "@/lib/types";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="glass-card flex flex-col gap-1.5 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-fg-subtle">
        <span>{item.source}</span>
        <span>·</span>
        <span>{item.date}</span>
      </div>
      <h3 className="font-medium text-fg">{item.title}</h3>
      <p className="text-sm text-fg-muted">{item.summary}</p>
    </article>
  );
}
