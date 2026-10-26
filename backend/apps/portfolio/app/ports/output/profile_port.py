from abc import ABC, abstractmethod

from apps.portfolio.domain.entities.profile_entity import ProfileEntity


class ProfilePort(ABC):
    @abstractmethod
    def find_myself(self) -> ProfileEntity: ...

    @abstractmethod
    def find_all(self) -> list[ProfileEntity]: ...
