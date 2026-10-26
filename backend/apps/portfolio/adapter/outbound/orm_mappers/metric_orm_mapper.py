from apps.portfolio.adapter.outbound.orms.metric_orm import MetricORM
from apps.portfolio.domain.entities.metric_entity import MetricEntity


def to_entity(orm: MetricORM) -> MetricEntity:
    return MetricEntity(
        id=orm.id,
        project_slug=orm.project_slug,
        value=orm.value,
        label=orm.label,
        condition=orm.condition,
        source=orm.source,
        side=orm.side,
        attribution=orm.attribution,
        sort_order=orm.sort_order,
    )
