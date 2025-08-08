from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import structlog
from typing import Union

logger = structlog.get_logger()

class AyaException(Exception):
    """Base exception for Aya DeFi Navigator"""
    def __init__(self, message: str, code: str = "AYA_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)

class AIServiceException(AyaException):
    """Exception for AI service errors"""
    def __init__(self, message: str):
        super().__init__(message, "AI_SERVICE_ERROR")

class RiskAssessmentException(AyaException):
    """Exception for risk assessment errors"""
    def __init__(self, message: str):
        super().__init__(message, "RISK_ASSESSMENT_ERROR")

class BlockchainException(AyaException):
    """Exception for blockchain interaction errors"""
    def __init__(self, message: str):
        super().__init__(message, "BLOCKCHAIN_ERROR")

class UserNotFoundException(AyaException):
    """Exception when user is not found"""
    def __init__(self, user_id: str):
        super().__init__(f"User {user_id} not found", "USER_NOT_FOUND")

class InsufficientPermissionsException(AyaException):
    """Exception for insufficient permissions"""
    def __init__(self, action: str):
        super().__init__(f"Insufficient permissions for {action}", "INSUFFICIENT_PERMISSIONS")

async def aya_exception_handler(request: Request, exc: AyaException):
    """Handle custom Aya exceptions"""
    logger.error(
        "Aya exception occurred",
        path=request.url.path,
        method=request.method,
        code=exc.code,
        message=exc.message
    )
    
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "type": "aya_error"
            }
        }
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logger.warning(
        "HTTP exception occurred",
        path=request.url.path,
        method=request.method,
        status_code=exc.status_code,
        detail=exc.detail
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail,
                "type": "http_error"
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors"""
    logger.warning(
        "Validation error occurred",
        path=request.url.path,
        method=request.method,
        errors=exc.errors()
    )
    
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "type": "validation_error",
                "details": exc.errors()
            }
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(
        "Unexpected error occurred",
        path=request.url.path,
        method=request.method,
        error=str(exc),
        exc_info=True
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
                "type": "server_error"
            }
        }
    )

def setup_exception_handlers(app: FastAPI):
    """Setup all exception handlers for the FastAPI app"""
    
    # Custom exception handlers
    app.add_exception_handler(AyaException, aya_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
