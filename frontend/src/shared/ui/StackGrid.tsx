import type { StackGroup } from "@/shared/stack/groupStacks";

import { StackTile, type TileSize, type TileState } from "./StackTile";

const LAYOUT: Record<TileSize, { grid: string; box: string; title: string; tiles: string }> = {
  full: {
    grid: "gap-4 md:grid-cols-2 lg:grid-cols-3",
    box: "p-4 md:p-6",
    title: "text-[15px]",
    tiles: "mt-5 gap-3 md:gap-4",
  },
  compact: { grid: "grid-cols-2 gap-2", box: "p-3", title: "text-xs", tiles: "mt-2 gap-1.5" },
};

// activeIds가 없으면 전부 idle, 있으면 포함된 타일만 active·나머지 dim
function tileState(id: string, activeIds?: ReadonlySet<string>): TileState {
  if (!activeIds) return "idle";
  return activeIds.has(id) ? "active" : "dim";
}

export function StackGrid({
  groups,
  size = "full",
  activeIds,
}: {
  groups: StackGroup[];
  size?: TileSize;
  activeIds?: ReadonlySet<string>;
}) {
  const l = LAYOUT[size];
  return (
    <div className={`grid ${l.grid}`}>
      {groups.map(({ category, stacks }) => (
        <div key={category.id} className={`border border-[var(--line)] ${l.box}`}>
          <h3 className={`text-[var(--data)] ${l.title}`}>{category.label}</h3>
          <ul className={`flex flex-wrap ${l.tiles}`}>
            {stacks.map((stack) => (
              <StackTile key={stack.id} stack={stack} size={size} state={tileState(stack.id, activeIds)} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
