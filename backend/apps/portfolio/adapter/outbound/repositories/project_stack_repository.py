from sqlalchemy import select
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.orm_mappers.project_stack_orm_mapper import to_entity
from apps.portfolio.adapter.outbound.orms.project_stack_orm import ProjectStackORM
from apps.portfolio.app.ports.output.project_stack_port import ProjectStackPort
from apps.portfolio.domain.entities.project_stack_entity import ProjectStackEntity


class ProjectStackRepository(ProjectStackPort):
    def __init__(self, session: Session):
        self._session = session

    def find_myself(self) -> ProjectStackEntity:
        return ProjectStackEntity(project_slug="myself", stack_id="myself")

    def find_all(self) -> list[ProjectStackEntity]:
        rows = self._session.scalars(
            select(ProjectStackORM).order_by(ProjectStackORM.project_slug, ProjectStackORM.stack_id)
        )
        return [to_entity(r) for r in rows]
