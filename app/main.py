# app.py
# Goal (Step 1): Prove FastAPI server runs and responds.
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel

from fastapi import FastAPI, HTTPException, Body

import httpx

from app.core.config import settings
from app.domain.job import Job, parse_reed_date, parse_adzuna_date_iso
from app.services.store import InMemoryJobStore


# Create the web application object.
# WHY: FastAPI uses this object to register routes.
app = FastAPI(title="Job Collector (Learning Version)")


# -----------------------------
#  Domain model (Job)
# -----------------------------


# -----------------------------
# Repository (in-memory store)
# -----------------------------


class ReedApiClient:
    """
    Raw Reed API client (returns JSON) — good for testing connectivity and auth.
    """
    BASE_URL = "https://www.reed.co.uk/api/1.0"  # no trailing slash

    def __init__(self, api_key: str):
        self.api_key = api_key
        # Basic Auth: username=api_key, password=""
        self.client = httpx.Client(auth=(api_key, ""), timeout=30, headers={
                                   "Accept": "application/json"})

    def search_raw(self, *, keywords: str, location_name: Optional[str] = None, results_to_take: int = 25) -> Dict:
        params = {
            "keywords": keywords,
            "resultsToTake": results_to_take,
        }
        if location_name:
            params["locationName"] = location_name

        resp = self.client.get(f"{self.BASE_URL}/search", params=params)

        if resp.status_code == 401:
            raise HTTPException(
                status_code=401, detail="Reed auth failed. Check REED_API_KEY.")
        if resp.status_code >= 400:
            raise HTTPException(
                status_code=502, detail=f"Reed error {resp.status_code}: {resp.text[:200]}")
        return resp.json()

    def search(self, *, keywords: str, location_name: Optional[str] = None, results_to_take: int = 25) -> List[Job]:
        data = self.search_raw(
            keywords=keywords,
            location_name=location_name,
            results_to_take=results_to_take,
        )

        jobs: List[Job] = []
        for item in data.get("results", []):
            job_id = item.get("jobId")
            title = item.get("jobTitle")
            if not job_id or not title:
                continue

            jobs.append(
                Job(
                    source="reed",
                    source_job_id=str(job_id),
                    title=title,
                    company=item.get("employerName"),
                    location=item.get("locationName"),
                    url=item.get("jobUrl"),
                    posted_at=parse_reed_date(item.get("date")),
                )
            )
        return jobs


class AdzunaApiClient:
    """
    Raw Adzuna API client (returns JSON) — great for quickly testing endpoint + keys.
    """
    BASE_URL = "https://api.adzuna.com/v1/api"

    def __init__(self, app_id: str, app_key: str):
        self.app_id = app_id
        self.app_key = app_key
        self.client = httpx.Client(
            timeout=30,
            headers={"Accept": "application/json"},
        )

    def search_raw(self, *, what: str, where: Optional[str] = None, results_per_page: int = 10, page: int = 1, country: str = "gb") -> Dict:
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "what": what,
            "results_per_page": results_per_page,
        }
        if where:
            params["where"] = where

        url = f"{self.BASE_URL}/jobs/{country}/search/{page}"
        resp = self.client.get(url, params=params)

        if resp.status_code in (401, 403):
            raise HTTPException(
                status_code=401, detail="Adzuna auth failed. Check ADZUNA_APP_ID/ADZUNA_APP_KEY.")
        if resp.status_code >= 400:
            raise HTTPException(
                status_code=502, detail=f"Adzuna error {resp.status_code}: {resp.text[:200]}")
        return resp.json()

    def search(self, *, what: str, where: Optional[str] = None, results_per_page: int = 10, page: int = 1, country: str = "gb") -> List[Job]:
        data = self.search_raw(
            what=what,
            where=where,
            results_per_page=results_per_page,
            page=page,
            country=country,
        )

        jobs: List[Job] = []
        for item in data.get("results", []):
            job_id = item.get("id")
            title = item.get("title")
            if not job_id or not title:
                continue

            company = (item.get("company") or {}).get("display_name")
            location = (item.get("location") or {}).get("display_name")
            url = item.get("redirect_url")

            jobs.append(
                Job(
                    source="adzuna",
                    source_job_id=str(job_id),
                    title=title,
                    company=company,
                    location=location,
                    url=url,
                    posted_at=parse_adzuna_date_iso(item.get("created")),
                )
            )
        return jobs


# -----------------------------
# Step 3C: API schemas (Pydantic)
# -----------------------------
class JobOut(BaseModel):
    uid: str
    source: str
    source_job_id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    url: Optional[str] = None
    posted_at: Optional[datetime] = None


class DebugAddJobIn(BaseModel):
    title: str
    company: Optional[str] = None


class IngestOut(BaseModel):
    fetched: int
    inserted: int
    total_in_store: int


class ReedIngestIn(BaseModel):
    keywords: str
    location_name: Optional[str] = None
    results_to_take: int = 25


class AdzunaIngestIn(BaseModel):
    what: str
    where: Optional[str] = None
    results_per_page: int = 20
    page: int = 1


class IngestAllIn(BaseModel):
    keywords: str = "backend engineer"
    location_name: Optional[str] = "London"
    reed_results: int = 25
    adzuna_results: int = 20
    adzuna_page: int = 1


class IngestAllOut(BaseModel):
    reed: IngestOut
    adzuna: IngestOut
    total_in_store: int

# -----------------------------
# Endpoints
# -----------------------------


store = InMemoryJobStore()
reed_api = ReedApiClient(settings.REED_API_KEY)
adzuna_api = AdzunaApiClient(settings.ADZUNA_APP_ID, settings.ADZUNA_APP_KEY)


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
    jobs = reed_api.search(
        keywords=payload.keywords,
        location_name=payload.location_name,
        results_to_take=payload.results_to_take,
    )
    inserted = store.upsert_many(jobs)
    return IngestOut(fetched=len(jobs), inserted=inserted, total_in_store=store.count())


@app.post("/ingest/adzuna", response_model=IngestOut)
def ingest_adzuna(payload: AdzunaIngestIn):
    jobs = adzuna_api.search(
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
    reed_jobs = reed_api.search(
        keywords=payload.keywords,
        location_name=payload.location_name,
        results_to_take=payload.reed_results,
    )
    reed_inserted = store.upsert_many(reed_jobs)

    # Adzuna
    adzuna_jobs = adzuna_api.search(
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
    return reed_api.search_jobs(
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
    return adzuna_api.search_jobs(
        what=what,
        where=where,
        results_per_page=results_per_page,
        page=page,
        country="gb",
    )
