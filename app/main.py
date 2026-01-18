from contextlib import asynccontextmanager
from app.services.saved_searches import InMemorySavedSearchRepo
import httpx
from fastapi import FastAPI

from app.core.config import settings
from app.services.store import InMemoryJobStore
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient
from app.routers import debug, jobs, health, ingest, searches


@asynccontextmanager
async def lifespan(app: FastAPI):
    # singletons
    app.state.store = InMemoryJobStore()
    app.state.searches = InMemorySavedSearchRepo()

    # shared HTTP clients
    reed_http = httpx.Client(auth=(settings.REED_API_KEY, ""), timeout=30, headers={
                             "Accept": "application/json"})
    adzuna_http = httpx.Client(
        timeout=30, headers={"Accept": "application/json"})

    app.state.reed = ReedApiClient(settings.REED_API_KEY, client=reed_http)
    app.state.adzuna = AdzunaApiClient(
        settings.ADZUNA_APP_ID, settings.ADZUNA_APP_KEY, client=adzuna_http)

    try:
        yield
    finally:
        reed_http.close()
        adzuna_http.close()

app = FastAPI(title="Job Collector (Learning Version)", lifespan=lifespan)

app.include_router(health.router)
app.include_router(jobs.router)
app.include_router(ingest.router)
app.include_router(debug.router)
app.include_router(searches.router)
