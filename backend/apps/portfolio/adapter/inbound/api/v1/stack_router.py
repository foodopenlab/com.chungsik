from fastapi import APIRouter, Depends

from apps.portfolio.adapter.inbound.api.schemas.stack_schema import StackListSchema, StackSchema
from apps.portfolio.adapter.inbound.mappers.stack_mapper import to_schema
from apps.portfolio.app.ports.input.stack_use_case import StackUseCase
from apps.portfolio.dependencies.stack_dependencies import get_stack_use_case

router = APIRouter(prefix="/api/v1/stacks", tags=["stacks"])


@router.get("/myself", response_model=StackSchema, response_model_by_alias=True)
def get_myself(use_case: StackUseCase = Depends(get_stack_use_case)):
    return to_schema(use_case.get_myself())


@router.get("", response_model=StackListSchema, response_model_by_alias=True)
def list_stacks(use_case: StackUseCase = Depends(get_stack_use_case)):
    return StackListSchema(items=[to_schema(d) for d in use_case.list_all()])
