# PharOS — AI Compliance Command Center

A production-ready SaaS platform for pharmaceutical compliance monitoring with AI-powered insights.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- OpenAI API Key (optional, for AI features)

### Option 1: Run with Docker (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   cd pharos
   ```

2. **Set up environment variables (optional):**
   ```bash
   # For AI features, set your OpenAI API key
   export OPENAI_API_KEY=sk-your-key-here
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

5. **Login with demo credentials:**
   - Email: admin@pharos.com
   - Password: admin123

### Option 2: Run Locally (Development)

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd pharos/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL:**
   ```bash
   # Install PostgreSQL and create database
   createdb pharos
   ```

5. **Set environment variables:**
   ```bash
   export DATABASE_URL=postgresql://pharos:pharos123@localhost:5432/pharos
   export SECRET_KEY=your-secret-key
   export OPENAI_API_KEY=sk-your-key-here  # Optional
   ```

6. **Run the backend:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd pharos/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

4. **Run the frontend:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000

## 📁 Project Structure

```
pharos/
├── frontend/                 # Next.js 14 Frontend
│   ├── app/                 # App Router pages
│   │   ├── (auth)/         # Authentication pages
│   │   └── (dashboard)/    # Dashboard pages
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   └── dashboard/     # Dashboard components
│   ├── store/             # Zustand state management
│   ├── lib/               # API client
│   └── types/             # TypeScript types
│
├── backend/                # FastAPI Backend
│   ├── routes/            # API routes
│   │   ├── auth.py       # Authentication
│   │   ├── dashboard.py  # Dashboard data
│   │   ├── alerts.py     # Alerts management
│   │   └── ai.py         # AI analysis
│   ├── models.py          # Database models
│   ├── db.py              # Database configuration
│   ├── auth.py            # JWT authentication
│   ├── ai.py              # AI engine
│   ├── automation.py      # Automation engine
│   └── main.py            # FastAPI application
│
├── docker-compose.yml      # Docker orchestration
└── README.md              # This file
```

## 🔧 Features

### Frontend
- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS with custom glassmorphism design
- ✅ Zustand for state management
- ✅ Axios for API communication
- ✅ Responsive design
- ✅ Real-time dashboard updates

### Backend
- ✅ FastAPI with async support
- ✅ SQLAlchemy ORM
- ✅ PostgreSQL database
- ✅ JWT authentication
- ✅ OpenAI integration
- ✅ Automated compliance checks
- ✅ RESTful API endpoints

### AI Features
- ✅ Compliance analysis
- ✅ Procurement recommendations
- ✅ Risk detection
- ✅ Automated alert generation

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Dashboard
- `GET /dashboard` - Get dashboard data
- `GET /alerts` - Get all alerts

### Alerts
- `POST /alerts/` - Create new alert
- `PUT /alerts/{id}/resolve` - Resolve alert
- `DELETE /alerts/{id}` - Delete alert

### AI
- `POST /ai/analyze` - Analyze compliance data
- `GET /ai/insights` - Get AI insights
- `POST /ai/automation/check` - Run automation checks

## 🗄️ Database Models

- **User** - User accounts and authentication
- **Company** - Company information
- **Alert** - Compliance alerts
- **AIInsight** - AI-generated insights
- **InventoryItem** - Inventory tracking

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention via SQLAlchemy ORM

## 🎨 Design System

The application uses a custom glassmorphism design with:
- Dark navy color palette
- Cyan accent colors
- Glass-effect cards with backdrop blur
- Animated backgrounds with grid patterns
- Smooth transitions and animations

## 📊 Dashboard Features

- **KPI Cards** - Active SKUs, expiring items, CAPAs, yield
- **Batch Health Gauge** - Visual batch integrity indicator
- **Risk Heatmap** - Regulatory risk matrix
- **Market Trends** - API price trends
- **Inventory Table** - Real-time inventory status
- **Alert Feed** - Live compliance alerts
- **AI Insights** - AI-powered recommendations

## 🤖 AI Integration

The AI engine uses OpenAI's GPT-4.1-mini model to:
- Analyze compliance data
- Generate procurement recommendations
- Detect risks and anomalies
- Provide actionable insights

## 🔄 Automation

The automation engine:
- Monitors compliance alerts
- Detects critical risks via AI
- Creates automated alerts
- Schedules compliance audits
- Generates compliance reports

## 📝 Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `OPENAI_API_KEY` - OpenAI API key (optional)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Access PostgreSQL
docker exec -it pharos-postgres psql -U pharos
```

## 🛠️ Development

### Adding New Features

1. **Frontend Components:**
   - Add components to `frontend/components/`
   - Create pages in `frontend/app/`
   - Update store in `frontend/store/useStore.ts`

2. **Backend Endpoints:**
   - Add routes to `backend/routes/`
   - Update models in `backend/models.py`
   - Register routes in `backend/main.py`

3. **Database Changes:**
   - Update models in `backend/models.py`
   - Restart backend to apply changes

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues and questions, please contact the development team.

---

**PharOS** — AI Compliance Command Center
Built with Next.js, FastAPI, and OpenAI
