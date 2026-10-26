"use client";

import type { Metric } from "@/shared/api/types";
import { useMetricsById } from "@/shared/metrics/useMetricsById";
import { AttributionBadge } from "@/shared/ui/AttributionBadge";
import { CountUpText } from "@/shared/ui/CountUpText";
import { ScanReveal } from "@/shared/ui/ScanReveal";

const TEACH_METRIC_IDS = ["teach-ncs-years", "teach-satisfaction", "teach-youtube-reviews"];

const EMAIL = "kcs8815@gmail.com";

// 푸터 Docs 인덱스 — 프로젝트 문서 사이트(근거: docs/project-facts.md 매핑 표)
const DOCS = [
  { title: "Metabole", href: "https://metabole.beyondfacade.cloud" },
  { title: "Life Tutorial", href: "https://lifetutorial.beyondfacade.cloud" },
  { title: "localhost:daegu", href: "https://053.localhostdaegu.cloud" },
  { title: "TownPulse", href: "https://townpulse.beyondfacade.cloud" },
  { title: "REMAKE DAY 개발 허브", href: "https://blog.remakeday.com" },
  { title: "REMAKE DAY Research", href: "https://research.remakeday.com" },
];

export function ContactSection() {
  const metrics = useMetricsById();
  const teach = TEACH_METRIC_IDS.map((id) => metrics.get(id)).filter((m): m is Metric => !!m);

  return (
    <ScanReveal>
      <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-[1280px] px-4 py-24 md:px-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">07 / TEACH + CONTACT</p>
        <h2 id="contact-title" className="mt-4 text-3xl font-bold break-keep md:text-[44px]">
          가르치고, 연락받습니다
        </h2>

        <dl className="mt-12 grid gap-8 sm:grid-cols-3">
          {teach.map((m) => (
            <div key={m.id}>
              <dt className="flex items-center gap-2 text-sm">
              {m.label}
              <AttributionBadge attribution={m.attribution} />
            </dt>
              <dd className="mt-1 font-mono text-4xl font-medium text-[var(--scan)] tabular-nums"><CountUpText text={m.value} /></dd>
              <dd className="mt-2 text-xs text-[var(--muted)]">{m.condition}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-lg">공저 『먹는거로취업하자』</p>

        <p className="mt-12">
          <a href={`mailto:${EMAIL}`} className="font-mono text-lg text-[var(--data)] hover:underline">
            {EMAIL}
          </a>
        </p>

        <nav id="docs" aria-label="문서 사이트" className="mt-16 border-t border-[var(--line)] pt-8">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">DOCS</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {DOCS.map((d) => (
              <li key={d.href}>
                <a href={d.href} target="_blank" rel="noreferrer" className="text-[var(--data)] hover:underline">
                  {d.title} →
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative mt-24 flex aspect-[21/9] items-end overflow-hidden border border-[var(--line)]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/video/closing-poster.webp)" }}
            aria-hidden
          />
          <p className="relative p-6 font-mono text-sm text-[var(--text)]">영상은 연출, 숫자는 실측.</p>
        </div>
      </section>
    </ScanReveal>
  );
}
