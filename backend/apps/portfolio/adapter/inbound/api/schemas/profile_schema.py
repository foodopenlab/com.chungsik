from pydantic import BaseModel


class ProfileSchema(BaseModel):
    id: int
    name: str
    headline: str
    subtitle: str


class ProfileListSchema(BaseModel):
    items: list[ProfileSchema]
