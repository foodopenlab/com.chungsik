from apps.portfolio.app.dtos.stack_dto import StackDTO
from apps.portfolio.app.ports.input.stack_use_case import StackUseCase
from apps.portfolio.app.ports.output.stack_port import StackPort
from apps.portfolio.domain.entities.stack_entity import StackEntity


def _to_dto(entity: StackEntity) -> StackDTO:
    return StackDTO(
        id=entity.id,
        category_id=entity.category_id,
        label=entity.label,
        icon=entity.icon,
        monogram=entity.monogram,
        sort_order=entity.sort_order,
    )


class StackInteractor(StackUseCase):
    def __init__(self, port: StackPort):
        self._port = port

    def get_myself(self) -> StackDTO:
        return _to_dto(self._port.find_myself())

    def list_all(self) -> list[StackDTO]:
        return [_to_dto(e) for e in self._port.find_all()]
