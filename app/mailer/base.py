from typing import Optional, Protocol


class Mailer(Protocol):
    def send(self, *, subject: str, text: str,
             html: Optional[str] = None) -> None: ...
