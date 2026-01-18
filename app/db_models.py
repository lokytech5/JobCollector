from datetime import datetime, date
from typing import Optional
from sqlalchemy import String, DateTime, Date, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base


class JobRow(Base):
    __tablename__ = "jobs"
    uid: Mapped[str] = mapped_column(String, primary_key=True)
    source: Mapped[str] = mapped_column(String, index=True)
    source_job_id: Mapped[str] = mapped_column(String, index=True)

    title: Mapped[str] = mapped_column(String)
    company: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    posted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)


class SavedSearchRow(Base):
    __tablename__ = "saved_searches"

    name: Mapped[str] = mapped_column(String, primary_key=True)
    q: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    posted_after: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    limit: Mapped[int] = mapped_column(Integer, default=50)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)


class SeenJobRow(Base):
    __tablename__ = "seen_jobs"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)
    search_name: Mapped[str] = mapped_column(
        ForeignKey("saved_searches.name"), index=True)
    job_uid: Mapped[str] = mapped_column(ForeignKey("jobs.uid"), index=True)
    seen_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("search_name", "job_uid", name="uq_seen_search_job"),
    )
