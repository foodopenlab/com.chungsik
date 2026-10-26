from apps.portfolio.adapter.outbound.orms.stack_category_orm import StackCategoryORM
from apps.portfolio.domain.entities.stack_category_entity import StackCategoryEntity


def to_entity(orm: StackCategoryORM) -> StackCategoryEntity:
    return StackCategoryEntity(id=orm.id, label=orm.label, sort_order=orm.sort_order)
