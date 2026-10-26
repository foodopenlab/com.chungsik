from fastapi import Depends
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.repositories.profile_repository import ProfileRepository
from apps.portfolio.app.ports.input.profile_use_case import ProfileUseCase
from apps.portfolio.app.use_cases.profile_interactor import ProfileInteractor
from core.matrix.grid_oracle_database_manager import get_session


def get_profile_use_case(session: Session = Depends(get_session)) -> ProfileUseCase:
    return ProfileInteractor(ProfileRepository(session))
