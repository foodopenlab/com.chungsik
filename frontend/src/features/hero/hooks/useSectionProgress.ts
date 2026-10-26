"use client";

import { useEffect, useRef, useState } from "react";

// 섹션이 화면 위로 지나간 비율(0~1). sticky 고정 구간 = 섹션 높이 - 화면 높이
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const range = height - window.innerHeight;
      setProgress(range > 0 ? Math.min(1, Math.max(0, -top / range)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return [ref, progress] as const;
}
