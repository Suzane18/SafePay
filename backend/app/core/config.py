import os
from dataclasses import dataclass
from pathlib import Path


DEFAULT_DATABASE_PATH = Path(__file__).resolve().parents[3] / 'data' / 'safepay.db'


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv('APP_NAME', 'SafePay API')
    app_env: str = os.getenv('APP_ENV', 'development')
    database_url: str = os.getenv('DATABASE_URL', f'sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}')
    cors_origins: tuple[str, ...] = tuple(
        origin.strip()
        for origin in os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
        if origin.strip()
    )


settings = Settings()
