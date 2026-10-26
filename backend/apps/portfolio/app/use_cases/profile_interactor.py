from apps.portfolio.app.dtos.profile_dto import ProfileDTO
from apps.portfolio.app.ports.input.profile_use_case import ProfileUseCase
from apps.portfolio.app.ports.output.profile_port import ProfilePort
from apps.portfolio.domain.entities.profile_entity import ProfileEntity


def _to_dto(entity: ProfileEntity) -> ProfileDTO:
    return ProfileDTO(id=entity.id, name=entity.name, headline=entity.headline, subtitle=entity.subtitle)


class ProfileInteractor(ProfileUseCase):
    def __init__(self, port: ProfilePort):
        self._port = port

    def get_myself(self) -> ProfileDTO:
        return _to_dto(self._port.find_myself())

    def list_all(self) -> list[ProfileDTO]:
        return [_to_dto(e) for e in self._port.find_all()]
