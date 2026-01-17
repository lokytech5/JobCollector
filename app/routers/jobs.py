from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends

from app.api.deps import get_store
from app.api.schemas import JobOut
from app.services.store import InMemoryJobStore

router = APIRouter(tags=["jobs"])


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


@router.get("/jobs", response_model=List[JobOut])
def list_jobs(
    limit: int = 50,
    store: InMemoryJobStore = Depends(get_store),
):
    jobs = store.list(limit=limit)
    return [to_job_out(j) for j in jobs]


@router.get("/jobs/search", response_model=List[JobOut])
def search_jobs(
    q: Optional[str] = None,
    source: Optional[str] = None,
    location: Optional[str] = None,
    posted_after: Optional[date] = None,
    limit: int = 50,
    store: InMemoryJobStore = Depends(get_store),
):
    jobs = store.search(
        q=q,
        source=source,
        location=location,
        posted_after=posted_after,
        limit=limit,
    )
    return [to_job_out(j) for j in jobs]
