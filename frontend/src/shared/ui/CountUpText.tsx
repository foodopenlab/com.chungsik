import { useEffect, useState } from "react";

import { countUp } from "@/shared/motion/countUp";
import { prefersReducedMotion } from "@/shared/motion/prefersReducedMotion";
import { useInViewOnce } from "@/shared/motion/useInViewOnce";

const DURATION_MS = 1200;

export function CountUpText({ text, className }: { text: string; className?: string }) {
  const [ref, inView] = useInViewOnce<HTMLSpanElement>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = prefersReducedMotion() ? 0 : DURATION_MS;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      setProgress(1 - (1 - t) ** 3);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{countUp(text, progress)}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
