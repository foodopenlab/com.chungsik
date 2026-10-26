from fastapi import Depends
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.repositories.project_stack_repository import ProjectStackRepository
from apps.portfolio.app.ports.input.project_stack_use_case import ProjectStackUseCase
from apps.portfolio.app.use_cases.project_stack_interactor import ProjectStackInteractor
from core.matrix.grid_oracle_database_manager import get_session


def get_project_stack_use_case(session: Session = Depends(get_session)) -> ProjectStackUseCase:
    return ProjectStackInteractor(ProjectStackRepository(session))
