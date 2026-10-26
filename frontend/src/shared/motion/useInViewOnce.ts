import { useEffect, useRef, useState } from "react";

// 요소 윗변이 화면 아래 15% 선을 처음 넘은 순간 true가 되고 이후 유지. 요소 높이와 무관하게 동작한다.
// rootMargin을 넓히면 화면에 닿기 전(근처)에 true — 미리 받기용
export function useInViewOnce<T extends Element>(rootMargin = "0px 0px -15% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}
