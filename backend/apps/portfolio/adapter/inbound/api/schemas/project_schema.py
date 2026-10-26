from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ProjectSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    slug: str
    title: str
    problem: str
    decision: str
    role: str
    team_role: str
    status: str
    docs_url: str | None
    github_url: str | None
    service_url: str | None
    sort_order: int


class ProjectListSchema(BaseModel):
    items: list[ProjectSchema]
