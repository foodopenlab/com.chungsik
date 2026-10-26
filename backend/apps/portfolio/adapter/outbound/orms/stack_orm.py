from sqlalchemy import CheckConstraint, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.matrix.grid_oracle_database_manager import Base


class StackORM(Base):
    __tablename__ = "stack"
    __table_args__ = (CheckConstraint("icon IS NOT NULL OR monogram IS NOT NULL", name="ck_stack_icon_or_monogram"),)

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    category_id: Mapped[str] = mapped_column(ForeignKey("stack_category.id"))
    label: Mapped[str] = mapped_column(String(64))
    icon: Mapped[str | None] = mapped_column(String(64))
    monogram: Mapped[str | None] = mapped_column(String(4))
    sort_order: Mapped[int] = mapped_column(Integer)
