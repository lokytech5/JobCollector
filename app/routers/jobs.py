
from fastapi import APIRouter
from typing import List
from app.api.schemas import JobOut
from app.services import store

router = APIRouter(tags=["jobs"])


@router.get("/jobs", response_model=List[JobOut])
def list_jobs(limit: int = 50):
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


@router.get("/debug/store")
def debug_store():
    return {
        "store_id": id(store),
        "count": store.count(),
        "uids_preview": list(store._jobs_by_uid.keys())[:5],
    }
