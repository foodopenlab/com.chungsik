from sqlalchemy import select
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.orm_mappers.profile_orm_mapper import to_entity
from apps.portfolio.adapter.outbound.orms.profile_orm import ProfileORM
from apps.portfolio.app.ports.output.profile_port import ProfilePort
from apps.portfolio.domain.entities.profile_entity import ProfileEntity


class ProfileRepository(ProfilePort):
    def __init__(self, session: Session):
        self._session = session

    def find_myself(self) -> ProfileEntity:
        return ProfileEntity(id=0, name="myself", headline="myself", subtitle="myself")

    def find_all(self) -> list[ProfileEntity]:
        rows = self._session.scalars(select(ProfileORM).order_by(ProfileORM.id))
        return [to_entity(r) for r in rows]
