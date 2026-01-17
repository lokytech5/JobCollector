from app.domain.job import Job, parse_reed_date
from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException
import httpx


class ReedApiClient:
    """
    Raw Reed API client (returns JSON) — good for testing connectivity and auth.
    """
    BASE_URL = "https://www.reed.co.uk/api/1.0"  # no trailing slash

    def __init__(self, api_key: str):
        self.api_key = api_key
        # Basic Auth: username=api_key, password=""
        self.client = httpx.Client(auth=(api_key, ""), timeout=30, headers={
                                   "Accept": "application/json"})

    def search_raw(self, *, keywords: str, location_name: Optional[str] = None, results_to_take: int = 25) -> Dict:
        params = {
            "keywords": keywords,
            "resultsToTake": results_to_take,
        }
        if location_name:
            params["locationName"] = location_name

        resp = self.client.get(f"{self.BASE_URL}/search", params=params)

        if resp.status_code == 401:
            raise HTTPException(
                status_code=401, detail="Reed auth failed. Check REED_API_KEY.")
        if resp.status_code >= 400:
            raise HTTPException(
                status_code=502, detail=f"Reed error {resp.status_code}: {resp.text[:200]}")
        return resp.json()

    def search(self, *, keywords: str, location_name: Optional[str] = None, results_to_take: int = 25) -> List[Job]:
        data = self.search_raw(
            keywords=keywords,
            location_name=location_name,
            results_to_take=results_to_take,
        )

        jobs: List[Job] = []
        for item in data.get("results", []):
            job_id = item.get("jobId")
            title = item.get("jobTitle")
            if not job_id or not title:
                continue

            jobs.append(
                Job(
                    source="reed",
                    source_job_id=str(job_id),
                    title=title,
                    company=item.get("employerName"),
                    location=item.get("locationName"),
                    url=item.get("jobUrl"),
                    posted_at=parse_reed_date(item.get("date")),
                )
            )
        return jobs
