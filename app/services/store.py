from __future__ import annotations
from typing import Dict, List
from app.domain.job import Job
from datetime import datetime


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
