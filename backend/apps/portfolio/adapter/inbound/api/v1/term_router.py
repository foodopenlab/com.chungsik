from fastapi import APIRouter, Depends

from apps.portfolio.adapter.inbound.api.schemas.term_schema import TermListSchema, TermSchema
from apps.portfolio.adapter.inbound.mappers.term_mapper import to_schema
from apps.portfolio.app.ports.input.term_use_case import TermUseCase
from apps.portfolio.dependencies.term_dependencies import get_term_use_case

router = APIRouter(prefix="/api/v1/terms", tags=["terms"])


@router.get("/myself", response_model=TermSchema, response_model_by_alias=True)
def get_myself(use_case: TermUseCase = Depends(get_term_use_case)):
    return to_schema(use_case.get_myself())


@router.get("", response_model=TermListSchema, response_model_by_alias=True)
def list_terms(use_case: TermUseCase = Depends(get_term_use_case)):
    return TermListSchema(items=[to_schema(d) for d in use_case.list_all()])
