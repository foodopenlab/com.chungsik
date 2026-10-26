from apps.portfolio.adapter.inbound.api.schemas.term_schema import TermSchema
from apps.portfolio.app.dtos.term_dto import TermDTO


def to_schema(dto: TermDTO) -> TermSchema:
    return TermSchema(id=dto.id, field=dto.field, dev=dto.dev, note=dto.note, sort_order=dto.sort_order)
