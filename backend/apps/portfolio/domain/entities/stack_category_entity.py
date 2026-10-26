from dataclasses import dataclass


@dataclass(frozen=True)
class StackCategoryEntity:
    id: str
    label: str
    sort_order: int
