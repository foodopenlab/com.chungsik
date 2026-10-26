from abc import ABC, abstractmethod

from apps.portfolio.app.dtos.stack_category_dto import StackCategoryDTO


class StackCategoryUseCase(ABC):
    @abstractmethod
    def get_myself(self) -> StackCategoryDTO: ...

    @abstractmethod
    def list_all(self) -> list[StackCategoryDTO]: ...
