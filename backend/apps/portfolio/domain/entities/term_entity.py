from dataclasses import dataclass


@dataclass(frozen=True)
class TermEntity:
    id: int
    field: str
    dev: str
    note: str | None
    sort_order: int
