from dataclasses import dataclass


@dataclass(frozen=True)
class ProfileEntity:
    id: int
    name: str
    headline: str
    subtitle: str
