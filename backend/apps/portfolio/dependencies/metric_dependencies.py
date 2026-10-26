from fastapi import Depends
from sqlalchemy.orm import Session

from apps.portfolio.adapter.outbound.repositories.metric_repository import MetricRepository
from apps.portfolio.app.ports.input.metric_use_case import MetricUseCase
from apps.portfolio.app.use_cases.metric_interactor import MetricInteractor
from core.matrix.grid_oracle_database_manager import get_session


def get_metric_use_case(session: Session = Depends(get_session)) -> MetricUseCase:
    return MetricInteractor(MetricRepository(session))
