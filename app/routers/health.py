from fastapi import APIRouter
router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {"status": "ok", "reed_api_loaded": True, "adzuna_loaded": True}
