"use client";

import { useStackGroups } from "@/shared/stack/useStackGroups";
import { StackGrid } from "@/shared/ui/StackGrid";
import { ScanReveal } from "@/shared/ui/ScanReveal";

import { useActiveSlug } from "../hooks/useActiveSlug";
import { useProjectViews } from "../hooks/useProjectViews";
import { EducationBlock } from "./EducationBlock";
import { ProjectBlock } from "./ProjectBlock";

export function BuiltSection() {
  const { views, isPending, isError } = useProjectViews();
  const { groups } = useStackGroups();
  const active = useActiveSlug(views.map((v) => v.project.slug));
  const activeIds = views.find((v) => v.project.slug === active)?.stackIds;
  const allStacks = groups.flatMap((g) => g.stacks);

  return (
    <ScanReveal>
      <section id="built" aria-labelledby="built-title" className="mx-auto max-w-[1280px] px-4 py-24 md:px-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-[var(--data)]">04 / BUILT</p>
        <h2 id="built-title" className="mt-4 text-3xl font-bold md:text-[44px]">
          만든 것
        </h2>
        <EducationBlock projectCount={views.length} />

        {isError && <p className="mt-12 text-[var(--muted)]">프로젝트를 불러오지 못했습니다.</p>}

        <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr]" aria-busy={isPending}>
          <div>
            {views.map((view) => (
              <ProjectBlock key={view.project.slug} view={view} stacks={allStacks.filter((s) => view.stackIds.has(s.id))} />
            ))}
          </div>
          <aside className="hidden lg:block" aria-label="프로젝트별 사용 기술">
            <div className="sticky top-8">
              <StackGrid groups={groups} size="compact" activeIds={activeIds} />
            </div>
          </aside>
        </div>
      </section>
    </ScanReveal>
  );
}
