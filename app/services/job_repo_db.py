from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import and_, or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.db_models import JobRow
from app.domain.job import Job


def jobrow_from_domain(j: Job) -> dict:
    return {
        "uid": j.uid,
        "source": j.source,
        "source_job_id": j.source_job_id,
        "title": j.title,
        "company": j.company,
        "location": j.location,
        "url": j.url,
        "posted_at": j.posted_at,
    }


def domain_from_jobrow(r: JobRow) -> Job:
    return Job(
        source=r.source,
        source_job_id=r.source_job_id,
        title=r.title,
        company=r.company,
        location=r.location,
        url=r.url,
        posted_at=r.posted_at,
    )


def upsert_many(db: Session, jobs: List[Job]) -> int:
    """
    PostgreSQL upsert using ON CONFLICT.
    Returns count of rows affected (roughly); for exact "inserted only" we'd do more work.
    """
    if not jobs:
        return 0

    rows = [jobrow_from_domain(j) for j in jobs]

    stmt = insert(JobRow).values(rows)

    update_cols = {
        "source": stmt.excluded.source,
        "source_job_id": stmt.excluded.source_job_id,
        "title": stmt.excluded.title,
        "company": stmt.excluded.company,
        "location": stmt.excluded.location,
        "url": stmt.excluded.url,
        "posted_at": stmt.excluded.posted_at,
    }

    stmt = stmt.on_conflict_do_update(
        index_elements=[JobRow.uid],
        set_=update_cols,
    )

    res = db.execute(stmt)
    db.commit()
    return res.rowcount or 0


def list_jobs(db: Session, limit: int = 50) -> List[Job]:
    stmt = (
        select(JobRow)
        .order_by(JobRow.posted_at.desc().nullslast(), JobRow.created_at.desc())
        .limit(limit)
    )
    rows = db.execute(stmt).scalars().all()
    return [domain_from_jobrow(r) for r in rows]


def search_jobs(
    db: Session,
    *,
    q: Optional[str] = None,
    source: Optional[str] = None,
    location: Optional[str] = None,
    posted_after: Optional[date] = None,
    limit: int = 50,
) -> List[Job]:
    def norm(s: Optional[str]) -> str:
        return (s or "").strip()

    q_tokens = [t for t in norm(q).lower().split() if t]
    source_norm = norm(source).lower() if source else None
    loc_norm = norm(location).lower() if location else None

    filters = []

    if source_norm:
        filters.append(JobRow.source.ilike(source_norm))

    if posted_after:
        # date granularity: posted_at >= posted_after 00:00:00
        start_dt = datetime.combine(posted_after, datetime.min.time())
        filters.append(JobRow.posted_at.is_not(None))
        filters.append(JobRow.posted_at >= start_dt)

    if loc_norm:
        filters.append(JobRow.location.is_not(None))
        filters.append(JobRow.location.ilike(f"%{loc_norm}%"))

    # q token AND across title/company/location
    for tok in q_tokens:
        filters.append(
            or_(
                JobRow.title.ilike(f"%{tok}%"),
                JobRow.company.ilike(f"%{tok}%"),
                JobRow.location.ilike(f"%{tok}%"),
            )
        )

    stmt = select(JobRow)
    if filters:
        stmt = stmt.where(and_(*filters))

    stmt = stmt.order_by(JobRow.posted_at.desc().nullslast(),
                         JobRow.created_at.desc()).limit(limit)

    rows = db.execute(stmt).scalars().all()
    return [domain_from_jobrow(r) for r in rows]
