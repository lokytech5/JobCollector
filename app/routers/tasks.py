from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_reed_client, get_adzuna_client, get_mailer
from app.api.tasks_deps import require_cron_secret
from app.services import saved_search_repo_db, job_repo_db

router = APIRouter(prefix="/tasks", tags=["tasks"])


def format_email(search_name: str, new_items) -> str:
    lines = [f"New jobs for: {search_name}", ""]
    for j in new_items:
        lines.append(
            f"- {j.title} | {j.company or 'Unknown'} | {j.location or ''}")
        if j.url:
            lines.append(f"  {j.url}")
        lines.append("")
    return "\n".join(lines)


@router.post("/searches/{name}/run", dependencies=[Depends(require_cron_secret)])
def run_one_saved_search(
    name: str,
    db: Session = Depends(get_db),
    reed=Depends(get_reed_client),
    adzuna=Depends(get_adzuna_client),
    mailer=Depends(get_mailer),
):
    s = saved_search_repo_db.get_saved_search(db, name)
    if not s:
        raise HTTPException(status_code=404, detail="Saved search not found")

    q = s.q or ""
    loc = s.location or None

    reed_jobs = reed.search(keywords=q, location_name=loc, results_to_take=25)
    adzuna_jobs = adzuna.search(what=q, where=loc, results_per_page=20, page=1)

    job_repo_db.upsert_many(db, reed_jobs)
    job_repo_db.upsert_many(db, adzuna_jobs)

    _, new_items = saved_search_repo_db.new_jobs_for_search(db, name)

    emailed = False
    if new_items:
        mailer.send(
            subject=f"[JobCollector] {len(new_items)} new jobs for {name}",
            text=format_email(name, new_items),
        )
        emailed = True

    return {
        "search": name,
        "ingested": {"reed": len(reed_jobs), "adzuna": len(adzuna_jobs)},
        "new_count": len(new_items),
        "emailed": emailed,
    }


@router.post("/run-all", dependencies=[Depends(require_cron_secret)])
def run_all_saved_searches(
    db: Session = Depends(get_db),
    reed=Depends(get_reed_client),
    adzuna=Depends(get_adzuna_client),
    mailer=Depends(get_mailer),
):
    searches = saved_search_repo_db.list_saved_searches(db)
    out = []

    for s in searches:
        q = s.q or ""
        loc = s.location or None

        reed_jobs = reed.search(
            keywords=q, location_name=loc, results_to_take=25)
        adzuna_jobs = adzuna.search(
            what=q, where=loc, results_per_page=20, page=1)

        job_repo_db.upsert_many(db, reed_jobs)
        job_repo_db.upsert_many(db, adzuna_jobs)

        _, new_items = saved_search_repo_db.new_jobs_for_search(db, s.name)

        emailed = False
        if new_items:
            mailer.send(
                subject=f"[JobCollector] {len(new_items)} new jobs for {s.name}",
                text=format_email(s.name, new_items),
            )
            emailed = True

        out.append({
            "name": s.name,
            "ingested": {"reed": len(reed_jobs), "adzuna": len(adzuna_jobs)},
            "new_count": len(new_items),
            "emailed": emailed,
        })

    return {"ran": len(out), "results": out}


@router.post("/email/test", dependencies=[Depends(require_cron_secret)])
def email_test(mailer=Depends(get_mailer)):
    mailer.send(
        subject="[JobCollector] Email test",
        text="Email pipeline is working ✅",
    )
    return {"ok": True}
