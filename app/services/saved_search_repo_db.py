from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session
from sqlalchemy import func, select

from app.db_models import SavedSearchRow, SeenJobRow
from app.services.job_repo_db import search_jobs as db_search_jobs


def upsert_saved_search(
    db: Session,
    *,
    name: str,
    q: Optional[str],
    source: Optional[str],
    location: Optional[str],
    posted_after,
    limit: int,
):
    stmt = insert(SavedSearchRow).values(
        name=name,
        q=q,
        source=source,
        location=location,
        posted_after=posted_after,
        limit=limit,
        updated_at=datetime.utcnow(),
    ).on_conflict_do_update(
        index_elements=[SavedSearchRow.name],
        set_={
            "q": q,
            "source": source,
            "location": location,
            "posted_after": posted_after,
            "limit": limit,
            "updated_at": datetime.utcnow(),
        },
    )
    db.execute(stmt)
    db.commit()


def get_saved_search(db: Session, name: str) -> Optional[SavedSearchRow]:
    stmt = select(SavedSearchRow).where(SavedSearchRow.name == name)
    return db.execute(stmt).scalars().first()


def list_saved_searches(db: Session) -> List[SavedSearchRow]:
    stmt = select(SavedSearchRow).order_by(SavedSearchRow.name.asc())
    return db.execute(stmt).scalars().all()


def count_seen(db: Session, name: str) -> int:
    stmt = select(func.count()).select_from(
        SeenJobRow).where(SeenJobRow.search_name == name)
    return db.execute(stmt).scalar_one()


def mark_seen_bulk(db: Session, search_name: str, job_uids: List[str]) -> None:
    if not job_uids:
        return

    rows = [{"search_name": search_name, "job_uid": uid} for uid in job_uids]

    stmt = insert(SeenJobRow).values(rows).on_conflict_do_nothing(
        constraint="uq_seen_search_job"
    )
    db.execute(stmt)
    db.commit()


def new_jobs_for_search(db: Session, name: str):
    """
    Returns new jobs (not previously seen) and records them as seen.
    """
    s = get_saved_search(db, name)
    if not s:
        return None, []

    results = db_search_jobs(
        db,
        q=s.q,
        source=s.source,
        location=s.location,
        posted_after=s.posted_after,
        limit=s.limit,
    )

    uids = [j.uid for j in results]
    if not uids:
        return s, []

    # Fetch already-seen among these uids
    seen_stmt = (
        select(SeenJobRow.job_uid)
        .where(SeenJobRow.search_name == name)
        .where(SeenJobRow.job_uid.in_(uids))
    )
    seen_set = set(db.execute(seen_stmt).scalars().all())

    new_items = [j for j in results if j.uid not in seen_set]

    # mark as seen
    mark_seen_bulk(db, name, [j.uid for j in new_items])

    return s, new_items
