from dataclasses import dataclass


@dataclass(frozen=True)
class ProjectDTO:
    slug: str
    title: str
    problem: str
    decision: str
    role: str
    team_role: str
    status: str
    docs_url: str | None
    github_url: str | None
    service_url: str | None
    sort_order: int
