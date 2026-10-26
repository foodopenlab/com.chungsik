"""05 DICT 사전 20쌍 — 본인 검수 초안(docs/dict-draft.md) 반영, 01 GAP용 앞 6쌍 재배치

Revision ID: 0008
Revises: 0007

frontend mock 픽스처와 같은 내용.
"""
import sqlalchemy as sa
from alembic import op

revision = "0008"
down_revision = "0007"
branch_labels = None
depends_on = None

# (field, dev, note)
TERMS = [
    [
        "라인이 자주 서요",
        "downtime_event + 정지사유 코드(작업자가 실제로 입력할 3개만)",
        None
    ],
    [
        "다시 안 나게 해 주세요",
        "원인별 관리기준 = 재발 방지 규칙 + 회귀 테스트",
        "김치 공장 클레임 원인별 관리기준 재설계"
    ],
    [
        "CCP 한계기준",
        "validation rule + alert threshold",
        None
    ],
    [
        "한도견본",
        "입고 검수 기준 데이터셋",
        None
    ],
    [
        "작업일지",
        "이벤트 로그 스키마",
        None
    ],
    [
        "선입선출",
        "FIFO 큐",
        "원부재료 재고 운영"
    ],
    [
        "Audit 연 80회",
        "평가셋 + 재현 가능한 검증",
        None
    ],
    [
        "클레임 유형 분류표",
        "라벨 체계(taxonomy) + 다빈도 집계 쿼리",
        "김치 공장 클레임 재분류(유형·공정·원료·계절)"
    ],
    [
        "절임 조건표",
        "조건부 파라미터 테이블(feature → setpoint)",
        "배추 품종·계절·날씨별 절임조건 데이터화"
    ],
    [
        "염도 편차 관리",
        "허용 오차(tolerance) + 이탈 알림",
        "절임염도 편차 관리"
    ],
    [
        "금속검출기 테스트피스 점검",
        "정기 회귀 테스트 — 테스트피스가 테스트 케이스",
        "금속검출기 검증 체계"
    ],
    [
        "표시사항 검토",
        "규칙 기반 검사 + 근거 조문 검색(RAG)",
        "표시사항 검토 표준화"
    ],
    [
        "로트 추적",
        "추적 ID(trace id) + 이력 테이블 조인",
        "HACCP 이력 관리"
    ],
    [
        "원료 수불부",
        "입고·출고 이벤트의 합(이벤트 소싱)",
        "원부재료 재고·구매"
    ],
    [
        "개선조치 기록",
        "인시던트 리포트(포스트모템)",
        "CCP 이탈 시 개선조치"
    ],
    [
        "병목 공정",
        "처리량을 막는 한 지점 — 한 변수씩 바꾸고 재측정",
        "반자동화 라인 ↔ Metabole 부하 테스트"
    ],
    [
        "일 생산능력",
        "처리량(throughput)",
        "톤/일 ↔ RPS"
    ],
    [
        "HACCP 재인증",
        "배포 전 릴리스 게이트",
        "공장 이전 후 재인증"
    ],
    [
        "설비 배치도",
        "아키텍처 다이어그램 + 마이그레이션 계획",
        "공장 이전 설비 Layout 설계"
    ],
    [
        "SKU별 원가",
        "제품 단위 비용 집계 모델",
        "SKU 원가·손익 관리"
    ]
]

term = sa.table(
    "term", sa.column("id"), sa.column("profile_id"), sa.column("field"), sa.column("dev"), sa.column("note"), sa.column("sort_order"),
)


def upgrade() -> None:
    op.execute("DELETE FROM term")
    op.bulk_insert(term, [
        {"id": i, "profile_id": 1, "field": f, "dev": d, "note": n, "sort_order": i}
        for i, (f, d, n) in enumerate(TERMS, 1)
    ])


# 0002의 원래 5쌍 순서
ORIGINAL = ["CCP 한계기준", "한도견본", "Audit 연 80회", "작업일지", "라인이 자주 서요"]


def downgrade() -> None:
    op.execute("DELETE FROM term")
    by_field = {f: d for f, d, _ in TERMS}
    op.bulk_insert(term, [
        {"id": i, "profile_id": 1, "field": f, "dev": by_field[f], "note": None, "sort_order": i}
        for i, f in enumerate(ORIGINAL, 1)
    ])
