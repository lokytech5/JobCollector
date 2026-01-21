from app.core.config import settings
from app.mailer.postmark_mailer import PostmarkMailer
from app.mailer.smtp_mailer import SmtpMailer


def make_mailer():
    if settings.EMAIL_PROVIDER == "postmark":
        return PostmarkMailer()
    if settings.EMAIL_PROVIDER == "smtp":
        return SmtpMailer()
    raise RuntimeError(f"Unknown EMAIL_PROVIDER={settings.EMAIL_PROVIDER}")
