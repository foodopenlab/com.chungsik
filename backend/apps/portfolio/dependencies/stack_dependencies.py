from fastapi import Depends
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.repositories.stack_repository import StackRepository
from apps.portfolio.app.ports.input.stack_use_case import StackUseCase
from apps.portfolio.app.use_cases.stack_interactor import StackInteractor
from core.matrix.grid_oracle_database_manager import get_session


def get_stack_use_case(session: Session = Depends(get_session)) -> StackUseCase:
    return StackInteractor(StackRepository(session))
