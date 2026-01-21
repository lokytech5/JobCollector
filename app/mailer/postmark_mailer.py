from __future__ import annotations
import httpx
from typing import Optional
from app.core.config import settings

POSTMARK_URL = "https://api.postmarkapp.com/email"


class PostmarkMailer:
    def __init__(self) -> None:
        if not settings.POSTMARK_SERVER_TOKEN:
            raise RuntimeError(
                "POSTMARK_SERVER_TOKEN is required for PostmarkMailer")
        self._client = httpx.Client(timeout=20)

    def close(self) -> None:
        self._client.close()

    def send(self, *, subject: str, text: str, html: Optional[str] = None) -> None:
        payload = {
            "From": settings.EMAIL_FROM,
            "To": settings.EMAIL_TO,
            "Subject": subject,
            "TextBody": text,
            "MessageStream": settings.POSTMARK_MESSAGE_STREAM,
        }
        if html:
            payload["HtmlBody"] = html

        r = self._client.post(
            POSTMARK_URL,
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Postmark-Server-Token": settings.POSTMARK_SERVER_TOKEN,
            },
            json=payload,
        )

        if r.status_code >= 400:
            raise RuntimeError(f"Postmark error {r.status_code}: {r.text}")

        r.raise_for_status()
