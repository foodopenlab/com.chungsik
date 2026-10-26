from apps.portfolio.adapter.outbound.orms.profile_orm import ProfileORM
from apps.portfolio.domain.entities.profile_entity import ProfileEntity


def to_entity(orm: ProfileORM) -> ProfileEntity:
    return ProfileEntity(id=orm.id, name=orm.name, headline=orm.headline, subtitle=orm.subtitle)
