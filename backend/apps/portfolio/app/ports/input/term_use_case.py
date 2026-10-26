from abc import ABC, abstractmethod

from apps.portfolio.app.dtos.term_dto import TermDTO


class TermUseCase(ABC):
    @abstractmethod
    def get_myself(self) -> TermDTO: ...

    @abstractmethod
    def list_all(self) -> list[TermDTO]: ...
