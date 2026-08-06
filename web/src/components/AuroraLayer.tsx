const GRADIENTS = {
  top: `
    radial-gradient(60% 55% at 30% 20%, oklch(0.62 0.15 35 / .55) 0%, transparent 70%),
    radial-gradient(55% 50% at 62% 8%,  oklch(0.55 0.17 320 / .55) 0%, transparent 72%),
    radial-gradient(70% 60% at 88% 30%, oklch(0.62 0.11 195 / .50) 0%, transparent 75%)
  `,
  bottom: `
    radial-gradient(60% 55% at 70% 80%, oklch(0.48 0.18 285 / .5) 0%, transparent 70%),
    radial-gradient(55% 50% at 20% 90%, oklch(0.62 0.15 35 / .45) 0%, transparent 72%),
    radial-gradient(65% 55% at 45% 70%, oklch(0.62 0.11 195 / .4) 0%, transparent 75%)
  `,
} as const;

const POSITION = {
  top: "inset-[-30%_-10%_auto_-10%] h-[90%]",
  bottom: "inset-[auto_-10%_-30%_-10%] h-[90%]",
} as const;

export function AuroraLayer({ variant }: { variant: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className={`aura-drift absolute ${POSITION[variant]}`}
        style={{ background: GRADIENTS[variant], filter: "blur(90px)" }}
      />
      <div className="grain-overlay" />
    </div>
  );
}
