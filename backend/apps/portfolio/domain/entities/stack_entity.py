from dataclasses import dataclass


@dataclass(frozen=True)
class StackEntity:
    id: str
    category_id: str
    label: str
    icon: str | None
    monogram: str | None
    sort_order: int
