from dataclasses import asdict

from apps.portfolio.adapter.inbound.api.schemas.project_schema import ProjectSchema
from apps.portfolio.app.dtos.project_dto import ProjectDTO


def to_schema(dto: ProjectDTO) -> ProjectSchema:
    return ProjectSchema(**asdict(dto))
