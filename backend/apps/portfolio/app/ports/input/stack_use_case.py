from abc import ABC, abstractmethod

from apps.portfolio.app.dtos.stack_dto import StackDTO


class StackUseCase(ABC):
    @abstractmethod
    def get_myself(self) -> StackDTO: ...

    @abstractmethod
    def list_all(self) -> list[StackDTO]: ...
