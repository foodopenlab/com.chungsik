from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ProjectStackSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    project_slug: str
    stack_id: str


class ProjectStackListSchema(BaseModel):
    items: list[ProjectStackSchema]
