from fastapi import APIRouter, Depends
from app.api.deps import get_reed_client, get_adzuna_client
from app.sources.reed import ReedApiClient
from app.sources.adzuna import AdzunaApiClient

router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/reed/raw")
def debug_reed_raw(
    keywords: str = "typescript backend",
    location_name: str = "London",
    results_to_take: int = 10,
    reed_api_client: ReedApiClient = Depends(get_reed_client),
):
    return reed_api_client.search_raw(
        keywords=keywords,
        location_name=location_name,
        results_to_take=results_to_take,
    )


@router.get("/adzuna/raw")
def debug_adzuna_raw(
    what: str = "backend engineer",
    where: str = "London",
    results_per_page: int = 10,
    page: int = 1,
    adzuna_api_client: AdzunaApiClient = Depends(get_adzuna_client),
):
    return adzuna_api_client.search_raw(
        what=what,
        where=where,
        results_per_page=results_per_page,
        page=page,
        country="gb",
    )
