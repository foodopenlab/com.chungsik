import { Icon } from "@iconify/react";

import type { Stack } from "@/shared/api/types";

export type TileSize = "full" | "compact";
export type TileState = "idle" | "active" | "dim";

const SIZE: Record<TileSize, { item: string; box: string; icon: number; mono: string; label: string }> = {
  full: { item: "w-24 gap-2", box: "size-24 rounded-xl", icon: 40, mono: "text-lg", label: "text-sm" },
  compact: { item: "w-10", box: "size-10 rounded-lg", icon: 20, mono: "text-[11px]", label: "sr-only" },
};

const STATE: Record<TileState, string> = {
  idle: "border-[var(--line)]",
  active: "border-[var(--scan)] shadow-[0_0_12px_var(--scan)]",
  dim: "border-[var(--line)] opacity-25 grayscale",
};

export function StackTile({ stack, size = "full", state = "idle" }: { stack: Stack; size?: TileSize; state?: TileState }) {
  const s = SIZE[size];
  return (
    <li className={`flex flex-col items-center ${s.item}`} title={stack.label} data-state={state}>
      <div
        className={`flex items-center justify-center border bg-[var(--bg-tile)] transition-[opacity,filter,border-color,box-shadow] duration-400 ${s.box} ${STATE[state]}`}
      >
        {stack.icon ? (
          <Icon icon={stack.icon} width={s.icon} height={s.icon} aria-hidden />
        ) : (
          <span className={`font-mono font-medium text-[var(--text)] ${s.mono}`} aria-hidden>
            {stack.monogram}
          </span>
        )}
      </div>
      <span className={`text-center leading-tight text-[var(--text)] ${s.label}`}>{stack.label}</span>
    </li>
  );
}
