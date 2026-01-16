from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analyze as analyze_api
from app.core import config

app = FastAPI(title="AI Product Ingredient Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_api.router)

@app.get("/health")
def health():
    return {"status": "ok"}
