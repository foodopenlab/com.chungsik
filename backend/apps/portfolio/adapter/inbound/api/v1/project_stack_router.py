from fastapi import APIRouter, Depends

from apps.portfolio.adapter.inbound.api.schemas.project_stack_schema import (
    ProjectStackListSchema,
    ProjectStackSchema,
)
from apps.portfolio.adapter.inbound.mappers.project_stack_mapper import to_schema
from apps.portfolio.app.ports.input.project_stack_use_case import ProjectStackUseCase
from apps.portfolio.dependencies.project_stack_dependencies import get_project_stack_use_case

router = APIRouter(prefix="/api/v1/project-stacks", tags=["project-stacks"])


@router.get("/myself", response_model=ProjectStackSchema, response_model_by_alias=True)
def get_myself(use_case: ProjectStackUseCase = Depends(get_project_stack_use_case)):
    return to_schema(use_case.get_myself())


@router.get("", response_model=ProjectStackListSchema, response_model_by_alias=True)
def list_project_stacks(use_case: ProjectStackUseCase = Depends(get_project_stack_use_case)):
    return ProjectStackListSchema(items=[to_schema(d) for d in use_case.list_all()])
