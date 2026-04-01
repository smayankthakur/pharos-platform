from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List
import os


class Settings(BaseSettings):
    """Application settings with validation and fail-fast behavior."""
    
    # Database
    DATABASE_URL: str = Field(..., description="PostgreSQL connection string")
    
    # OpenAI
    OPENAI_API_KEY: str = Field(..., description="OpenAI API key")
    
    # Security
    SECRET_KEY: str = Field(..., description="JWT secret key")
    ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=1440, description="Token expiry in minutes (24h)")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = Field(
        default=["https://pharos-platform.vercel.app"],
        description="Allowed CORS origins"
    )
    
    # App
    APP_NAME: str = Field(default="PharOS API")
    APP_VERSION: str = Field(default="1.0.0")
    DEBUG: bool = Field(default=False)
    
    # OpenAI Settings
    OPENAI_MODEL: str = Field(default="gpt-4.1-mini")
    OPENAI_TIMEOUT: int = Field(default=30, description="OpenAI API timeout in seconds")
    OPENAI_MAX_RETRIES: int = Field(default=3, description="Max retries for OpenAI calls")
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO")
    
    @validator("DATABASE_URL", pre=True)
    def validate_database_url(cls, v: str) -> str:
        if not v:
            raise ValueError("DATABASE_URL is required")
        if not v.startswith(("postgresql://", "postgresql+asyncpg://")):
            raise ValueError("DATABASE_URL must be a PostgreSQL connection string")
        return v
    
    @validator("OPENAI_API_KEY", pre=True)
    def validate_openai_key(cls, v: str) -> str:
        if not v:
            raise ValueError("OPENAI_API_KEY is required")
        if not v.startswith("sk-"):
            raise ValueError("OPENAI_API_KEY must start with 'sk-'")
        return v
    
    @validator("SECRET_KEY", pre=True)
    def validate_secret_key(cls, v: str) -> str:
        if not v:
            raise ValueError("SECRET_KEY is required")
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create settings instance - will fail fast if required env vars are missing
try:
    settings = Settings()
except Exception as e:
    print(f"❌ Configuration Error: {e}")
    print("Please ensure all required environment variables are set.")
    raise SystemExit(1)
