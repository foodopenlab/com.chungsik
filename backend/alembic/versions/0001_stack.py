"""stack_category, stack 테이블 + 03 STACK 시드

Revision ID: 0001
Revises:
"""
import sqlalchemy as sa
from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

CATEGORIES = [
    ("frontend", "프론트엔드·웹 화면"),
    ("backend", "백엔드·API와 수집"),
    ("data-ai", "데이터·AI"),
    ("infra", "인프라·배포"),
    ("quality", "테스트·품질"),
    ("ai-tools", "AI 개발 도구"),
]

# (id, category_id, label, icon, monogram) — 아이콘은 simple-icons 우선, 없으면 모노그램
STACKS = [
    ("nextjs", "frontend", "Next.js", "simple-icons:nextdotjs", None),
    ("react", "frontend", "React", "simple-icons:react", None),
    ("typescript", "frontend", "TypeScript", "simple-icons:typescript", None),
    ("tailwind", "frontend", "Tailwind CSS", "simple-icons:tailwindcss", None),
    ("maplibre", "frontend", "MapLibre GL", "simple-icons:maplibre", None),
    ("tanstack-query", "frontend", "TanStack Query", "simple-icons:reactquery", None),
    ("flutter", "frontend", "Flutter", "simple-icons:flutter", None),
    ("python", "backend", "Python", "simple-icons:python", None),
    ("fastapi", "backend", "FastAPI", "simple-icons:fastapi", None),
    ("sqlalchemy", "backend", "SQLAlchemy", "simple-icons:sqlalchemy", None),
    ("pydantic", "backend", "Pydantic", "simple-icons:pydantic", None),
    ("alembic", "backend", "Alembic", None, "ALB"),
    ("sse", "backend", "SSE", None, "SSE"),
    ("postgresql", "data-ai", "PostgreSQL", "simple-icons:postgresql", None),
    ("pgvector", "data-ai", "pgvector", None, "pgv"),
    ("ollama", "data-ai", "Ollama", "simple-icons:ollama", None),
    ("bge-m3", "data-ai", "bge-m3", None, "bge"),
    ("gemini", "data-ai", "Gemini", "simple-icons:googlegemini", None),
    ("claude", "data-ai", "Claude", "simple-icons:claude", None),
    ("exaone", "data-ai", "EXAONE", None, "EXA"),
    ("gemma", "data-ai", "Gemma", None, "GMA"),
    ("qwen", "data-ai", "Qwen", "simple-icons:qwen", None),
    ("kanana", "data-ai", "kanana", None, "KNN"),
    ("xgboost", "data-ai", "XGBoost", None, "XGB"),
    ("prophet", "data-ai", "Prophet", None, "PRO"),
    ("scikit-learn", "data-ai", "scikit-learn", "simple-icons:scikitlearn", None),
    ("aws", "infra", "AWS", "simple-icons:amazonaws", None),
    ("kubernetes", "infra", "Kubernetes", "simple-icons:kubernetes", None),
    ("docker", "infra", "Docker", "simple-icons:docker", None),
    ("terraform", "infra", "Terraform", "simple-icons:terraform", None),
    ("argo-cd", "infra", "Argo CD", "simple-icons:argo", None),
    ("github-actions", "infra", "GitHub Actions", "simple-icons:githubactions", None),
    ("vercel", "infra", "Vercel", "simple-icons:vercel", None),
    ("linux", "infra", "Linux", "simple-icons:linux", None),
    ("pytest", "quality", "pytest", "simple-icons:pytest", None),
    ("vitest", "quality", "Vitest", "simple-icons:vitest", None),
    ("k6", "quality", "k6", "simple-icons:k6", None),
    ("playwright", "quality", "Playwright", "simple-icons:playwright", None),
    ("claude-code", "ai-tools", "Claude Code", "simple-icons:anthropic", None),
    ("codex", "ai-tools", "Codex", "simple-icons:openai", None),
    ("github", "ai-tools", "GitHub", "simple-icons:github", None),
]


def upgrade() -> None:
    category = op.create_table(
        "stack_category",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("label", sa.String(64), nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    stack = op.create_table(
        "stack",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("category_id", sa.String(32), sa.ForeignKey("stack_category.id"), nullable=False),
        sa.Column("label", sa.String(64), nullable=False),
        sa.Column("icon", sa.String(64)),
        sa.Column("monogram", sa.String(4)),
        sa.Column("sort_order", sa.Integer, nullable=False),
        sa.CheckConstraint("icon IS NOT NULL OR monogram IS NOT NULL", name="ck_stack_icon_or_monogram"),
    )
    op.bulk_insert(category, [
        {"id": cid, "label": label, "sort_order": i} for i, (cid, label) in enumerate(CATEGORIES, 1)
    ])
    op.bulk_insert(stack, [
        {"id": sid, "category_id": cid, "label": label, "icon": icon, "monogram": mono, "sort_order": i}
        for i, (sid, cid, label, icon, mono) in enumerate(STACKS, 1)
    ])


def downgrade() -> None:
    op.drop_table("stack")
    op.drop_table("stack_category")
