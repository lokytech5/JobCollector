# WHY: Settings centralizes configuration (secrets, defaults) and keeps them out of code.
# FastAPI apps in production read config from environment variables (12-factor style).

from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    REED_API_KEY: str
    ADZUNA_APP_ID: str
    ADZUNA_APP_KEY: str
    DATABASE_URL: str

    # cron security
    CRON_SECRET: str

    # email routing
    EMAIL_FROM: str
    EMAIL_TO: str

    # provider switch
    EMAIL_PROVIDER: str = "postmark"  # "postmark" or "smtp"

    # postmark
    POSTMARK_SERVER_TOKEN: Optional[str] = None
    POSTMARK_MESSAGE_STREAM: str = "notification"

    # pydantic-settings v2: load from a local .env file for dev convenience
    model_config = {
        "env_file": str(Path(__file__).resolve().parents[2] / ".env"),
        "env_file_encoding": "utf-8",
    }


settings = Settings()
