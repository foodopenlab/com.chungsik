from apps.portfolio.app.dtos.stack_category_dto import StackCategoryDTO
from apps.portfolio.app.ports.input.stack_category_use_case import StackCategoryUseCase
from apps.portfolio.app.ports.output.stack_category_port import StackCategoryPort
from apps.portfolio.domain.entities.stack_category_entity import StackCategoryEntity


def _to_dto(entity: StackCategoryEntity) -> StackCategoryDTO:
    return StackCategoryDTO(id=entity.id, label=entity.label, sort_order=entity.sort_order)


class StackCategoryInteractor(StackCategoryUseCase):
    def __init__(self, port: StackCategoryPort):
        self._port = port

    def get_myself(self) -> StackCategoryDTO:
        return _to_dto(self._port.find_myself())

    def list_all(self) -> list[StackCategoryDTO]:
        return [_to_dto(e) for e in self._port.find_all()]
