"use client";

import { useMetricsById } from "@/shared/metrics/useMetricsById";
import { CountUpText } from "@/shared/ui/CountUpText";
import { ScanReveal } from "@/shared/ui/ScanReveal";

import { useGapPairs } from "../hooks/useGapPairs";

export function GapSection() {
  const pairs = useGapPairs();
  const metrics = useMetricsById();
  const fieldYears = metrics.get("gap-field-years");
  const services = metrics.get("gap-services");

  return (
    <ScanReveal>
      <section id="gap" aria-labelledby="gap-title" className="mx-auto max-w-[1280px] px-4 py-24 md:px-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">01 / GAP</p>
        <h2 id="gap-title" className="mt-4 text-3xl font-bold break-keep md:text-[44px]">
          같은 공장, 다른 언어
        </h2>

        <div className="relative mt-12 grid grid-cols-2 gap-x-6 md:gap-x-16">
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-[var(--scan)]" aria-hidden />
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">현장</p>
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">개발</p>
          {pairs.map((t) => (
            <div key={t.id} className="contents">
              <p className="mt-6 font-[family-name:var(--font-hand)] text-xl leading-snug break-keep md:text-[28px]">
                {t.field}
              </p>
              <p className="mt-6 self-center font-mono text-sm break-keep text-[var(--data)] md:text-base">{t.dev}</p>
            </div>
          ))}
        </div>

        {fieldYears && services && (
          <p className="mt-16 text-2xl leading-snug font-bold break-keep md:text-4xl">
            현장 <CountUpText text={fieldYears.value} className="tabular-nums text-[var(--scan)]" />. 개발 과정에서 서비스{" "}
            <CountUpText text={services.value} className="tabular-nums text-[var(--data)]" /> 배포. 양쪽에 다 있었습니다.
          </p>
        )}
      </section>
    </ScanReveal>
  );
}
