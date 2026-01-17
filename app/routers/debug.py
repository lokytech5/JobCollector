from datetime import datetime
from fastapi import APIRouter, Depends
from app.api.schemas import DebugAddJobIn, JobOut
from app.api.deps import get_store, get_reed_client, get_adzuna_client
from app.domain.job import Job
from app.services.store import InMemoryJobStore
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient

router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/store")
def debug_store(store: InMemoryJobStore = Depends(get_store)):
    return {
        "store_id": id(store),
        "count": store.count(),
        "uids_preview": list(store._jobs_by_uid.keys())[:5],
    }


@router.post("/add_fake_job", response_model=JobOut)
def add_fake_job(
    payload: DebugAddJobIn,
    store: InMemoryJobStore = Depends(get_store),
):
    fake = Job(
        source="debug",
        source_job_id=str(store.count() + 1),
        title=payload.title,
        company=payload.company,
        location="London",
        url=None,
        posted_at=datetime.utcnow(),
    )
    store.upsert_many([fake])

    return JobOut(
        uid=fake.uid,
        source=fake.source,
        source_job_id=fake.source_job_id,
        title=fake.title,
        company=fake.company,
        location=fake.location,
        url=fake.url,
        posted_at=fake.posted_at,
    )


@router.get("/reed/raw")
def debug_reed_raw(
    keywords: str = "typescript backend",
    location_name: str = "London",
    results_to_take: int = 10,
    reed_api_client: ReedApiClient = Depends(get_reed_client),
):
    return reed_api_client.search_raw(
        keywords=keywords,
        location_name=location_name,
        results_to_take=results_to_take,
    )


@router.get("/adzuna/raw")
def debug_adzuna_raw(
    what: str = "backend engineer",
    where: str = "London",
    results_per_page: int = 10,
    page: int = 1,
    adzuna_api_client: AdzunaApiClient = Depends(get_adzuna_client),
):
    return adzuna_api_client.search_raw(
        what=what,
        where=where,
        results_per_page=results_per_page,
        page=page,
        country="gb",
    )
