from apps.portfolio.adapter.inbound.api.schemas.profile_schema import ProfileSchema
from apps.portfolio.app.dtos.profile_dto import ProfileDTO


def to_schema(dto: ProfileDTO) -> ProfileSchema:
    return ProfileSchema(id=dto.id, name=dto.name, headline=dto.headline, subtitle=dto.subtitle)
