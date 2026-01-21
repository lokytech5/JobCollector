import smtplib
from email.message import EmailMessage
from typing import Optional
from app.core.config import settings


class SmtpMailer:
    def send(self, *, subject: str, text: str, html: Optional[str] = None) -> None:
        msg = EmailMessage()
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = settings.EMAIL_TO
        msg["Subject"] = subject

        if html:
            msg.set_content(text)
            msg.add_alternative(html, subtype="html")
        else:
            msg.set_content(text)

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(settings.SMTP_USER, settings.SMTP_PASS)
            smtp.send_message(msg)
