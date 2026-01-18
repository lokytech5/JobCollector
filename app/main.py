from contextlib import asynccontextmanager

from sqlalchemy import text
from app.db import make_engine, make_session_factory
import httpx
from fastapi import FastAPI

from app.core.config import settings
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient
from app.routers import debug, jobs, health, ingest, searches


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize db connection, engine, clients, repo.
    engine = make_engine(settings.DATABASE_URL)
    app.state.engine = engine
    app.state.db = make_session_factory(engine)

    with engine.connect() as conn:
        conn.execute(text("select 1"))

    # singletons
    # app.state.store = InMemoryJobStore()
    # app.state.searches = InMemorySavedSearchRepo()

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
        engine.dispose()

app = FastAPI(title="Job Collector (Learning Version)", lifespan=lifespan)

app.include_router(health.router)
app.include_router(jobs.router)
app.include_router(ingest.router)
app.include_router(debug.router)
app.include_router(searches.router)
