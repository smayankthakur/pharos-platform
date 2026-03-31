from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db import engine, Base, get_db
from models import User, Alert, AIInsight, InventoryItem
from auth import get_password_hash
from routes import auth, dashboard, alerts, ai
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Create demo user if not exists
    db = next(get_db())
    try:
        demo_user = db.query(User).filter(User.email == "admin@pharos.com").first()
        if not demo_user:
            demo_user = User(
                email="admin@pharos.com",
                name="Admin User",
                hashed_password=get_password_hash("admin123"),
                company="PharOS Pharmaceuticals"
            )
            db.add(demo_user)
            db.commit()
            print("Demo user created: admin@pharos.com / admin123")
        
        # Create sample alerts if none exist
        alert_count = db.query(Alert).count()
        if alert_count == 0:
            sample_alerts = [
                Alert(
                    title="Amoxicillin BT-1858 — Recall Advisory",
                    detail="CDSCO Circular 22/2024 · Batch below spec threshold",
                    severity="critical",
                    icon="🚨",
                    user_id=demo_user.id
                ),
                Alert(
                    title="Temperature excursion — Cold Store C-02",
                    detail="Recorded 8.4°C for 23 min · FDA 21 CFR §211.68",
                    severity="critical",
                    icon="⚠️",
                    user_id=demo_user.id
                ),
                Alert(
                    title="QC Deviation — BT-2024-1873 assay",
                    detail="Result 97.3% vs spec 98–102% · CAPA required",
                    severity="critical",
                    icon="🔴",
                    user_id=demo_user.id
                ),
                Alert(
                    title="Metformin inventory — 30-day low threshold",
                    detail="880 kg remaining · Reorder point: 750 kg",
                    severity="warning",
                    icon="🟡",
                    user_id=demo_user.id
                ),
                Alert(
                    title="SOP-QC-047 review overdue by 3 days",
                    detail="Reviewer: Priya Menon · WHO GMP Section 15",
                    severity="warning",
                    icon="📋",
                    user_id=demo_user.id
                ),
                Alert(
                    title="AI Procurement: Price drop detected",
                    detail="Atorvastatin API · ₹3,870 → ₹3,710 (-4.1%) · Vendor: Divi's Lab",
                    severity="info",
                    icon="🔵",
                    user_id=demo_user.id
                ),
                Alert(
                    title="Batch BT-2024-1871 — GMP Certificate issued",
                    detail="Paracetamol 500mg Tablet · WHO Schedule M",
                    severity="ok",
                    icon="✅",
                    user_id=demo_user.id
                )
            ]
            db.add_all(sample_alerts)
            db.commit()
            print("Sample alerts created")
        
        # Create sample inventory if none exists
        inventory_count = db.query(InventoryItem).count()
        if inventory_count == 0:
            sample_inventory = [
                InventoryItem(
                    sku="SKU-PAR-001",
                    name="Paracetamol API",
                    batch="BT-1871",
                    stock=1240,
                    expiry="2025-12-14",
                    status="GMP Passed"
                ),
                InventoryItem(
                    sku="SKU-MET-012",
                    name="Metformin HCl",
                    batch="BT-1862",
                    stock=880,
                    expiry="2025-07-03",
                    status="Expiring Soon"
                ),
                InventoryItem(
                    sku="SKU-AMX-007",
                    name="Amoxicillin Tri.",
                    batch="BT-1858",
                    stock=320,
                    expiry="2025-06-28",
                    status="Recall Risk"
                ),
                InventoryItem(
                    sku="SKU-ATO-019",
                    name="Atorvastatin Ca.",
                    batch="BT-1874",
                    stock=2100,
                    expiry="2026-03-20",
                    status="GMP Passed"
                ),
                InventoryItem(
                    sku="SKU-OMP-022",
                    name="Omeprazole EP",
                    batch="BT-1876",
                    stock=560,
                    expiry="2026-01-09",
                    status="QC In-Progress"
                )
            ]
            db.add_all(sample_inventory)
            db.commit()
            print("Sample inventory created")
            
    finally:
        db.close()
    
    yield

app = FastAPI(
    title="PharOS API",
    description="AI Compliance Command Center API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)
app.include_router(ai.router)

@app.get("/")
async def root():
    return {
        "message": "PharOS API - AI Compliance Command Center",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
