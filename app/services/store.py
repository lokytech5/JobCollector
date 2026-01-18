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

        def norm(s: Optional[str]) -> str:
            return (s or "").strip().lower()

        q_tokens = [t for t in norm(q).split() if t] if q else []
        source_norm = norm(source) if source else None
        loc_norm = norm(location) if location else None

        results: List[Job] = []

        for job in self._jobs_by_uid.values():
            # source filter
            if source_norm and norm(job.source) != source_norm:
                continue

            # posted_after filter
            if posted_after:
                if not job.posted_at:
                    continue
                if job.posted_at.date() < posted_after:
                    continue

            # location filter
            if loc_norm and loc_norm not in norm(job.location):
                continue

            # q filter (token AND across title/company/location)
            if q_tokens:
                haystack = " ".join(
                    [norm(job.title), norm(job.company), norm(job.location)])
                if not all(tok in haystack for tok in q_tokens):
                    continue

            results.append(job)

        results.sort(key=lambda j: j.posted_at or datetime.min, reverse=True)
        return results[:limit]
