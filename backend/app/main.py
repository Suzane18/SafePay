from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.payments import router as payments_router
from app.api.recipients import router as recipients_router
from app.api.risk import router as risk_router
from app.api.transactions import router as transactions_router
from app.api.users import router as users_router
from app.core.config import settings
from app.database.base import Base
from app.database.session import engine
from app import models  # noqa: F401

@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.include_router(health_router, prefix='/api')
app.include_router(users_router, prefix='/api')
app.include_router(recipients_router, prefix='/api')
app.include_router(risk_router, prefix='/api')
app.include_router(transactions_router, prefix='/api')
app.include_router(payments_router, prefix='/api')

