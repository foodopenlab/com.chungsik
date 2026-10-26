from abc import ABC, abstractmethod

from apps.portfolio.app.dtos.education_dto import EducationDTO


class EducationUseCase(ABC):
    @abstractmethod
    def get_myself(self) -> EducationDTO: ...

    @abstractmethod
    def list_all(self) -> list[EducationDTO]: ...
