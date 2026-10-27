from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.orm_mappers.education_orm_mapper import to_entity
from apps.portfolio.adapter.outbound.orms.education_orm import EducationORM
from apps.portfolio.app.ports.output.education_port import EducationPort
from apps.portfolio.domain.entities.education_entity import EducationEntity


class EducationRepository(EducationPort):
    def __init__(self, session: Session):
        self._session = session

    def find_myself(self) -> EducationEntity:
        return EducationEntity(
            id=0, title="myself", organization="myself", description="myself",
            started_on=date(2000, 1, 1), ended_on=date(2000, 1, 1), status="myself", award=None, sort_order=0,
        )

    def find_all(self) -> list[EducationEntity]:
        rows = self._session.scalars(select(EducationORM).order_by(EducationORM.sort_order))
        return [to_entity(r) for r in rows]
