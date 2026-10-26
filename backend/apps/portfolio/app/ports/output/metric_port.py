from abc import ABC, abstractmethod

from apps.portfolio.domain.entities.metric_entity import MetricEntity


class MetricPort(ABC):
    @abstractmethod
    def find_myself(self) -> MetricEntity: ...

    @abstractmethod
    def find_all(self) -> list[MetricEntity]: ...
