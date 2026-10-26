from apps.portfolio.adapter.outbound.orms.stack_orm import StackORM
from apps.portfolio.domain.entities.stack_entity import StackEntity


def to_entity(orm: StackORM) -> StackEntity:
    return StackEntity(
        id=orm.id,
        category_id=orm.category_id,
        label=orm.label,
        icon=orm.icon,
        monogram=orm.monogram,
        sort_order=orm.sort_order,
    )
