from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.matrix.grid_oracle_database_manager import Base


class ProfileORM(Base):
    __tablename__ = "profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(32))
    headline: Mapped[str] = mapped_column(String(128))
    subtitle: Mapped[str] = mapped_column(String(255))
