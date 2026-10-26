from fastapi import Depends
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.repositories.term_repository import TermRepository
from apps.portfolio.app.ports.input.term_use_case import TermUseCase
from apps.portfolio.app.use_cases.term_interactor import TermInteractor
from core.matrix.grid_oracle_database_manager import get_session


def get_term_use_case(session: Session = Depends(get_session)) -> TermUseCase:
    return TermInteractor(TermRepository(session))
