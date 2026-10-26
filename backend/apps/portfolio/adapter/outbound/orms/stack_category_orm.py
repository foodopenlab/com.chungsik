from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.matrix.grid_oracle_database_manager import Base


class StackCategoryORM(Base):
    __tablename__ = "stack_category"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    label: Mapped[str] = mapped_column(String(64))
    sort_order: Mapped[int] = mapped_column(Integer)
