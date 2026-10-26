from apps.portfolio.adapter.inbound.api.schemas.stack_schema import StackSchema
from apps.portfolio.app.dtos.stack_dto import StackDTO


def to_schema(dto: StackDTO) -> StackSchema:
    return StackSchema(
        id=dto.id,
        category_id=dto.category_id,
        label=dto.label,
        icon=dto.icon,
        monogram=dto.monogram,
        sort_order=dto.sort_order,
    )
