from dataclasses import dataclass


@dataclass(frozen=True)
class ProjectStackEntity:
    project_slug: str
    stack_id: str
