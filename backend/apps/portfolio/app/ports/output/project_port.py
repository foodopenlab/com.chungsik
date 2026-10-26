from abc import ABC, abstractmethod

from apps.portfolio.domain.entities.project_entity import ProjectEntity


class ProjectPort(ABC):
    @abstractmethod
    def find_myself(self) -> ProjectEntity: ...

    @abstractmethod
    def find_all(self) -> list[ProjectEntity]: ...
