from abc import ABC, abstractmethod

from apps.portfolio.app.dtos.project_stack_dto import ProjectStackDTO


class ProjectStackUseCase(ABC):
    @abstractmethod
    def get_myself(self) -> ProjectStackDTO: ...

    @abstractmethod
    def list_all(self) -> list[ProjectStackDTO]: ...
