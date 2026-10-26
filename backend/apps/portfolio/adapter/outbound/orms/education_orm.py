from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from core.matrix.grid_oracle_database_manager import Base


class EducationORM(Base):
    __tablename__ = "education"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"))
    title: Mapped[str] = mapped_column(String(128))
    organization: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(Text)
    started_on: Mapped[date] = mapped_column(Date)
    ended_on: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(16))
    sort_order: Mapped[int] = mapped_column(Integer)
