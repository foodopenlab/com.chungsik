from fastapi import APIRouter, Depends

from apps.portfolio.adapter.inbound.api.schemas.project_schema import ProjectListSchema, ProjectSchema
from apps.portfolio.adapter.inbound.mappers.project_mapper import to_schema
from apps.portfolio.app.ports.input.project_use_case import ProjectUseCase
from apps.portfolio.dependencies.project_dependencies import get_project_use_case

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


@router.get("/myself", response_model=ProjectSchema, response_model_by_alias=True)
def get_myself(use_case: ProjectUseCase = Depends(get_project_use_case)):
    return to_schema(use_case.get_myself())


@router.get("", response_model=ProjectListSchema, response_model_by_alias=True)
def list_projects(use_case: ProjectUseCase = Depends(get_project_use_case)):
    return ProjectListSchema(items=[to_schema(d) for d in use_case.list_all()])
