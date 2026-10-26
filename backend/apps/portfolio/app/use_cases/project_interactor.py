from dataclasses import asdict

from apps.portfolio.app.dtos.project_dto import ProjectDTO
from apps.portfolio.app.ports.input.project_use_case import ProjectUseCase
from apps.portfolio.app.ports.output.project_port import ProjectPort


class ProjectInteractor(ProjectUseCase):
    def __init__(self, port: ProjectPort):
        self._port = port

    def get_myself(self) -> ProjectDTO:
        return ProjectDTO(**asdict(self._port.find_myself()))

    def list_all(self) -> list[ProjectDTO]:
        return [ProjectDTO(**asdict(e)) for e in self._port.find_all()]
