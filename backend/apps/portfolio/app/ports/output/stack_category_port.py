from abc import ABC, abstractmethod

from apps.portfolio.domain.entities.stack_category_entity import StackCategoryEntity


class StackCategoryPort(ABC):
    @abstractmethod
    def find_myself(self) -> StackCategoryEntity: ...

    @abstractmethod
    def find_all(self) -> list[StackCategoryEntity]: ...
