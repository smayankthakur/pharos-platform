from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable, Awaitable
import traceback
from .logging import get_logger, log_api_error

logger = get_logger(__name__)


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Centralized error handling middleware."""
    
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            return await self.handle_exception(request, exc)
    
    async def handle_exception(self, request: Request, exc: Exception) -> JSONResponse:
        """Handle exceptions and return standardized error response."""
        
        # Log the error with context
        context = {
            "method": request.method,
            "url": str(request.url),
            "client_ip": request.client.host if request.client else None,
        }
        log_api_error(logger, exc, context)
        
        # Determine status code and message
        if hasattr(exc, "status_code"):
            status_code = exc.status_code
            detail = str(exc.detail) if hasattr(exc, "detail") else str(exc)
        elif isinstance(exc, ValueError):
            status_code = 400
            detail = str(exc)
        elif isinstance(exc, PermissionError):
            status_code = 403
            detail = "Permission denied"
        else:
            status_code = 500
            detail = "Internal server error"
        
        # Return standardized error response
        return JSONResponse(
            status_code=status_code,
            content={
                "success": False,
                "data": None,
                "error": detail
            }
        )


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging all requests."""
    
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        # Log request
        logger.info(
            "Request received",
            extra={
                "method": request.method,
                "url": str(request.url),
                "client_ip": request.client.host if request.client else None,
            }
        )
        
        # Process request
        response = await call_next(request)
        
        # Log response
        logger.info(
            "Response sent",
            extra={
                "method": request.method,
                "url": str(request.url),
                "status_code": response.status_code,
            }
        )
        
        return response
