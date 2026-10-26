from sqlalchemy import select
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.orm_mappers.stack_orm_mapper import to_entity
from apps.portfolio.adapter.outbound.orms.stack_category_orm import StackCategoryORM
from apps.portfolio.adapter.outbound.orms.stack_orm import StackORM
from apps.portfolio.app.ports.output.stack_port import StackPort
from apps.portfolio.domain.entities.stack_entity import StackEntity


class StackRepository(StackPort):
    def __init__(self, session: Session):
        self._session = session

    def find_myself(self) -> StackEntity:
        return StackEntity(id="myself", category_id="myself", label="myself", icon=None, monogram="ME", sort_order=0)

    def find_all(self) -> list[StackEntity]:
        rows = self._session.scalars(
            select(StackORM)
            .join(StackCategoryORM, StackORM.category_id == StackCategoryORM.id)
            .order_by(StackCategoryORM.sort_order, StackORM.sort_order)
        )
        return [to_entity(r) for r in rows]
