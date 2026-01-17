from __future__ import annotations
from fastapi import FastAPI
from app.routers import debug, jobs, health, ingest

app = FastAPI(title="Job Collector (Learning Version)")

app.include_router(health.router)
app.include_router(jobs.router)
app.include_router(ingest.router)
app.include_router(debug.router)
