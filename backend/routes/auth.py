from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.logging import get_logger, log_auth_failure
from ..models import User
from ..auth import verify_password, create_access_token, get_password_hash
from ..schemas.auth import LoginRequest, LoginResponse, RegisterRequest, UserResponse
from ..schemas.common import success_response, error_response

router = APIRouter(prefix="/auth", tags=["auth"])
logger = get_logger(__name__)


@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT token.
    """
    try:
        # Find user by email
        user = db.query(User).filter(User.email == request.email).first()
        
        if not user:
            log_auth_failure(logger, "User not found", request.email)
            return error_response("Incorrect email or password", status_code=401)
        
        # Verify password
        if not verify_password(request.password, user.hashed_password):
            log_auth_failure(logger, "Invalid password", request.email)
            return error_response("Incorrect email or password", status_code=401)
        
        # Check if user is active
        if not user.is_active:
            log_auth_failure(logger, "Account disabled", request.email)
            return error_response("Account is disabled", status_code=403)
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        logger.info(f"User logged in successfully: {user.email}")
        
        return success_response({
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "company": user.company
            }
        })
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        return error_response("Login failed", status_code=500)


@router.post("/register")
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user.
    """
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == request.email).first()
        if existing_user:
            return error_response("Email already registered", status_code=400)
        
        # Create new user
        hashed_password = get_password_hash(request.password)
        new_user = User(
            email=request.email,
            name=request.name,
            hashed_password=hashed_password,
            company=request.company
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"User registered successfully: {new_user.email}")
        
        return success_response({
            "message": "User registered successfully",
            "user_id": new_user.id
        })
        
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return error_response("Registration failed", status_code=500)


@router.get("/me")
async def get_current_user_info(
    db: Session = Depends(get_db),
    current_user = Depends(lambda: None)  # Will be replaced with proper dependency
):
    """
    Get current user information.
    """
    try:
        return success_response({
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "company": current_user.company,
            "is_active": current_user.is_active
        })
    except Exception as e:
        logger.error(f"Error fetching user info: {e}")
        return error_response("Failed to fetch user info", status_code=500)
