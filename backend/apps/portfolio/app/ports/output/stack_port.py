from abc import ABC, abstractmethod

from apps.portfolio.domain.entities.stack_entity import StackEntity


class StackPort(ABC):
    @abstractmethod
    def find_myself(self) -> StackEntity: ...

    @abstractmethod
    def find_all(self) -> list[StackEntity]: ...
