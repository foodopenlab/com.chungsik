from apps.portfolio.app.dtos.term_dto import TermDTO
from apps.portfolio.app.ports.input.term_use_case import TermUseCase
from apps.portfolio.app.ports.output.term_port import TermPort
from apps.portfolio.domain.entities.term_entity import TermEntity


def _to_dto(entity: TermEntity) -> TermDTO:
    return TermDTO(id=entity.id, field=entity.field, dev=entity.dev, note=entity.note, sort_order=entity.sort_order)


class TermInteractor(TermUseCase):
    def __init__(self, port: TermPort):
        self._port = port

    def get_myself(self) -> TermDTO:
        return _to_dto(self._port.find_myself())

    def list_all(self) -> list[TermDTO]:
        return [_to_dto(e) for e in self._port.find_all()]
