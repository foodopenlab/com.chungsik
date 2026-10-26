from abc import ABC, abstractmethod

from apps.portfolio.app.dtos.project_dto import ProjectDTO


class ProjectUseCase(ABC):
    @abstractmethod
    def get_myself(self) -> ProjectDTO: ...

    @abstractmethod
    def list_all(self) -> list[ProjectDTO]: ...
