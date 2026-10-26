from dataclasses import dataclass


@dataclass(frozen=True)
class MetricDTO:
    id: str
    project_slug: str | None
    value: str
    label: str
    condition: str
    source: str
    side: str
    attribution: str
    sort_order: int
