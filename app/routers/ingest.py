from fastapi import APIRouter, Depends
from app.api.deps import get_adzuna_client, get_db, get_reed_client
from app.api.schemas import AdzunaIngestIn, IngestAllIn, IngestAllOut, IngestOut, ReedIngestIn
from app.sources.adzuna import AdzunaApiClient
from app.sources.reed import ReedApiClient

from app.services import job_repo_db
from sqlalchemy.orm import Session

router = APIRouter(tags=["ingest"])


@router.post("/ingest/reed", response_model=IngestOut)
def ingest_reed(
    payload: ReedIngestIn,
    db: Session = Depends(get_db),
    reed: ReedApiClient = Depends(get_reed_client),
):
    jobs = reed.search(
        keywords=payload.keywords,
        location_name=payload.location_name,
        results_to_take=payload.results_to_take,
    )
    affected = job_repo_db.upsert_many(db, jobs)
    total = job_repo_db.count_jobs(db)
    return IngestOut(fetched=len(jobs), inserted=affected, total_in_store=total)


@router.post("/ingest/adzuna", response_model=IngestOut)
def ingest_adzuna(
    payload: AdzunaIngestIn,
    db: Session = Depends(get_db),
    adzuna: AdzunaApiClient = Depends(get_adzuna_client),
):
    jobs = adzuna.search(
        what=payload.what,
        where=payload.where,
        results_per_page=payload.results_per_page,
        page=payload.page,
    )
    affected = job_repo_db.upsert_many(db, jobs)
    total = job_repo_db.count_jobs(db)
    return IngestOut(fetched=len(jobs), inserted=affected, total_in_store=total)


@router.post("/ingest/all", response_model=IngestAllOut)
def ingest_all(
    payload: IngestAllIn,
    db: Session = Depends(get_db),
    reed: ReedApiClient = Depends(get_reed_client),
    adzuna: AdzunaApiClient = Depends(get_adzuna_client),
):
    reed_jobs = reed.search(
        keywords=payload.keywords,
        location_name=payload.location_name,
        results_to_take=payload.reed_results,
    )
    reed_affected = job_repo_db.upsert_many(db, reed_jobs)

    adzuna_jobs = adzuna.search(
        what=payload.keywords,
        where=payload.location_name,
        results_per_page=payload.adzuna_results,
        page=payload.adzuna_page,
    )
    adzuna_affected = job_repo_db.upsert_many(db, adzuna_jobs)

    total = job_repo_db.count_jobs(db)

    return IngestAllOut(
        reed=IngestOut(fetched=len(reed_jobs),
                       inserted=reed_affected, total_in_store=total),
        adzuna=IngestOut(fetched=len(adzuna_jobs),
                         inserted=adzuna_affected, total_in_store=total),
        total_in_store=total,
    )
