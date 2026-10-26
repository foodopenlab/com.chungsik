from fastapi import Depends
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.repositories.project_repository import ProjectRepository
from apps.portfolio.app.ports.input.project_use_case import ProjectUseCase
from apps.portfolio.app.use_cases.project_interactor import ProjectInteractor
from core.matrix.grid_oracle_database_manager import get_session


def get_project_use_case(session: Session = Depends(get_session)) -> ProjectUseCase:
    return ProjectInteractor(ProjectRepository(session))
