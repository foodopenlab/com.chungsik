from dataclasses import dataclass


@dataclass(frozen=True)
class StackCategoryDTO:
    id: str
    label: str
    sort_order: int
