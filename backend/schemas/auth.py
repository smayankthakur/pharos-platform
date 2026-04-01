from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class LoginRequest(BaseModel):
    """Request schema for login."""
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=6, description="User password")


class LoginResponse(BaseModel):
    """Response schema for login."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: dict = Field(..., description="User information")


class RegisterRequest(BaseModel):
    """Request schema for registration."""
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=6, description="User password")
    name: str = Field(..., min_length=2, description="User name")
    company: Optional[str] = Field(default=None, description="Company name")


class UserResponse(BaseModel):
    """Response schema for user data."""
    id: int = Field(..., description="User ID")
    email: str = Field(..., description="User email")
    name: str = Field(..., description="User name")
    company: Optional[str] = Field(default=None, description="Company name")
    is_active: bool = Field(..., description="Whether user is active")
