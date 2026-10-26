from dataclasses import asdict

from apps.portfolio.app.dtos.metric_dto import MetricDTO
from apps.portfolio.app.ports.input.metric_use_case import MetricUseCase
from apps.portfolio.app.ports.output.metric_port import MetricPort


class MetricInteractor(MetricUseCase):
    def __init__(self, port: MetricPort):
        self._port = port

    def get_myself(self) -> MetricDTO:
        return MetricDTO(**asdict(self._port.find_myself()))

    def list_all(self) -> list[MetricDTO]:
        return [MetricDTO(**asdict(e)) for e in self._port.find_all()]
