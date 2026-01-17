from __future__ import annotations
from typing import Dict, List, Optional
from app.domain.job import Job
from datetime import date, datetime


class InMemoryJobStore:
    """
    Think of this like a Repository.
    For now it uses memory (a dict) instead of a real DB.

    Later we'll swap this for Postgres without changing much else.
    """

    def __init__(self):
        self._jobs_by_uid: Dict[str, Job] = {}

    def upsert_many(self, jobs: List[Job]) -> int:
        """
        Upsert = insert if new, update if exists.

        -> int is a return type annotation (not arrow functions).
        It means: this function returns an integer.

        inserted counts only NEW jobs (uids not seen before).
        """
        inserted = 0
        for job in jobs:
            if job.uid not in self._jobs_by_uid:
                inserted += 1
            self._jobs_by_uid[job.uid] = job
        return inserted

    def list(self, limit: int = 50) -> List[Job]:
        """
        Return latest jobs by posted_at desc.
        Nested function `sort_key` exists just to keep sorting logic local.
        """

        def sort_key(job: Job):
            return job.posted_at or datetime.min
        return sorted(self._jobs_by_uid.values(), key=sort_key, reverse=True)[:limit]

    def count(self) -> int:
        return len(self._jobs_by_uid)

    def search(
        self,
        *,
        q: Optional[str] = None,
        source: Optional[str] = None,
        location: Optional[str] = None,
        posted_after: Optional[date] = None,
        limit: int = 50,
    ) -> List[Job]:
        """
        Simple in-memory filtering.
        - q matches title/company/location (case-insensitive contains)
        - source matches exact (reed/adzuna)
        - location matches contains (case-insensitive)
        - posted_after keeps jobs with posted_at >= posted_after (date-based)
        """
        def text_contains(haystack: Optional[str], needle: str) -> bool:
            return bool(haystack) and needle in haystack.lower()

        q_norm = q.strip().lower() if q else None
        source_norm = source.strip().lower() if source else None
        loc_norm = location.strip().lower() if location else None

        results: List[Job] = []

        for job in self._jobs_by_uid.values():
            # source filter
            if source_norm and (job.source or "").lower() != source_norm:
                continue

            # posted_after filter (date granularity)
            if posted_after:
                if not job.posted_at:
                    continue
                if job.posted_at.date() < posted_after:
                    continue

            # location filter
            if loc_norm and not text_contains(job.location, loc_norm):
                continue

            # q filter across title/company/location
            if q_norm:
                if not (
                    text_contains(job.title, q_norm)
                    or text_contains(job.company, q_norm)
                    or text_contains(job.location, q_norm)
                ):
                    continue

            results.append(job)

        # newest first
        results.sort(key=lambda j: j.posted_at or datetime.min, reverse=True)
        return results[:limit]
