from apps.portfolio.adapter.outbound.orms.term_orm import TermORM
from apps.portfolio.domain.entities.term_entity import TermEntity


def to_entity(orm: TermORM) -> TermEntity:
    return TermEntity(id=orm.id, field=orm.field, dev=orm.dev, note=orm.note, sort_order=orm.sort_order)
