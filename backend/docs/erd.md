# ERD — apps/portfolio

> 출처: `docs/portfolio-work-order-v2.md` §3-5 데이터 파일(stack·projects·dict·numbers)을 테이블로 옮긴 설계.
> **구현됨**은 마이그레이션·11파일 세트가 있는 테이블, **초안**은 해당 섹션 작업 때 확정한다.

```
profile ─┬─< project ─┬─< project_stack >── stack >── stack_category
         │            └─< metric
         ├─< metric
         └─< term
```

| 테이블 | 상태 | 컬럼 | 관계 |
|---|---|---|---|
| `stack_category` | 구현됨 | id(PK, 슬러그), label, sort_order | 1:N stack |
| `stack` | 구현됨 | id(PK, 슬러그), category_id(FK), label, icon?, monogram?, sort_order — `icon`·`monogram` 중 하나는 필수(CHECK) | N:1 stack_category, 1:N project_stack |
| `profile` | 초안 | id, name, headline, subtitle | 사이트 주인. project·metric·term의 루트 |
| `project` | 초안 | slug(PK), profile_id(FK), title, problem, decision, role, team_role, status, docs_url, github_url, service_url, sort_order | 1:N project_stack, 1:N metric |
| `project_stack` | 초안 | project_slug(FK), stack_id(FK) — 복합 PK | 04 BUILT 타일 점등(N:M 해소) |
| `metric` | 초안 | id, profile_id(FK), project_slug(FK?), value, condition, source | 화면 숫자의 단일 원천(지시서 `numbers.ts`). 경력 숫자는 project 없이 profile에만 연결 |
| `term` | 초안 | id, profile_id(FK), field, dev, note, sort_order | 05 DICT 사전 20쌍 |

**정규화 메모**
- 카테고리 라벨은 카테고리에만 종속 → `stack_category`로 분리(3NF).
- 프로젝트–스택은 N:M → `project_stack` 조인 테이블.
- `profile`은 행이 1개뿐이지만, 사전·경력 숫자가 고립 테이블이 되지 않도록(§13 연결 원칙) 루트로 둔다.
