from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class MetricSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    project_slug: str | None
    value: str
    label: str
    condition: str
    source: str
    side: Literal["field", "software"]
    attribution: Literal["personal", "team"]
    sort_order: int


class MetricListSchema(BaseModel):
    items: list[MetricSchema]
