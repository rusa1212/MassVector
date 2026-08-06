"use client";

interface Tab {
  key: string;
  label: string;
}

export function TabMenu({
  tabs,
  activeKey,
  onChange,
}: {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-hairline">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-fg text-fg"
                : "border-transparent text-fg-subtle hover:text-fg-muted"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
