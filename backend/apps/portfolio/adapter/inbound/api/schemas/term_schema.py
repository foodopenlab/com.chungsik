from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class TermSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: int
    field: str
    dev: str
    note: str | None
    sort_order: int


class TermListSchema(BaseModel):
    items: list[TermSchema]
