from sqlalchemy import select
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.orm_mappers.metric_orm_mapper import to_entity
from apps.portfolio.adapter.outbound.orms.metric_orm import MetricORM
from apps.portfolio.app.ports.output.metric_port import MetricPort
from apps.portfolio.domain.entities.metric_entity import MetricEntity


class MetricRepository(MetricPort):
    def __init__(self, session: Session):
        self._session = session

    def find_myself(self) -> MetricEntity:
        return MetricEntity(
            id="myself", project_slug=None, value="0", label="myself",
            condition="myself", source="myself", side="software", attribution="personal", sort_order=0,
        )

    def find_all(self) -> list[MetricEntity]:
        rows = self._session.scalars(select(MetricORM).order_by(MetricORM.sort_order))
        return [to_entity(r) for r in rows]
