from apps.portfolio.adapter.outbound.orms.project_orm import ProjectORM
from apps.portfolio.domain.entities.project_entity import ProjectEntity


def to_entity(orm: ProjectORM) -> ProjectEntity:
    return ProjectEntity(
        slug=orm.slug,
        title=orm.title,
        problem=orm.problem,
        decision=orm.decision,
        role=orm.role,
        team_role=orm.team_role,
        status=orm.status,
        award=orm.award,
        docs_url=orm.docs_url,
        github_url=orm.github_url,
        service_url=orm.service_url,
        sort_order=orm.sort_order,
    )
