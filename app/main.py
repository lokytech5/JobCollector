# app.py
# Goal (Step 1): Prove FastAPI server runs and responds.
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional


from fastapi import FastAPI, HTTPException, Body

from app.api.schemas import AdzunaIngestIn, DebugAddJobIn, IngestAllIn, IngestAllOut, IngestOut, JobOut, ReedIngestIn
import httpx

from app.core.config import settings
from app.domain.job import Job, parse_reed_date, parse_adzuna_date_iso
from app.services.store import InMemoryJobStore
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient


# Create the web application object.
# WHY: FastAPI uses this object to register routes.
app = FastAPI(title="Job Collector (Learning Version)")


# -----------------------------
#  Domain model (Job)
# -----------------------------


# -----------------------------
# Repository (in-memory store)
# -----------------------------


# -----------------------------
# Step 3C: API schemas (Pydantic)
# -----------------------------


# -----------------------------
# Endpoints
# -----------------------------


store = InMemoryJobStore()
reed_api_client = ReedApiClient(settings.REED_API_KEY)
adzuna_api_client = AdzunaApiClient(
    settings.ADZUNA_APP_ID, settings.ADZUNA_APP_KEY)


@app.get("/health")
def health():
    return {"status": "ok", "reed_api_loaded": True, "adzuna_loaded": True}


@app.get("/jobs", response_model=List[JobOut])
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


@app.post("/ingest/reed", response_model=IngestOut)
def ingest_reed(payload: ReedIngestIn):
    jobs = reed_api_client.search(
        keywords=payload.keywords,
        location_name=payload.location_name,
        results_to_take=payload.results_to_take,
    )
    inserted = store.upsert_many(jobs)
    return IngestOut(fetched=len(jobs), inserted=inserted, total_in_store=store.count())


@app.post("/ingest/adzuna", response_model=IngestOut)
def ingest_adzuna(payload: AdzunaIngestIn):
    jobs = adzuna_api_client.search(
        what=payload.what,
        where=payload.where,
        results_per_page=payload.results_per_page,
        page=payload.page,
    )
    inserted = store.upsert_many(jobs)
    return IngestOut(fetched=len(jobs), inserted=inserted, total_in_store=store.count())


@app.post("/ingest/all", response_model=IngestAllOut)
def ingest_all(payload: IngestAllIn):
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


@app.get("/debug/store")
def debug_store():
    return {
        "store_id": id(store),
        "count": store.count(),
        "uids_preview": list(store._jobs_by_uid.keys())[:5],
    }


@app.post("/debug/add_fake_job", response_model=JobOut)
def add_fake_job(payload: DebugAddJobIn):
    """
    WHY this endpoint exists:
      - it's a local test to verify:
          1) our Job model works
          2) our store can save + list
      - We'll DELETE this later once Reed ingestion works.

    TEST:
      POST /debug/add_fake_job with {"title": "..."}
      then GET /jobs and see it appear.
    """
    fake = Job(
        source="debug",
        source_job_id=str(store.count() + 1),  # simple unique id
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


@app.get("/debug/reed/raw")
def debug_reed_raw(
    keywords: str = "typescript backend",
    location_name: str = "London",
    results_to_take: int = 10,
):
    """
    Temporary endpoint to confirm:
      - Reed endpoint works
      - Your API key works
      - Query params behave
    """
    return reed_api_client.search_jobs(
        keywords=keywords,
        location_name=location_name,
        results_to_take=results_to_take,
    )


@app.get("/debug/adzuna/raw")
def debug_adzuna_raw(
    what: str = "backend engineer",
    where: str = "London",
    results_per_page: int = 10,
    page: int = 1,
):
    return adzuna_api_client.search_jobs(
        what=what,
        where=where,
        results_per_page=results_per_page,
        page=page,
        country="gb",
    )
