"use client";

import type { Metric } from "@/shared/api/types";
import { AttributionBadge } from "@/shared/ui/AttributionBadge";
import { CountUpText } from "@/shared/ui/CountUpText";

import type { TranslateCase } from "../lib/cases";

const SIDE_COLOR: Record<Metric["side"], string> = {
  field: "text-[var(--scan)]",
  software: "text-[var(--data)]",
};

// labels·result: 0~1 노출 정도. 정적 버전은 둘 다 1.
export function CaseText({
  c,
  index,
  metrics,
  labels = 1,
  result = 1,
}: {
  c: TranslateCase;
  index: number;
  metrics: Metric[];
  labels?: number;
  result?: number;
}) {
  return (
    <div className="break-keep">
      <p className="font-mono text-sm text-[var(--muted)] tabular-nums">{String(index + 1).padStart(2, "0")} / 04</p>
      <h3 className="mt-1 text-xl font-bold md:mt-2 md:text-3xl">{c.object}</h3>
      <ul className="mt-3 flex flex-wrap gap-2 md:mt-5" aria-label="스캔 라벨">
        {c.labels.map((l, i) => (
          <li
            key={l}
            className="border border-[var(--data)] px-2 py-0.5 font-mono text-sm text-[var(--data)] transition-opacity duration-300"
            style={{ opacity: Math.min(1, Math.max(0, labels * (c.labels.length + 1) - i)) }}
          >
            {l}
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-xs text-[var(--muted)] md:mt-4 md:text-sm" style={{ opacity: labels }}>
        → {c.structure}
      </p>
      <div className="mt-5 transition-opacity duration-300 md:mt-10" style={{ opacity: result }}>
        {result > 0 && (
          <dl className="grid gap-3 md:gap-5">
            {metrics.map((m) => (
              <div key={m.id}>
                <dt className="text-sm">
                  {m.label}
                  <span className="ml-2 inline-block align-[1px]">
                    <AttributionBadge attribution={m.attribution} />
                  </span>
                </dt>
                <dd className={`mt-1 font-mono text-3xl leading-tight font-medium tabular-nums md:text-5xl ${SIDE_COLOR[m.side]}`}>
                  <CountUpText text={m.value} />
                </dd>
                <dd className="mt-1 text-[11px] leading-4 text-[var(--muted)] md:mt-2 md:text-xs md:leading-5">{m.condition}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="mt-4 text-lg font-bold md:mt-6 md:text-2xl">{c.conclusion}</p>
      </div>
    </div>
  );
}
