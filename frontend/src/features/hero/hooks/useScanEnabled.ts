"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

let webgl: boolean | undefined;
const hasWebGL = () => (webgl ??= !!document.createElement("canvas").getContext("webgl2"));

// 스캔 연출 사용 여부 — reduced-motion이거나 WebGL이 없으면 정지 HERO. 서버 렌더는 정지 상태.
export function useScanEnabled() {
  return useSyncExternalStore(subscribe, () => !window.matchMedia(QUERY).matches && hasWebGL(), () => false);
}
