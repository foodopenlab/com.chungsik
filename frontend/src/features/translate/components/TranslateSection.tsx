"use client";

import type { Metric } from "@/shared/api/types";
import { useMetricsById } from "@/shared/metrics/useMetricsById";
import { useScanEnabled } from "@/shared/motion/useScanEnabled";
import { ScanReveal } from "@/shared/ui/ScanReveal";

import { CASES } from "../lib/cases";
import { CaseText } from "./CaseText";
import { TranslateScrubCase } from "./TranslateScrubCase";

export function TranslateSection() {
  const metrics = useMetricsById();
  const scan = useScanEnabled();
  const metricsOf = (ids: string[]) => ids.map((id) => metrics.get(id)).filter((m): m is Metric => !!m);

  return (
    <ScanReveal>
      <section aria-labelledby="translate-title" className="py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">02 / TRANSLATE</p>
          <h2 id="translate-title" className="mt-4 text-3xl font-bold break-keep md:text-[44px]">
            번역 4건
          </h2>
        </div>

        {scan ? (
          <ol className="mt-12">
            {CASES.map((c, i) => (
              <TranslateScrubCase key={c.object} c={c} index={i} metrics={metricsOf(c.metricIds)} />
            ))}
          </ol>
        ) : (
          // reduced-motion·WebGL 미지원: 정지 카드
          <ol className="mx-auto mt-12 grid max-w-[1280px] gap-6 px-4 md:px-10">
            {CASES.map((c, i) => (
              <li key={c.object} className="relative overflow-hidden border border-[var(--line)]">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-35"
                  style={{ backgroundImage: `url(${c.poster})` }}
                  aria-hidden
                />
                <div className="relative p-6 md:p-10">
                  <CaseText c={c} index={i} metrics={metricsOf(c.metricIds)} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </ScanReveal>
  );
}
