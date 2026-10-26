from apps.portfolio.adapter.outbound.orms.education_orm import EducationORM
from apps.portfolio.domain.entities.education_entity import EducationEntity


def to_entity(orm: EducationORM) -> EducationEntity:
    return EducationEntity(
        id=orm.id,
        title=orm.title,
        organization=orm.organization,
        description=orm.description,
        started_on=orm.started_on,
        ended_on=orm.ended_on,
        status=orm.status,
        sort_order=orm.sort_order,
    )
