from fastapi import APIRouter, Depends

from apps.portfolio.adapter.inbound.api.schemas.education_schema import EducationListSchema, EducationSchema
from apps.portfolio.adapter.inbound.mappers.education_mapper import to_schema
from apps.portfolio.app.ports.input.education_use_case import EducationUseCase
from apps.portfolio.dependencies.education_dependencies import get_education_use_case

router = APIRouter(prefix="/api/v1/educations", tags=["educations"])


@router.get("/myself", response_model=EducationSchema, response_model_by_alias=True)
def get_myself(use_case: EducationUseCase = Depends(get_education_use_case)):
    return to_schema(use_case.get_myself())


@router.get("", response_model=EducationListSchema, response_model_by_alias=True)
def list_educations(use_case: EducationUseCase = Depends(get_education_use_case)):
    return EducationListSchema(items=[to_schema(d) for d in use_case.list_all()])
