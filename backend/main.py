from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.portfolio.adapter.inbound.api.v1.education_router import router as education_router
from apps.portfolio.adapter.inbound.api.v1.metric_router import router as metric_router
from apps.portfolio.adapter.inbound.api.v1.profile_router import router as profile_router
from apps.portfolio.adapter.inbound.api.v1.project_router import router as project_router
from apps.portfolio.adapter.inbound.api.v1.project_stack_router import router as project_stack_router
from apps.portfolio.adapter.inbound.api.v1.stack_category_router import router as stack_category_router
from apps.portfolio.adapter.inbound.api.v1.stack_router import router as stack_router
from apps.portfolio.adapter.inbound.api.v1.term_router import router as term_router
from core.matrix.grid_keymaker_secret_manager import get_settings

app = FastAPI(title="com.chungsik")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins.split(","),
    allow_methods=["GET"],
)

app.include_router(profile_router)
app.include_router(stack_category_router)
app.include_router(stack_router)
app.include_router(project_router)
app.include_router(project_stack_router)
app.include_router(metric_router)
app.include_router(term_router)
app.include_router(education_router)
