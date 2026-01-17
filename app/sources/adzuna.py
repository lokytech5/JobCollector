from app.domain.job import Job, parse_adzuna_date_iso
from typing import List, Optional, Dict
from fastapi import HTTPException
import httpx


class AdzunaApiClient:
    """
    Raw Adzuna API client (returns JSON) — great for quickly testing endpoint + keys.
    """
    BASE_URL = "https://api.adzuna.com/v1/api"

    def __init__(self, app_id: str, app_key: str, client: httpx.Client):
        self.app_id = app_id
        self.app_key = app_key
        self.client = client

    def search_raw(self, *, what: str, where: Optional[str] = None, results_per_page: int = 10, page: int = 1, country: str = "gb") -> Dict:
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "what": what,
            "results_per_page": results_per_page,
        }
        if where:
            params["where"] = where

        url = f"{self.BASE_URL}/jobs/{country}/search/{page}"
        resp = self.client.get(url, params=params)

        if resp.status_code in (401, 403):
            raise HTTPException(
                status_code=401, detail="Adzuna auth failed. Check ADZUNA_APP_ID/ADZUNA_APP_KEY.")
        if resp.status_code >= 400:
            raise HTTPException(
                status_code=502, detail=f"Adzuna error {resp.status_code}: {resp.text[:200]}")
        return resp.json()

    def search(self, *, what: str, where: Optional[str] = None, results_per_page: int = 10, page: int = 1, country: str = "gb") -> List[Job]:
        data = self.search_raw(
            what=what,
            where=where,
            results_per_page=results_per_page,
            page=page,
            country=country,
        )

        jobs: List[Job] = []
        for item in data.get("results", []):
            job_id = item.get("id")
            title = item.get("title")
            if not job_id or not title:
                continue

            company = (item.get("company") or {}).get("display_name")
            location = (item.get("location") or {}).get("display_name")
            url = item.get("redirect_url")

            jobs.append(
                Job(
                    source="adzuna",
                    source_job_id=str(job_id),
                    title=title,
                    company=company,
                    location=location,
                    url=url,
                    posted_at=parse_adzuna_date_iso(item.get("created")),
                )
            )
        return jobs
