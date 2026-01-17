# WHY: Settings centralizes configuration (secrets, defaults) and keeps them out of code.
# FastAPI apps in production read config from environment variables (12-factor style).

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    REED_API_KEY: str
    ADZUNA_APP_ID: str
    ADZUNA_APP_KEY: str

    # pydantic-settings v2: load from a local .env file for dev convenience
    model_config = {
        "env_file": str(Path(__file__).resolve().parents[2] / ".env"),
        "env_file_encoding": "utf-8",
    }


# Instantiate settings at import time.
settings = Settings()
