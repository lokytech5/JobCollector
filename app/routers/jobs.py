
from fastapi import APIRouter, Depends
from typing import List
from app.api.deps import get_store
from app.api.schemas import JobOut
from app.services.store import InMemoryJobStore

router = APIRouter(tags=["jobs"])


@router.get("/jobs", response_model=List[JobOut])
def list_jobs(
    limit: int = 50,
    store: InMemoryJobStore = Depends(get_store)
):
    jobs = store.list(limit=limit)
    return [
        JobOut(
            uid=j.uid,
            source=j.source,
            source_job_id=j.source_job_id,
            title=j.title,
            company=j.company,
            location=j.location,
            url=j.url,
            posted_at=j.posted_at,
        )
        for j in jobs
    ]
