from apps.portfolio.adapter.outbound.orms.project_stack_orm import ProjectStackORM
from apps.portfolio.domain.entities.project_stack_entity import ProjectStackEntity


def to_entity(orm: ProjectStackORM) -> ProjectStackEntity:
    return ProjectStackEntity(project_slug=orm.project_slug, stack_id=orm.stack_id)
