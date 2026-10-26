from fastapi import APIRouter, Depends

from apps.portfolio.adapter.inbound.api.schemas.stack_category_schema import (
    StackCategoryListSchema,
    StackCategorySchema,
)
from apps.portfolio.adapter.inbound.mappers.stack_category_mapper import to_schema
from apps.portfolio.app.ports.input.stack_category_use_case import StackCategoryUseCase
from apps.portfolio.dependencies.stack_category_dependencies import get_stack_category_use_case

router = APIRouter(prefix="/api/v1/stack-categories", tags=["stack-categories"])


@router.get("/myself", response_model=StackCategorySchema, response_model_by_alias=True)
def get_myself(use_case: StackCategoryUseCase = Depends(get_stack_category_use_case)):
    return to_schema(use_case.get_myself())


@router.get("", response_model=StackCategoryListSchema, response_model_by_alias=True)
def list_stack_categories(use_case: StackCategoryUseCase = Depends(get_stack_category_use_case)):
    return StackCategoryListSchema(items=[to_schema(d) for d in use_case.list_all()])
