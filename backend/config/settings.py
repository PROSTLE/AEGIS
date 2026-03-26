"""Configuration Settings for AEGIS"""
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Keys
    GEMINI_API_KEY: str = ""
    CRUNCHBASE_API_KEY: Optional[str] = None

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/aegis"
    DATABASE_ECHO: bool = False

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_TTL: int = 86400  # 24 hours

    # Models
    SURVIVAL_PREDICTOR_MODEL_PATH: str = "ml_models/survival_predictor.pkl"
    LOGISTICS_MODEL_PATH: str = "ml_models/logistics_model.pkl"
    WORKFORCE_MODEL_PATH: str = "ml_models/workforce_model.pkl"

    # API Limits
    GEMINI_REQUESTS_PER_DAY: int = 1500
    GEMINI_TOKENS_PER_DAY: int = 1000000

    # Features
    ENABLE_CACHING: bool = True
    ENABLE_ML_FEATURES: bool = True

    # Deployment
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
