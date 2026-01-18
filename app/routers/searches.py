from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.schemas import (
    SavedSearchIn,
    SavedSearchOut,
    RunSavedSearchOut,
    NewJobsOut,
    JobOut,
)
from app.services import saved_search_repo_db, job_repo_db

router = APIRouter(prefix="/searches", tags=["searches"])


def to_job_out(j) -> JobOut:
    return JobOut(
        uid=j.uid,
        source=j.source,
        source_job_id=j.source_job_id,
        title=j.title,
        company=j.company,
        location=j.location,
        url=j.url,
        posted_at=j.posted_at,
    )


def to_saved_out(row, seen_count: int) -> SavedSearchOut:
    return SavedSearchOut(
        name=row.name,
        q=row.q,
        source=row.source,
        location=row.location,
        posted_after=row.posted_after,
        limit=row.limit,
        seen_count=seen_count,
    )


@router.post("", response_model=SavedSearchOut)
def upsert_search(
    payload: SavedSearchIn,
    db: Session = Depends(get_db),
):
    saved_search_repo_db.upsert_saved_search(
        db,
        name=payload.name,
        q=payload.q,
        source=payload.source,
        location=payload.location,
        posted_after=payload.posted_after,
        limit=payload.limit,
    )
    row = saved_search_repo_db.get_saved_search(db, payload.name)
    seen_count = saved_search_repo_db.count_seen(db, payload.name)
    return to_saved_out(row, seen_count)


@router.get("", response_model=List[SavedSearchOut])
def list_searches(db: Session = Depends(get_db)):
    rows = saved_search_repo_db.list_saved_searches(db)
    return [to_saved_out(r, saved_search_repo_db.count_seen(db, r.name)) for r in rows]


@router.get("/{name}", response_model=SavedSearchOut)
def get_search(name: str, db: Session = Depends(get_db)):
    row = saved_search_repo_db.get_saved_search(db, name)
    if not row:
        raise HTTPException(status_code=404, detail="Saved search not found")
    return to_saved_out(row, saved_search_repo_db.count_seen(db, name))


@router.get("/{name}/run", response_model=RunSavedSearchOut)
def run_search(name: str, db: Session = Depends(get_db)):
    row = saved_search_repo_db.get_saved_search(db, name)
    if not row:
        raise HTTPException(status_code=404, detail="Saved search not found")

    results = job_repo_db.search_jobs(
        db,
        q=row.q,
        source=row.source,
        location=row.location,
        posted_after=row.posted_after,
        limit=row.limit,
    )

    return RunSavedSearchOut(
        search=to_saved_out(row, saved_search_repo_db.count_seen(db, name)),
        results=[to_job_out(j) for j in results],
    )


@router.get("/{name}/new", response_model=NewJobsOut)
def new_jobs(name: str, db: Session = Depends(get_db)):
    row, new_items = saved_search_repo_db.new_jobs_for_search(db, name)
    if not row:
        raise HTTPException(status_code=404, detail="Saved search not found")

    seen_count = saved_search_repo_db.count_seen(db, name)

    return NewJobsOut(
        search=to_saved_out(row, seen_count),
        new_jobs=[to_job_out(j) for j in new_items],
        new_count=len(new_items),
    )
