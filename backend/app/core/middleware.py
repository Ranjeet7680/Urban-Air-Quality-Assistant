import time
import hashlib
from collections import defaultdict
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies defense-in-depth HTTP security headers to protect against
    Clickjacking, MIME-sniffing, XSS, and unauthorized framing.
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        
        # Prevent MIME-sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        # Prevent Clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        # Enable browser XSS filter
        response.headers["X-XSS-Protection"] = "1; mode=block"
        # Strict Transport Security (HSTS)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        # Permissions Policy
        response.headers["Permissions-Policy"] = "geolocation=(self), microphone=(self), camera=()"
        # Content Security Policy (allowing self and verified telemetry/tiles)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self' https:; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; "
            "style-src 'self' 'unsafe-inline' https:; "
            "img-src 'self' https: data: blob:; "
            "connect-src 'self' https:; "
            "font-src 'self' https: data:;"
        )
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Token/Window Rate Limiter preventing DoS attacks and API abuse.
    Enforces a default 120 requests/minute ceiling per IP address.
    """
    def __init__(self, app, requests_per_minute: int = 150):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.ip_history = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Exempt health checks and documentation
        path = request.url.path
        if path in ["/health", "/api/health", "/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)

        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        
        # Clean timestamps older than 60 seconds
        self.ip_history[client_ip] = [ts for ts in self.ip_history[client_ip] if now - ts < 60]

        if len(self.ip_history[client_ip]) >= self.requests_per_minute:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too Many Requests",
                    "detail": "Rate limit threshold exceeded. Please retry after 60 seconds.",
                    "status_code": 429
                },
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(self.requests_per_minute),
                    "X-RateLimit-Remaining": "0"
                }
            )

        self.ip_history[client_ip].append(now)
        response: Response = await call_next(request)
        remaining = max(0, self.requests_per_minute - len(self.ip_history[client_ip]))
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response


class PerformanceTelemetryMiddleware(BaseHTTPMiddleware):
    """
    Monitors request execution latency and attaches high-resolution
    X-Process-Time and Cache-Control headers for telemetry endpoints.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        response: Response = await call_next(request)
        process_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
        response.headers["X-Process-Time"] = f"{process_time_ms}ms"

        # Attach caching headers for read-only GET air quality routes
        if request.method == "GET" and "/api/air-quality" in request.url.path:
            response.headers["Cache-Control"] = "public, max-age=120, stale-while-revalidate=60"

        return response
