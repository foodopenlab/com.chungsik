from abc import ABC, abstractmethod

from apps.portfolio.domain.entities.project_stack_entity import ProjectStackEntity


class ProjectStackPort(ABC):
    @abstractmethod
    def find_myself(self) -> ProjectStackEntity: ...

    @abstractmethod
    def find_all(self) -> list[ProjectStackEntity]: ...
