from apps.portfolio.app.dtos.project_stack_dto import ProjectStackDTO
from apps.portfolio.app.ports.input.project_stack_use_case import ProjectStackUseCase
from apps.portfolio.app.ports.output.project_stack_port import ProjectStackPort
from apps.portfolio.domain.entities.project_stack_entity import ProjectStackEntity


def _to_dto(entity: ProjectStackEntity) -> ProjectStackDTO:
    return ProjectStackDTO(project_slug=entity.project_slug, stack_id=entity.stack_id)


class ProjectStackInteractor(ProjectStackUseCase):
    def __init__(self, port: ProjectStackPort):
        self._port = port

    def get_myself(self) -> ProjectStackDTO:
        return _to_dto(self._port.find_myself())

    def list_all(self) -> list[ProjectStackDTO]:
        return [_to_dto(e) for e in self._port.find_all()]
