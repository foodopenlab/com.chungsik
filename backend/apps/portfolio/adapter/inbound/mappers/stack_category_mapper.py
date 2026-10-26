from apps.portfolio.adapter.inbound.api.schemas.stack_category_schema import StackCategorySchema
from apps.portfolio.app.dtos.stack_category_dto import StackCategoryDTO


def to_schema(dto: StackCategoryDTO) -> StackCategorySchema:
    return StackCategorySchema(id=dto.id, label=dto.label, sort_order=dto.sort_order)
