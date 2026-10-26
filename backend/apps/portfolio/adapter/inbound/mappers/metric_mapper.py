from dataclasses import asdict

from apps.portfolio.adapter.inbound.api.schemas.metric_schema import MetricSchema
from apps.portfolio.app.dtos.metric_dto import MetricDTO


def to_schema(dto: MetricDTO) -> MetricSchema:
    return MetricSchema(**asdict(dto))
