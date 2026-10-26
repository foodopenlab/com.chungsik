from fastapi import APIRouter, Depends

from apps.portfolio.adapter.inbound.api.schemas.metric_schema import MetricListSchema, MetricSchema
from apps.portfolio.adapter.inbound.mappers.metric_mapper import to_schema
from apps.portfolio.app.ports.input.metric_use_case import MetricUseCase
from apps.portfolio.dependencies.metric_dependencies import get_metric_use_case

router = APIRouter(prefix="/api/v1/metrics", tags=["metrics"])


@router.get("/myself", response_model=MetricSchema, response_model_by_alias=True)
def get_myself(use_case: MetricUseCase = Depends(get_metric_use_case)):
    return to_schema(use_case.get_myself())


@router.get("", response_model=MetricListSchema, response_model_by_alias=True)
def list_metrics(use_case: MetricUseCase = Depends(get_metric_use_case)):
    return MetricListSchema(items=[to_schema(d) for d in use_case.list_all()])
