from dataclasses import dataclass


@dataclass(frozen=True)
class TermDTO:
    id: int
    field: str
    dev: str
    note: str | None
    sort_order: int
