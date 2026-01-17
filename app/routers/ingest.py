from fastapi import APIRouter, Depends
from app.api.deps import get_adzuna_client, get_reed_client, get_store
from app.api.schemas import AdzunaIngestIn, IngestAllIn, IngestAllOut, IngestOut, ReedIngestIn
from app.sources.adzuna import AdzunaApiClient
from app.sources.reed import ReedApiClient
from app.services.store import InMemoryJobStore

router = APIRouter(tags=["ingest"])


@router.post("/ingest/reed", response_model=IngestOut)
def ingest_reed(
    payload: ReedIngestIn,
    store: InMemoryJobStore = Depends(get_store),
    reed_api_client: ReedApiClient = Depends(get_reed_client),
):
    jobs = reed_api_client.search(
        keywords=payload.keywords,
        location_name=payload.location_name,
        results_to_take=payload.results_to_take,
    )
    inserted = store.upsert_many(jobs)
    return IngestOut(fetched=len(jobs), inserted=inserted, total_in_store=store.count())


@router.post("/ingest/adzuna", response_model=IngestOut)
def ingest_adzuna(
    payload: AdzunaIngestIn,
    store: InMemoryJobStore = Depends(get_store),
    adzuna_api_client: AdzunaApiClient = Depends(get_adzuna_client),
):
    jobs = adzuna_api_client.search(
        what=payload.what,
        where=payload.where,
        results_per_page=payload.results_per_page,
        page=payload.page,
    )
    inserted = store.upsert_many(jobs)
    return IngestOut(fetched=len(jobs), inserted=inserted, total_in_store=store.count())


@router.post("/ingest/all", response_model=IngestAllOut)
def ingest_all(
    payload: IngestAllIn,
    store: InMemoryJobStore = Depends(get_store),
    reed_api_client: ReedApiClient = Depends(get_reed_client),
    adzuna_api_client: AdzunaApiClient = Depends(get_adzuna_client),
):
    # Reed
    reed_jobs = reed_api_client.search(
        keywords=payload.keywords,
        location_name=payload.location_name,
        results_to_take=payload.reed_results,
    )
    reed_inserted = store.upsert_many(reed_jobs)

    # Adzuna
    adzuna_jobs = adzuna_api_client.search(
        what=payload.keywords,
        where=payload.location_name,
        results_per_page=payload.adzuna_results,
        page=payload.adzuna_page,
    )
    adzuna_inserted = store.upsert_many(adzuna_jobs)

    return IngestAllOut(
        reed=IngestOut(fetched=len(reed_jobs),
                       inserted=reed_inserted, total_in_store=store.count()),
        adzuna=IngestOut(fetched=len(adzuna_jobs),
                         inserted=adzuna_inserted, total_in_store=store.count()),
        total_in_store=store.count(),
    )
