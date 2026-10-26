import type { Metric } from "@/shared/api/types";

const BADGE: Record<Metric["attribution"], { label: string; className: string }> = {
  personal: { label: "개인", className: "border-[var(--scan)] text-[var(--scan)]" },
  team: { label: "팀", className: "border-[var(--muted)] text-[var(--muted)]" },
};

export function AttributionBadge({ attribution }: { attribution: Metric["attribution"] }) {
  const b = BADGE[attribution];
  return <span className={`border px-1.5 py-px font-mono text-[11px] leading-none ${b.className}`}>{b.label}</span>;
}
