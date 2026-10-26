"use client";

import { useEffect, useState } from "react";

// 화면 세로 중앙선에 걸친 프로젝트 블록(data-slug)을 활성으로 본다
export function useActiveSlug(slugs: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = slugs.join(",");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive((hit.target as HTMLElement).dataset.slug ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    key.split(",").forEach((slug) => {
      const el = document.querySelector(`[data-slug="${slug}"]`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [key]);

  return active;
}
