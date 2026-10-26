from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class StackCategorySchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    label: str
    sort_order: int


class StackCategoryListSchema(BaseModel):
    items: list[StackCategorySchema]
