from fastapi import Request
from app.services.saved_searches import InMemorySavedSearchRepo
from app.services.store import InMemoryJobStore
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient
from sqlalchemy.orm import Session


def get_store(request: Request) -> InMemoryJobStore:
    return request.app.state.store


def get_reed_client(request: Request) -> ReedApiClient:
    return request.app.state.reed


def get_adzuna_client(request: Request) -> AdzunaApiClient:
    return request.app.state.adzuna


def get_search_repo(request: Request) -> InMemorySavedSearchRepo:
    return request.app.state.searches


def get_db(request: Request):
    SessionLocal = request.app.state.db
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
