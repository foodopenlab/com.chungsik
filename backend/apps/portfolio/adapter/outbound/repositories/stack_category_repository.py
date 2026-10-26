from sqlalchemy import select
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.orm_mappers.stack_category_orm_mapper import to_entity
from apps.portfolio.adapter.outbound.orms.stack_category_orm import StackCategoryORM
from apps.portfolio.app.ports.output.stack_category_port import StackCategoryPort
from apps.portfolio.domain.entities.stack_category_entity import StackCategoryEntity


class StackCategoryRepository(StackCategoryPort):
    def __init__(self, session: Session):
        self._session = session

    def find_myself(self) -> StackCategoryEntity:
        return StackCategoryEntity(id="myself", label="myself", sort_order=0)

    def find_all(self) -> list[StackCategoryEntity]:
        rows = self._session.scalars(select(StackCategoryORM).order_by(StackCategoryORM.sort_order))
        return [to_entity(r) for r in rows]
