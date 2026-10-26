from abc import ABC, abstractmethod

from apps.portfolio.domain.entities.education_entity import EducationEntity


class EducationPort(ABC):
    @abstractmethod
    def find_myself(self) -> EducationEntity: ...

    @abstractmethod
    def find_all(self) -> list[EducationEntity]: ...
