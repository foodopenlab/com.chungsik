from abc import ABC, abstractmethod

from apps.portfolio.domain.entities.term_entity import TermEntity


class TermPort(ABC):
    @abstractmethod
    def find_myself(self) -> TermEntity: ...

    @abstractmethod
    def find_all(self) -> list[TermEntity]: ...
