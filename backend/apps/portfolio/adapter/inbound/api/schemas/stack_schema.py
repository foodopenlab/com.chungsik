from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class StackSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    category_id: str
    label: str
    icon: str | None
    monogram: str | None
    sort_order: int


class StackListSchema(BaseModel):
    items: list[StackSchema]
