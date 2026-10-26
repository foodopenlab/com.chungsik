from dataclasses import dataclass


@dataclass(frozen=True)
class ProfileDTO:
    id: int
    name: str
    headline: str
    subtitle: str
