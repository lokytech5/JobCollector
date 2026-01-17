from app.core.config import settings
from app.services.store import InMemoryJobStore
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient

_store = InMemoryJobStore()
_reed = ReedApiClient(settings.REED_API_KEY)
_adzuna = AdzunaApiClient(settings.ADZUNA_APP_ID, settings.ADZUNA_APP_KEY)


def get_store() -> InMemoryJobStore:
    return _store


def get_reed_client() -> ReedApiClient:
    return _reed


def get_adzuna_client() -> AdzunaApiClient:
    return _adzuna
