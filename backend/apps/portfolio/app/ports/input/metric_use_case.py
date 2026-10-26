from abc import ABC, abstractmethod

from apps.portfolio.app.dtos.metric_dto import MetricDTO


class MetricUseCase(ABC):
    @abstractmethod
    def get_myself(self) -> MetricDTO: ...

    @abstractmethod
    def list_all(self) -> list[MetricDTO]: ...
