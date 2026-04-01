# PharOS Platform - Production Architecture

## Overview

This document outlines the production-grade architecture for the PharOS AI Compliance Command Center platform.

## Architecture Stack

- **Frontend**: Next.js 14 (App Router, TypeScript)
- **Backend**: FastAPI (Python 3.11)
- **Database**: PostgreSQL (Supabase)
- **AI**: OpenAI API (GPT-4.1-mini)
- **Deployment**: Railway (Backend) + Vercel (Frontend)

## Project Structure

```
pharos/
├── backend/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py          # Pydantic BaseSettings configuration
│   │   ├── database.py        # Database session management
│   │   ├── logging.py         # Structured JSON logging
│   │   └── middleware.py      # Error handling & request logging
│   ├── services/
│   │   ├── __init__.py
│   │   └── ai_service.py      # AI service with timeout/retry logic
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── common.py          # Standardized API response schemas
│   │   ├── ai.py              # AI analysis request/response schemas
│   │   └── auth.py            # Authentication schemas
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── ai.py              # AI analysis endpoints
│   │   ├── dashboard.py       # Dashboard data endpoints
│   │   └── alerts.py          # Alert management endpoints
│   ├── alembic/
│   │   ├── env.py             # Alembic environment configuration
│   │   ├── script.py.mako     # Migration template
│   │   └── versions/          # Migration files
│   ├── alembic.ini            # Alembic configuration
│   ├── main.py                # FastAPI application entry point
│   ├── auth.py                # JWT authentication logic
│   ├── models.py              # SQLAlchemy models
│   ├── automation.py          # Automation logic
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Production Dockerfile
│   └── .env.example           # Environment variables template
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── alerts/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AIInsightCard.tsx
│   │   │   ├── AlertFeed.tsx
│   │   │   └── KpiCard.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       └── Sidebar.tsx
│   ├── lib/
│   │   └── api.ts             # Axios instance with interceptors
│   ├── store/
│   │   └── useStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile             # Production Dockerfile
│   └── .env.example           # Environment variables template
├── docker-compose.yml         # Local development setup
└── PRODUCTION_ARCHITECTURE.md # This file
```

## Key Improvements

### 1. Backend Architecture

#### Configuration Management
- **Pydantic BaseSettings**: Centralized configuration with validation
- **Fail-fast behavior**: Application won't start without required environment variables
- **Type safety**: All configuration values are typed and validated

#### Error Handling
- **Centralized middleware**: All errors caught and returned in standardized format
- **Structured logging**: JSON-formatted logs for better observability
- **Request/Response logging**: Full request lifecycle tracking

#### AI Service
- **Timeout handling**: 30-second timeout for OpenAI calls
- **Retry logic**: Exponential backoff with 3 retries
- **Fallback responses**: Graceful degradation when AI service fails
- **Separation of concerns**: AI logic isolated in service layer

#### Database
- **Session management**: Proper session lifecycle with automatic cleanup
- **Connection pooling**: Configured for production workloads
- **Alembic migrations**: Version-controlled database schema changes

#### Authentication
- **JWT tokens**: Secure token-based authentication
- **Token validation**: Proper verification with meaningful error messages
- **User status checks**: Active/inactive user handling

### 2. Frontend Architecture

#### API Integration
- **Axios instance**: Centralized HTTP client configuration
- **Automatic token attachment**: JWT tokens added to all requests
- **Response interceptors**: Standardized error handling
- **Timeout configuration**: 30-second request timeout

#### Error Handling
- **Global error handling**: All API errors caught and processed
- **User-friendly messages**: Technical errors converted to user-friendly messages
- **Authentication redirects**: Automatic redirect on 401 errors

### 3. API Contract

All API responses follow a standardized format:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "error": "Error message here",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 4. Deployment

#### Backend (Railway)
- **Dockerfile**: Multi-stage build for optimized image size
- **Health checks**: Built-in health endpoint for monitoring
- **Environment variables**: All configuration via environment variables
- **Port configuration**: Dynamic port binding via `$PORT` environment variable

#### Frontend (Vercel)
- **Dockerfile**: Multi-stage build with standalone output
- **Environment variables**: Build-time and runtime configuration
- **Health checks**: Built-in health monitoring

## Environment Variables

### Backend Required Variables

```bash
DATABASE_URL=postgresql://user:password@host:port/database
OPENAI_API_KEY=sk-your-openai-api-key
SECRET_KEY=your-secret-key-at-least-32-characters
```

### Backend Optional Variables

```bash
ALLOWED_ORIGINS=["https://pharos-platform.vercel.app"]
APP_NAME=PharOS API
APP_VERSION=1.0.0
DEBUG=false
OPENAI_MODEL=gpt-4.1-mini
OPENAI_TIMEOUT=30
OPENAI_MAX_RETRIES=3
LOG_LEVEL=INFO
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Frontend Required Variables

```bash
NEXT_PUBLIC_API_URL=https://pharos-api.railway.app
```

## Local Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

## Deployment Guide

### Backend (Railway)

1. **Connect Repository**: Link your GitHub repository to Railway
2. **Configure Environment Variables**:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SECRET_KEY`: A secure random string (min 32 characters)
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL
3. **Deploy**: Railway will automatically build and deploy using the Dockerfile

### Frontend (Vercel)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Configure Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
4. **Deploy**: Vercel will automatically build and deploy

## Database Migrations

### Create a Migration

```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations

```bash
alembic upgrade head
```

### Rollback Migration

```bash
alembic downgrade -1
```

## Monitoring & Logging

### Structured Logging

All logs are output in JSON format for easy parsing:

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "ERROR",
  "logger": "backend.services.ai_service",
  "message": "AI Service Failure",
  "module": "ai_service",
  "function": "analyze_compliance_data",
  "line": 45,
  "error_type": "APITimeoutError",
  "error_message": "Request timed out"
}
```

### Health Endpoints

- **Backend**: `GET /health` - Returns `{"status": "healthy"}`
- **Frontend**: Built-in health check via Docker

## Security Considerations

1. **CORS**: Only allowed origins can access the API
2. **JWT Tokens**: Secure token-based authentication with expiration
3. **Password Hashing**: Bcrypt for password storage
4. **Environment Variables**: Sensitive data never hardcoded
5. **Non-root Containers**: Docker containers run as non-root user
6. **Input Validation**: All inputs validated using Pydantic schemas

## Troubleshooting

### Backend Won't Start

1. Check environment variables are set correctly
2. Verify database connection string is correct
3. Ensure OpenAI API key is valid
4. Check logs for specific error messages

### Frontend Can't Connect to Backend

1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check CORS configuration in backend
3. Ensure backend is running and accessible
4. Check browser console for specific error messages

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check connection string format
3. Ensure database exists
4. Verify user has correct permissions

## Performance Optimization

1. **Connection Pooling**: Database connections are pooled for efficiency
2. **Request Timeouts**: All external API calls have timeouts
3. **Retry Logic**: Failed requests are retried with exponential backoff
4. **Health Checks**: Built-in health checks for monitoring
5. **Structured Logging**: Efficient JSON logging for production

## Support

For issues or questions, please refer to the project documentation or contact the development team.
