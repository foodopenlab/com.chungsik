from fastapi import APIRouter, Depends

from apps.portfolio.adapter.inbound.api.schemas.profile_schema import ProfileListSchema, ProfileSchema
from apps.portfolio.adapter.inbound.mappers.profile_mapper import to_schema
from apps.portfolio.app.ports.input.profile_use_case import ProfileUseCase
from apps.portfolio.dependencies.profile_dependencies import get_profile_use_case

router = APIRouter(prefix="/api/v1/profiles", tags=["profiles"])


@router.get("/myself", response_model=ProfileSchema)
def get_myself(use_case: ProfileUseCase = Depends(get_profile_use_case)):
    return to_schema(use_case.get_myself())


@router.get("", response_model=ProfileListSchema)
def list_profiles(use_case: ProfileUseCase = Depends(get_profile_use_case)):
    return ProfileListSchema(items=[to_schema(d) for d in use_case.list_all()])
