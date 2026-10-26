from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from core.matrix.grid_oracle_database_manager import Base


class MetricORM(Base):
    __tablename__ = "metric"
    __table_args__ = (
        CheckConstraint("side IN ('field', 'software')", name="ck_metric_side"),
        CheckConstraint("attribution IN ('personal', 'team')", name="ck_metric_attribution"),
    )

    id: Mapped[str] = mapped_column(String(48), primary_key=True)
    project_slug: Mapped[str | None] = mapped_column(ForeignKey("project.slug"))
    value: Mapped[str] = mapped_column(String(64))
    label: Mapped[str] = mapped_column(String(128))
    condition: Mapped[str] = mapped_column(Text)
    source: Mapped[str] = mapped_column(Text)
    side: Mapped[str] = mapped_column(String(16))
    attribution: Mapped[str] = mapped_column(String(16))
    sort_order: Mapped[int] = mapped_column(Integer)
