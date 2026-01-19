from fastapi import Header, HTTPException
from app.core.config import settings


def require_cron_secret(x_cron_secret: str = Header(..., alias="X-CRON-SECRET")):
    if x_cron_secret != settings.CRON_SECRET:
        raise HTTPException(status_code=401, detail="Invalid cron secret")
