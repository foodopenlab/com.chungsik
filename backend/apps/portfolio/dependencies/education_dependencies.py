from fastapi import Depends
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.repositories.education_repository import EducationRepository
from apps.portfolio.app.ports.input.education_use_case import EducationUseCase
from apps.portfolio.app.use_cases.education_interactor import EducationInteractor
from core.matrix.grid_oracle_database_manager import get_session


def get_education_use_case(session: Session = Depends(get_session)) -> EducationUseCase:
    return EducationInteractor(EducationRepository(session))
