from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_search_repo, get_store
from app.api.schemas import (
    SavedSearchIn,
    SavedSearchOut,
    RunSavedSearchOut,
    NewJobsOut,
    JobOut,
)
from app.services.saved_searches import InMemorySavedSearchRepo, SavedSearch
from app.services.store import InMemoryJobStore

router = APIRouter(prefix="/searches", tags=["searches"])


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


def to_saved_out(s: SavedSearch) -> SavedSearchOut:
    return SavedSearchOut(
        name=s.name,
        q=s.q,
        source=s.source,
        location=s.location,
        posted_after=s.posted_after,
        limit=s.limit,
        seen_count=len(s.seen_uids),
    )


@router.post("", response_model=SavedSearchOut)
def upsert_search(
    payload: SavedSearchIn,
    repo: InMemorySavedSearchRepo = Depends(get_search_repo),
):
    s = SavedSearch(
        name=payload.name,
        q=payload.q,
        source=payload.source,
        location=payload.location,
        posted_after=payload.posted_after,
        limit=payload.limit,
    )
    # preserve seen_uids if updating existing search
    existing = repo.get(payload.name)
    if existing:
        s.seen_uids = existing.seen_uids

    repo.upsert(s)
    return to_saved_out(s)


@router.get("", response_model=List[SavedSearchOut])
def list_searches(repo: InMemorySavedSearchRepo = Depends(get_search_repo)):
    return [to_saved_out(s) for s in repo.list()]


@router.get("/{name}", response_model=SavedSearchOut)
def get_search(name: str, repo: InMemorySavedSearchRepo = Depends(get_search_repo)):
    s = repo.get(name)
    if not s:
        raise HTTPException(status_code=404, detail="Saved search not found")
    return to_saved_out(s)


@router.get("/{name}/run", response_model=RunSavedSearchOut)
def run_search(
    name: str,
    repo: InMemorySavedSearchRepo = Depends(get_search_repo),
    store: InMemoryJobStore = Depends(get_store),
):
    s = repo.get(name)
    if not s:
        raise HTTPException(status_code=404, detail="Saved search not found")

    results = store.search(
        q=s.q,
        source=s.source,
        location=s.location,
        posted_after=s.posted_after,
        limit=s.limit,
    )
    return RunSavedSearchOut(
        search=to_saved_out(s),
        results=[to_job_out(j) for j in results],
    )


@router.get("/{name}/new", response_model=NewJobsOut)
def new_jobs(
    name: str,
    repo: InMemorySavedSearchRepo = Depends(get_search_repo),
    store: InMemoryJobStore = Depends(get_store),
):
    s = repo.get(name)
    if not s:
        raise HTTPException(status_code=404, detail="Saved search not found")

    results = store.search(
        q=s.q,
        source=s.source,
        location=s.location,
        posted_after=s.posted_after,
        limit=s.limit,
    )

    new_items = [j for j in results if j.uid not in s.seen_uids]
    for j in new_items:
        s.seen_uids.add(j.uid)

    repo.upsert(s)

    return NewJobsOut(
        search=to_saved_out(s),
        new_jobs=[to_job_out(j) for j in new_items],
        new_count=len(new_items),
    )
