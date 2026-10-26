from abc import ABC, abstractmethod

from apps.portfolio.app.dtos.profile_dto import ProfileDTO


class ProfileUseCase(ABC):
    @abstractmethod
    def get_myself(self) -> ProfileDTO: ...

    @abstractmethod
    def list_all(self) -> list[ProfileDTO]: ...
