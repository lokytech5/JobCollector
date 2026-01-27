# app/routers/ui.py
from datetime import date, datetime
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api.deps import get_db
from app.api.schemas import SavedSearchIn, SavedSearchOut, JobOut
from app.db_models import SeenJobRow
from app.services import saved_search_repo_db, job_repo_db
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient
from app.api.deps import get_reed_client, get_adzuna_client

router = APIRouter(prefix="/ui", tags=["ui"])


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


def saved_search_payload(db: Session, row) -> Dict[str, Any]:
    return {
        "name": row.name,
        "q": row.q,
        "source": row.source,
        "location": row.location,
        "posted_after": row.posted_after,
        "limit": row.limit,
        "seen_count": saved_search_repo_db.count_seen(db, row.name),
    }


@router.get("/dashboard")
def ui_dashboard(limit_jobs: int = 20, db: Session = Depends(get_db)):
    searches = saved_search_repo_db.list_saved_searches(db)
    jobs = job_repo_db.list_jobs(db, limit=limit_jobs)

    return {
        "stats": {
            "total_jobs": job_repo_db.count_jobs(db),
            "search_count": len(searches),
        },
        "searches": [saved_search_payload(db, s) for s in searches],
        "latest_jobs": [to_job_out(j) for j in jobs],
    }


@router.get("/jobs", response_model=List[JobOut])
def ui_jobs(limit: int = 50, db: Session = Depends(get_db)):
    jobs = job_repo_db.list_jobs(db, limit=limit)
    return [to_job_out(j) for j in jobs]


@router.post("/searches", response_model=SavedSearchOut)
def ui_upsert_search(payload: SavedSearchIn, db: Session = Depends(get_db)):
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
    return SavedSearchOut(
        name=row.name,
        q=row.q,
        source=row.source,
        location=row.location,
        posted_after=row.posted_after,
        limit=row.limit,
        seen_count=seen_count,
    )


@router.get("/searches/{name}/feed")
def ui_search_feed(name: str, limit: int = 50, db: Session = Depends(get_db)):
    s = saved_search_repo_db.get_saved_search(db, name)
    if not s:
        raise HTTPException(status_code=404, detail="Saved search not found")

    results = job_repo_db.search_jobs(
        db,
        q=s.q,
        source=s.source,
        location=s.location,
        posted_after=s.posted_after,
        limit=limit,
    )

    uids = [j.uid for j in results]
    seen_set = set()
    if uids:
        stmt = select(SeenJobRow.job_uid).where(
            SeenJobRow.search_name == name,
            SeenJobRow.job_uid.in_(uids),
        )
        seen_set = set(db.execute(stmt).scalars().all())

    return {
        "search": saved_search_payload(db, s),
        "items": [{"job": to_job_out(j), "seen": (j.uid in seen_set)} for j in results],
    }


@router.get("/searches/{name}/new-count")
def ui_search_new_count(name: str, limit: int = 50, db: Session = Depends(get_db)):
    s = saved_search_repo_db.get_saved_search(db, name)
    if not s:
        raise HTTPException(status_code=404, detail="Saved search not found")

    results = job_repo_db.search_jobs(
        db,
        q=s.q,
        source=s.source,
        location=s.location,
        posted_after=s.posted_after,
        limit=limit,
    )
    uids = [j.uid for j in results]
    if not uids:
        return {"name": name, "new_count": 0}

    seen_stmt = (
        select(SeenJobRow.job_uid)
        .where(SeenJobRow.search_name == name)
        .where(SeenJobRow.job_uid.in_(uids))
    )
    seen_set = set(db.execute(seen_stmt).scalars().all())
    new_count = sum(1 for uid in uids if uid not in seen_set)

    return {"name": name, "new_count": new_count}


@router.post("/searches/{name}/mark-and-fetch-new")
def ui_mark_and_fetch_new(name: str, db: Session = Depends(get_db)):
    # Uses your existing logic (marks as seen)
    row, new_items = saved_search_repo_db.new_jobs_for_search(db, name)
    if not row:
        raise HTTPException(status_code=404, detail="Saved search not found")

    return {
        "search": saved_search_payload(db, row),
        "new_jobs": [to_job_out(j) for j in new_items],
        "new_count": len(new_items),
    }


@router.post("/ingest/all")
def ui_ingest_all(
    keywords: str = "backend engineer",
    location_name: Optional[str] = "London",
    db: Session = Depends(get_db),
    reed: ReedApiClient = Depends(get_reed_client),
    adzuna: AdzunaApiClient = Depends(get_adzuna_client),
):
    reed_jobs = reed.search(
        keywords=keywords, location_name=location_name, results_to_take=25)
    adzuna_jobs = adzuna.search(
        what=keywords, where=location_name, results_per_page=20, page=1)

    job_repo_db.upsert_many(db, reed_jobs)
    job_repo_db.upsert_many(db, adzuna_jobs)

    return {
        "keywords": keywords,
        "location_name": location_name,
        "fetched": {"reed": len(reed_jobs), "adzuna": len(adzuna_jobs)},
        "total_in_store": job_repo_db.count_jobs(db),
    }
