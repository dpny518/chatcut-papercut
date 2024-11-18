from fastapi import FastAPI
from .api.endpoints import router as api_router
import logging

logging.basicConfig(level=logging.INFO)
app = FastAPI()

app.include_router(api_router, prefix="/api/v1")