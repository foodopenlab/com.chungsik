import type { ReactNode } from "react";

import { useInViewOnce } from "@/shared/motion/useInViewOnce";

// 섹션 진입 시 스캔 라인이 위→아래 1회(0.9s). 지나간 영역만 선명해진다. 스타일은 globals.css의 .scan-reveal
export function ScanReveal({ children }: { children: ReactNode }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className="scan-reveal relative" data-scanned={inView || undefined}>
      {children}
      <div className="scan-reveal-line" aria-hidden />
    </div>
  );
}
