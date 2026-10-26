from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from core.matrix.grid_oracle_database_manager import Base


class ProjectStackORM(Base):
    __tablename__ = "project_stack"

    project_slug: Mapped[str] = mapped_column(ForeignKey("project.slug"), primary_key=True)
    stack_id: Mapped[str] = mapped_column(ForeignKey("stack.id"), primary_key=True)
