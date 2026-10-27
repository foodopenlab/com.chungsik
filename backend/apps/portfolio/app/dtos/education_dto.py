from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class EducationDTO:
    id: int
    title: str
    organization: str
    description: str
    started_on: date
    ended_on: date
    status: str
    award: str | None
    sort_order: int
