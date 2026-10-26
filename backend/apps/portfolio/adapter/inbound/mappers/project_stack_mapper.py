from apps.portfolio.adapter.inbound.api.schemas.project_stack_schema import ProjectStackSchema
from apps.portfolio.app.dtos.project_stack_dto import ProjectStackDTO


def to_schema(dto: ProjectStackDTO) -> ProjectStackSchema:
    return ProjectStackSchema(project_slug=dto.project_slug, stack_id=dto.stack_id)
