from sqlalchemy import select
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.orm_mappers.term_orm_mapper import to_entity
from apps.portfolio.adapter.outbound.orms.term_orm import TermORM
from apps.portfolio.app.ports.output.term_port import TermPort
from apps.portfolio.domain.entities.term_entity import TermEntity


class TermRepository(TermPort):
    def __init__(self, session: Session):
        self._session = session

    def find_myself(self) -> TermEntity:
        return TermEntity(id=0, field="myself", dev="myself", note=None, sort_order=0)

    def find_all(self) -> list[TermEntity]:
        rows = self._session.scalars(select(TermORM).order_by(TermORM.sort_order))
        return [to_entity(r) for r in rows]
