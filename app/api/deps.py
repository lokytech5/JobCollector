# app/api/deps.py
from functools import lru_cache

from app.core.config import settings
from app.services.store import InMemoryJobStore
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient


@lru_cache
def get_store() -> InMemoryJobStore:
    return InMemoryJobStore()


@lru_cache
def get_reed_client() -> ReedApiClient:
    return ReedApiClient(settings.REED_API_KEY)


@lru_cache
def get_adzuna_client() -> AdzunaApiClient:
    return AdzunaApiClient(settings.ADZUNA_APP_ID, settings.ADZUNA_APP_KEY)
