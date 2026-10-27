from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from core.matrix.grid_oracle_database_manager import Base


class ProjectORM(Base):
    __tablename__ = "project"

    slug: Mapped[str] = mapped_column(String(32), primary_key=True)
    title: Mapped[str] = mapped_column(String(64))
    problem: Mapped[str] = mapped_column(Text)
    decision: Mapped[str] = mapped_column(Text)
    role: Mapped[str] = mapped_column(Text)
    team_role: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32))
    award: Mapped[str | None] = mapped_column(String(64))
    docs_url: Mapped[str | None] = mapped_column(String(255))
    github_url: Mapped[str | None] = mapped_column(String(255))
    service_url: Mapped[str | None] = mapped_column(String(255))
    sort_order: Mapped[int] = mapped_column(Integer)
