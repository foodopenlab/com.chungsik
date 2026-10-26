from dataclasses import asdict

from apps.portfolio.app.dtos.education_dto import EducationDTO
from apps.portfolio.app.ports.input.education_use_case import EducationUseCase
from apps.portfolio.app.ports.output.education_port import EducationPort


class EducationInteractor(EducationUseCase):
    def __init__(self, port: EducationPort):
        self._port = port

    def get_myself(self) -> EducationDTO:
        return EducationDTO(**asdict(self._port.find_myself()))

    def list_all(self) -> list[EducationDTO]:
        return [EducationDTO(**asdict(e)) for e in self._port.find_all()]
