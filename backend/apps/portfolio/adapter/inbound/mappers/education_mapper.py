from dataclasses import asdict

from apps.portfolio.adapter.inbound.api.schemas.education_schema import EducationSchema
from apps.portfolio.app.dtos.education_dto import EducationDTO


def to_schema(dto: EducationDTO) -> EducationSchema:
    return EducationSchema(**asdict(dto))
