# app.py
# Goal (Step 1): Prove FastAPI server runs and responds.
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI
from pydantic import BaseModel

from fastapi import FastAPI
from pydantic_settings import BaseSettings
from pathlib import Path

import httpx
from fastapi import HTTPException


# WHY: Settings centralizes configuration (secrets, defaults) and keeps them out of code.
# FastAPI apps in production read config from environment variables (12-factor style).

class Settings(BaseSettings):
    REED_API_KEY: str
    ADZUNA_APP_ID: str
    ADZUNA_APP_KEY: str

    # pydantic-settings v2: load from a local .env file for dev convenience
    model_config = {
        "env_file": str(Path(__file__).resolve().parents[1] / ".env"),
        "env_file_encoding": "utf-8",
    }


# Instantiate settings at import time.
settings = Settings()

# Create the web application object.
# WHY: FastAPI uses this object to register routes.
app = FastAPI(title="Job Collector (Learning Version)")


# -----------------------------
#  Domain model (Job)
# -----------------------------
@dataclass(frozen=True)
class Job:
    """
    WHY this exists:
      - This is our INTERNAL representation of a job.
      - No matter where a job comes from (Reed, Adzuna, Visa, etc.),
        we normalize it into this shape.
    """
    source: str
    source_job_id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    url: Optional[str] = None
    posted_at: Optional[datetime] = None

    @property
    def uid(self) -> str:
        """
        WHY: Stable unique key for dedupe.
        Example: reed:123456
        """
        return f"{self.source}:{self.source_job_id}"

# -----------------------------
# Repository (in-memory store)
# -----------------------------


class InMemoryJobStore:
    """
    Think of this like a Repository.
    For now it uses memory (a dict) instead of a real DB.

    Later we'll swap this for Postgres without changing much else.
    """

    def __init__(self):
        self._jobs_by_uid: Dict[str, Job] = {}

    def upsert_many(self, jobs: List[Job]) -> int:
        inserted = 0
        for job in jobs:
            if job.uid not in self._jobs_by_uid:
                inserted += 1
            self._jobs_by_uid[job.uid] = job
            return inserted

    def list(self, limit: int = 50) -> List[Job]:
        """
        Return latest jobs. If posted_at is missing, ordering is less meaningful,
        """

        def sort_key(job: Job):
            return job.posted_at or datetime.min
        return sorted(self._jobs_by_uid.values(), key=sort_key, reverse=True)[:limit]

    def count(self) -> int:
        return len(self._jobs_by_uid)


store = InMemoryJobStore()


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

    def search_jobs(
        self,
        keywords: str,
        location_name: Optional[str] = None,
        results_to_take: int = 25,
    ) -> Dict:
        params = {
            "keywords": keywords,
            "resultsToTake": results_to_take,
        }
        if location_name:
            params["locationName"] = location_name

        response = self.client.get(f"{self.BASE_URL}/search", params=params)

        if response.status_code == 401:
            raise HTTPException(
                status_code=401, detail="Reed auth failed. Check REED_API_KEY.")
        if response.status_code >= 400:
            raise HTTPException(
                status_code=502, detail=f"Reed error {response.status_code}: {response.text[:200]}")

        return response.json()


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

    def search_jobs(
        self,
        what: str,
        where: Optional[str] = None,
        results_per_page: int = 10,
        page: int = 1,
        country: str = "gb",
    ) -> Dict:
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "results_per_page": results_per_page,
            "what": what,
            # optional override to force JSON if needed:
            # "content-type": "application/json",
        }
        if where:
            params["where"] = where

        url = f"{self.BASE_URL}/jobs/{country}/search/{page}"
        resp = self.client.get(url, params=params)

        if resp.status_code == 401 or resp.status_code == 403:
            raise HTTPException(
                status_code=401, detail="Adzuna auth failed. Check ADZUNA_APP_ID/ADZUNA_APP_KEY.")
        if resp.status_code >= 400:
            raise HTTPException(
                status_code=502, detail=f"Adzuna error {resp.status_code}: {resp.text[:250]}")

        return resp.json()


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


# -----------------------------
# Endpoints
# -----------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "reed_api_loaded": bool(settings.REED_API_KEY)
    }


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


reed_api = ReedApiClient(settings.REED_API_KEY)


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


adzuna_api = AdzunaApiClient(settings.ADZUNA_APP_ID, settings.ADZUNA_APP_KEY)


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
