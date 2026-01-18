from fastapi import Request
from app.services.saved_searches import InMemorySavedSearchRepo
from app.services.store import InMemoryJobStore
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient


def get_store(request: Request) -> InMemoryJobStore:
    return request.app.state.store


def get_reed_client(request: Request) -> ReedApiClient:
    return request.app.state.reed


def get_adzuna_client(request: Request) -> AdzunaApiClient:
    return request.app.state.adzuna


def get_search_repo(request: Request) -> InMemorySavedSearchRepo:
    return request.app.state.searches
