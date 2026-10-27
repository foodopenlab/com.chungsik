from datetime import date

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class EducationSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: int
    title: str
    organization: str
    description: str
    started_on: date
    ended_on: date
    status: str
    award: str | None
    sort_order: int


class EducationListSchema(BaseModel):
    items: list[EducationSchema]
