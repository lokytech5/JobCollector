from typing import Optional, List, Set
from pydantic import BaseModel
from datetime import datetime, date


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
    affected: int
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


class SavedSearchIn(BaseModel):
    name: str
    q: Optional[str] = None
    source: Optional[str] = None
    location: Optional[str] = None
    posted_after: Optional[date] = None
    limit: int = 50


class SavedSearchOut(BaseModel):
    name: str
    q: Optional[str] = None
    source: Optional[str] = None
    location: Optional[str] = None
    posted_after: Optional[date] = None
    limit: int = 50
    seen_count: int = 0


class RunSavedSearchOut(BaseModel):
    search: SavedSearchOut
    results: List[JobOut]


class NewJobsOut(BaseModel):
    search: SavedSearchOut
    new_jobs: List[JobOut]
    new_count: int
