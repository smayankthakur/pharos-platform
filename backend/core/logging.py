import logging
import sys
from typing import Any, Dict
import json
from datetime import datetime


class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging."""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        # Add extra fields
        if hasattr(record, "extra"):
            log_data.update(record.extra)
        
        return json.dumps(log_data)


def setup_logging(log_level: str = "INFO") -> None:
    """Configure structured logging for the application."""
    
    # Remove existing handlers
    root_logger = logging.getLogger()
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Configure root logger
    root_logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    
    # Console handler with JSON formatting
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(console_handler)
    
    # Set specific loggers
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)
    logging.getLogger("openai").setLevel(logging.INFO)


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance with the given name."""
    return logging.getLogger(name)


# Convenience functions for structured logging
def log_api_error(logger: logging.Logger, error: Exception, context: Dict[str, Any] = None) -> None:
    """Log API errors with context."""
    extra = {"error_type": type(error).__name__, "error_message": str(error)}
    if context:
        extra.update(context)
    logger.error("API Error occurred", extra=extra)


def log_ai_failure(logger: logging.Logger, error: Exception, prompt: str = None) -> None:
    """Log AI service failures."""
    extra = {"error_type": type(error).__name__, "error_message": str(error)}
    if prompt:
        extra["prompt_preview"] = prompt[:200]
    logger.error("AI Service Failure", extra=extra)


def log_auth_failure(logger: logging.Logger, reason: str, user_email: str = None) -> None:
    """Log authentication failures."""
    extra = {"reason": reason}
    if user_email:
        extra["user_email"] = user_email
    logger.warning("Authentication Failure", extra=extra)
