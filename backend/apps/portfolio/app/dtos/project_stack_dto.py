from dataclasses import dataclass


@dataclass(frozen=True)
class ProjectStackDTO:
    project_slug: str
    stack_id: str
