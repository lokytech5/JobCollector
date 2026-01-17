from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass(frozen=True)
class Job:
    """
    WHY this exists:
      - This is our INTERNAL representation of a job.
      - No matter where a job comes from (Reed, Adzuna, Visa, etc.),
        we normalize it into this shape.
    """
    source: str
    source_job_id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    url: Optional[str] = None
    posted_at: Optional[datetime] = None

    @property
    def uid(self) -> str:
        """
        WHY: Stable unique key for dedupe.
        Example: reed:123456
        """
        return f"{self.source}:{self.source_job_id}"


# Helper date parsers (Reed is DD/MM/YYYY, Adzuna is ISO)
def parse_reed_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.strptime(value, "%d/%m/%Y")
    except ValueError:
        return None


def parse_adzuna_date_iso(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        return None
