from pydantic import BaseModel, Field
from typing import Any, Optional, Generic, TypeVar
from datetime import datetime

T = TypeVar('T')


class APIResponse(BaseModel, Generic[T]):
    """Standardized API response schema."""
    success: bool = Field(..., description="Whether the request was successful")
    data: Optional[T] = Field(None, description="Response data")
    error: Optional[str] = Field(None, description="Error message if any")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class PaginationParams(BaseModel):
    """Pagination parameters."""
    page: int = Field(default=1, ge=1, description="Page number")
    limit: int = Field(default=10, ge=1, le=100, description="Items per page")


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response schema."""
    success: bool = Field(..., description="Whether the request was successful")
    data: Optional[list[T]] = Field(None, description="List of items")
    error: Optional[str] = Field(None, description="Error message if any")
    pagination: dict = Field(..., description="Pagination metadata")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


def success_response(data: Any = None) -> dict:
    """Create a success response."""
    return {
        "success": True,
        "data": data,
        "error": None,
        "timestamp": datetime.utcnow().isoformat()
    }


def error_response(error: str, status_code: int = 400) -> dict:
    """Create an error response."""
    return {
        "success": False,
        "data": None,
        "error": error,
        "timestamp": datetime.utcnow().isoformat()
    }
