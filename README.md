# Job Collector

Job Collector is a learning-focused backend project that aggregates UK tech job listings from multiple sources into one unified API—starting with **Reed**—built with **FastAPI**.

The goal is to learn “real-world” backend and cloud engineering practices while building something useful for day-to-day job hunting.

---

## What this app does

At a high level, the app:

1. **Ingests jobs** from job sources (APIs and ATS job boards).
2. **Normalizes** listings into a single internal `Job` format (so every source looks the same).
3. **Stores & deduplicates** jobs (currently in-memory; later we’ll swap to a real database).
4. **Exposes an API** to fetch jobs and (later) filter by role keywords such as:
   - Backend Engineer (TypeScript / Node / Python)
   - Cloud Engineer (AWS / Terraform / DevOps)

---

## Current status

✅ FastAPI app runs  
✅ Config is loaded from environment (`.env`) using `pydantic-settings`  
✅ In-memory store (repository) supports insert/update (upsert) + list  
✅ Debug endpoint can add a fake job so we can test the pipeline

Next step: connect to **Reed** and build `POST /ingest/reed`.

---

## API endpoints (so far)

- **GET** `/health`  
  Returns service health + confirms config loaded.

- **GET** `/jobs`  
  Lists stored jobs.

- **POST** `/debug/add_fake_job` *(temporary)*  
  Adds a fake job to validate the store + response models.

---

## Run locally

### 1) Install dependencies
If you’re using Pipenv:

```
pipenv install
```

## 2) Add your Reed API key

Create a `.env` file in the project root:

```
REED_API_KEY=your_reed_key_here
```

### 3) Start the dev server
```
http://127.0.0.1:8000/docs
```
Server:

- **http://127.0.0.1:8000**
Docs:

- **http://127.0.0.1:8000/docs**

### 4) Quick test
Health check
```
curl http://127.0.0.1:8000/health
```



# Project design (learning blueprint)

This project follows a simple but scalable backend pattern:

- **Routers (controllers):** handle HTTP input/output only  
- **Services:** implement use-cases (e.g., ingest jobs)  
- **Sources/Clients:** talk to external APIs (Reed, Adzuna, SmartRecruiters, Greenhouse, etc.)  
- **Repository/Store:** data access layer (in-memory now, DB later)  

## Models

- **Pydantic models:** API request/response validation  
- **Dataclass entity:** internal `Job` representation  

We’re starting in a single file for clarity, then refactoring into modules once the full flow works.

# Roadmap

1. **Reed ingestion**  
   - `POST /ingest/reed` calls Reed search API and stores results.

2. **Multi-source ingestion**  
   - Add Adzuna and ATS job boards (Greenhouse, SmartRecruiters).

3. **Filtering & scoring**  
   - Tag jobs as “backend” vs “cloud” based on keywords.

4. **Persistence**  
   - Replace in-memory store with SQLite/Postgres.

5. **Cloud deployment**  
   - Dockerize, schedule ingestion, deploy to AWS/GCP/Azure.

