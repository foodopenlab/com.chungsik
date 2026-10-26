from dataclasses import dataclass


@dataclass(frozen=True)
class StackDTO:
    id: str
    category_id: str
    label: str
    icon: str | None
    monogram: str | None
    sort_order: int
