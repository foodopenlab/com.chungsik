"use client";

import type { Metric, Stack } from "@/shared/api/types";
import { AttributionBadge } from "@/shared/ui/AttributionBadge";
import { CountUpText } from "@/shared/ui/CountUpText";

import type { ProjectView } from "../lib/buildProjectViews";
import { AwardTag } from "./AwardTag";
import { ProjectDemo } from "./ProjectDemo";

const SIDE_COLOR: Record<Metric["side"], string> = {
  field: "text-[var(--scan)]",
  software: "text-[var(--data)]",
  award: "text-[var(--award)]",
};

function Label({ children }: { children: string }) {
  return <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">{children}</p>;
}

export function ProjectBlock({ view, stacks }: { view: ProjectView; stacks: Stack[] }) {
  const { project, metrics } = view;
  const links = [
    ["문서 사이트", project.docsUrl],
    ["GitHub", project.githubUrl],
    ["서비스", project.serviceUrl],
  ].filter((l): l is [string, string] => !!l[1]);

  return (
    <article data-slug={project.slug} className="snap-start border-t border-[var(--line)] py-16 break-keep">
      <ProjectDemo slug={project.slug} title={project.title} />

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <h3 className="text-3xl font-bold">{project.title}</h3>
        <span className="border border-[var(--line)] px-2 py-0.5 font-mono text-xs text-[var(--muted)]">
          {project.status}
        </span>
        <AwardTag award={project.award} />
      </div>

      <div className="mt-6 grid max-w-[64ch] gap-6 text-lg leading-[1.7]">
        <div>
          <Label>PROBLEM</Label>
          <p className="mt-1">{project.problem}</p>
        </div>
        <div>
          <Label>DECISION</Label>
          <p className="mt-1">{project.decision}</p>
        </div>
      </div>

      {/* 3칸이 라벨·숫자·조건 3행을 subgrid로 공유해 칸마다 줄 높이를 맞춘다 */}
      <dl className="mt-10 grid gap-x-8 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.id} className="row-span-3 grid grid-rows-subgrid pb-6 sm:pb-0">
            <dt className="self-end text-sm leading-6 break-keep text-[var(--text)]">
              {m.label}
              <span className="ml-2 inline-block align-[1px]">
                <AttributionBadge attribution={m.attribution} />
              </span>
            </dt>
            <dd className={`mt-2 font-mono text-2xl leading-tight font-medium tabular-nums break-keep ${SIDE_COLOR[m.side]}`}>
              <CountUpText text={m.value} />
            </dd>
            <dd className="mt-3 text-xs leading-5 break-keep text-[var(--muted)]">{m.condition}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>MY ROLE</Label>
          <p className="mt-1 leading-[1.7]">{project.role}</p>
        </div>
        <div>
          <Label>TEAM</Label>
          <p className="mt-1 leading-[1.7]">{project.teamRole}</p>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-2 lg:hidden" aria-label="사용 기술">
        {stacks.map((s) => (
          <li key={s.id} className="border border-[var(--line)] px-2 py-1 font-mono text-xs">
            {s.label}
          </li>
        ))}
      </ul>

      {links.length > 0 && (
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {links.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="text-[var(--data)] hover:underline">
              {label} →
            </a>
          ))}
        </p>
      )}
    </article>
  );
}
