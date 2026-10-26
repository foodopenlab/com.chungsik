from sqlalchemy import select
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.orm_mappers.project_orm_mapper import to_entity
from apps.portfolio.adapter.outbound.orms.project_orm import ProjectORM
from apps.portfolio.app.ports.output.project_port import ProjectPort
from apps.portfolio.domain.entities.project_entity import ProjectEntity


class ProjectRepository(ProjectPort):
    def __init__(self, session: Session):
        self._session = session

    def find_myself(self) -> ProjectEntity:
        return ProjectEntity(
            slug="myself", title="myself", problem="", decision="", role="", team_role="",
            status="", docs_url=None, github_url=None, service_url=None, sort_order=0,
        )

    def find_all(self) -> list[ProjectEntity]:
        rows = self._session.scalars(select(ProjectORM).order_by(ProjectORM.sort_order))
        return [to_entity(r) for r in rows]
