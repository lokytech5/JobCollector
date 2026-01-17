from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Dict, Optional, Set, List

from app.domain.job import Job


@dataclass
class SavedSearch:
    name: str
    q: Optional[str] = None
    source: Optional[str] = None
    location: Optional[str] = None
    posted_after: Optional[date] = None
    limit: int = 50
    seen_uids: Set[str] = field(default_factory=set)


class InMemorySavedSearchRepo:
    def __init__(self) -> None:
        self._by_name: Dict[str, SavedSearch] = {}

    def upsert(self, s: SavedSearch) -> SavedSearch:
        self._by_name[s.name] = s
        return s

    def get(self, name: str) -> Optional[SavedSearch]:
        return self._by_name.get(name)

    def list(self) -> List[SavedSearch]:
        return list(self._by_name.values())
