from fastapi import Depends
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.repositories.stack_category_repository import StackCategoryRepository
from apps.portfolio.app.ports.input.stack_category_use_case import StackCategoryUseCase
from apps.portfolio.app.use_cases.stack_category_interactor import StackCategoryInteractor
from core.matrix.grid_oracle_database_manager import get_session


def get_stack_category_use_case(session: Session = Depends(get_session)) -> StackCategoryUseCase:
    return StackCategoryInteractor(StackCategoryRepository(session))
