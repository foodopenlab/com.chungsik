"use client";

import type { Metric } from "@/shared/api/types";

import { useMetricsById } from "@/shared/metrics/useMetricsById";
import { AttributionBadge } from "@/shared/ui/AttributionBadge";
import { CountUpText } from "@/shared/ui/CountUpText";
import { ScanReveal } from "@/shared/ui/ScanReveal";

// 지시서 §2 "02 / TRANSLATE" 번역 4건. 숫자는 metric id로만 참조한다.
const CASES = [
  {
    object: "클립보드의 클레임 기록지",
    labels: ["유형", "공정", "원료", "계절"],
    structure: "파레토",
    metricIds: ["translate-claims"],
    conclusion: "접수에서 멈추지 않고 분류 체계를 만들었다",
    poster: "/video/translate-1-workbench-poster.webp",
  },
  {
    object: "말린 공장 도면",
    labels: ["면적", "전력", "폐수", "Capacity"],
    structure: "비교표 → 일정표",
    metricIds: ["translate-relocation"],
    conclusion: "“누가 맞나”를 “어떤 조건이 필요한가”로 바꿨다",
    poster: "/video/translate-2-corridor-poster.webp",
  },
  {
    object: "멈춘 모니터",
    labels: ["Worker", "상태", "DB", "Cache"],
    structure: "차수별 막대 — 차수마다 바꾼 것 하나씩(4차만 둘)",
    metricIds: ["metabole-rps", "metabole-users"],
    conclusion: "제조 병목 잡던 방식 그대로",
    poster: "/video/translate-3-pipes-poster.webp",
  },
  {
    object: "말풍선 “AI가 다 해줬으면”",
    labels: ["계산", "해석"],
    structure: "두 색으로 갈라짐",
    metricIds: ["localhost-daegu-persona"],
    conclusion: "어디까지 맡길지 먼저 정한다",
    poster: "/video/translate-4-panel-poster.webp",
  },
];

const SIDE_COLOR: Record<Metric["side"], string> = {
  field: "text-[var(--scan)]",
  software: "text-[var(--data)]",
};

export function TranslateSection() {
  const metrics = useMetricsById();

  return (
    <ScanReveal>
      <section aria-labelledby="translate-title" className="mx-auto max-w-[1280px] px-4 py-24 md:px-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">02 / TRANSLATE</p>
        <h2 id="translate-title" className="mt-4 text-3xl font-bold break-keep md:text-[44px]">
          번역 4건
        </h2>

        <ol className="mt-12 grid gap-6">
          {CASES.map((c, i) => (
            <li key={c.object} className="relative overflow-hidden border border-[var(--line)] break-keep">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-35"
                style={{ backgroundImage: `url(${c.poster})` }}
                aria-hidden
              />
              <div className="relative grid gap-8 p-6 md:grid-cols-[1fr_1fr] md:p-10">
                <div>
                  <p className="font-mono text-sm text-[var(--muted)] tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-2xl font-bold md:text-3xl">{c.object}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {c.labels.map((l) => (
                      <li key={l} className="border border-[var(--data)] px-2 py-0.5 font-mono text-sm text-[var(--data)]">
                        {l}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-sm text-[var(--muted)]">→ {c.structure}</p>
                </div>
                <div className="flex flex-col justify-end">
                  <dl className="grid gap-4">
                    {c.metricIds
                      .map((id) => metrics.get(id))
                      .filter((m): m is Metric => !!m)
                      .map((m) => (
                        <div key={m.id}>
                          <dt className="flex items-center gap-2 text-sm">
                          {m.label}
                          <AttributionBadge attribution={m.attribution} />
                        </dt>
                          <dd className={`font-mono text-4xl font-medium tabular-nums md:text-5xl ${SIDE_COLOR[m.side]}`}>
                            <CountUpText text={m.value} />
                          </dd>
                          <dd className="mt-1 text-xs text-[var(--muted)]">{m.condition}</dd>
                        </div>
                      ))}
                  </dl>
                  <p className="mt-6 text-xl font-bold">{c.conclusion}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </ScanReveal>
  );
}
