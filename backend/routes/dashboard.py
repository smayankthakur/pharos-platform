from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models import Alert, InventoryItem
from auth import get_current_user
from typing import List, Dict, Any

router = APIRouter(tags=["dashboard"])

@router.get("/dashboard")
async def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get dashboard data including KPIs, batch health, alerts, and inventory.
    """
    # Get alerts
    alerts = db.query(Alert).filter(
        Alert.is_resolved == False
    ).order_by(Alert.timestamp.desc()).limit(10).all()
    
    alerts_data = []
    for alert in alerts:
        alerts_data.append({
            "id": alert.id,
            "title": alert.title,
            "detail": alert.detail,
            "severity": alert.severity,
            "icon": alert.icon,
            "timestamp": alert.timestamp.strftime("%H:%M") if alert.timestamp else "00:00"
        })
    
    # Get inventory items
    inventory_items = db.query(InventoryItem).order_by(InventoryItem.updated_at.desc()).limit(5).all()
    
    inventory_data = []
    for item in inventory_items:
        inventory_data.append({
            "id": item.id,
            "sku": item.sku,
            "name": item.name,
            "batch": item.batch,
            "stock": item.stock,
            "expiry": item.expiry,
            "status": item.status,
            "trend": [80, 85, 78, 90, 88, 92, 87, 91, 94, 96]  # Sample trend data
        })
    
    # If no inventory data, use sample data
    if not inventory_data:
        inventory_data = [
            {
                "id": 1,
                "sku": "SKU-PAR-001",
                "name": "Paracetamol API",
                "batch": "BT-1871",
                "stock": 1240,
                "expiry": "2025-12-14",
                "status": "GMP Passed",
                "trend": [80, 85, 78, 90, 88, 92, 87, 91, 94, 96]
            },
            {
                "id": 2,
                "sku": "SKU-MET-012",
                "name": "Metformin HCl",
                "batch": "BT-1862",
                "stock": 880,
                "expiry": "2025-07-03",
                "status": "Expiring Soon",
                "trend": [95, 92, 88, 84, 82, 86, 83, 80, 78, 80]
            },
            {
                "id": 3,
                "sku": "SKU-AMX-007",
                "name": "Amoxicillin Tri.",
                "batch": "BT-1858",
                "stock": 320,
                "expiry": "2025-06-28",
                "status": "Recall Risk",
                "trend": [70, 65, 60, 58, 55, 52, 50, 46, 45, 44]
            },
            {
                "id": 4,
                "sku": "SKU-ATO-019",
                "name": "Atorvastatin Ca.",
                "batch": "BT-1874",
                "stock": 2100,
                "expiry": "2026-03-20",
                "status": "GMP Passed",
                "trend": [88, 90, 89, 92, 94, 91, 93, 95, 94, 96]
            },
            {
                "id": 5,
                "sku": "SKU-OMP-022",
                "name": "Omeprazole EP",
                "batch": "BT-1876",
                "stock": 560,
                "expiry": "2026-01-09",
                "status": "QC In-Progress",
                "trend": [75, 80, 82, 78, 80, 84, 82, 86, 85, 83]
            }
        ]
    
    # If no alerts, use sample data
    if not alerts_data:
        alerts_data = [
            {
                "id": 1,
                "title": "Amoxicillin BT-1858 — Recall Advisory",
                "detail": "CDSCO Circular 22/2024 · Batch below spec threshold",
                "severity": "critical",
                "icon": "🚨",
                "timestamp": "09:14"
            },
            {
                "id": 2,
                "title": "Temperature excursion — Cold Store C-02",
                "detail": "Recorded 8.4°C for 23 min · FDA 21 CFR §211.68",
                "severity": "critical",
                "icon": "⚠️",
                "timestamp": "11:31"
            },
            {
                "id": 3,
                "title": "QC Deviation — BT-2024-1873 assay",
                "detail": "Result 97.3% vs spec 98–102% · CAPA required",
                "severity": "critical",
                "icon": "🔴",
                "timestamp": "12:02"
            },
            {
                "id": 4,
                "title": "Metformin inventory — 30-day low threshold",
                "detail": "880 kg remaining · Reorder point: 750 kg",
                "severity": "warning",
                "icon": "🟡",
                "timestamp": "13:45"
            },
            {
                "id": 5,
                "title": "SOP-QC-047 review overdue by 3 days",
                "detail": "Reviewer: Priya Menon · WHO GMP Section 15",
                "severity": "warning",
                "icon": "📋",
                "timestamp": "14:00"
            },
            {
                "id": 6,
                "title": "AI Procurement: Price drop detected",
                "detail": "Atorvastatin API · ₹3,870 → ₹3,710 (-4.1%) · Vendor: Divi's Lab",
                "severity": "info",
                "icon": "🔵",
                "timestamp": "14:28"
            },
            {
                "id": 7,
                "title": "Batch BT-2024-1871 — GMP Certificate issued",
                "detail": "Paracetamol 500mg Tablet · WHO Schedule M",
                "severity": "ok",
                "icon": "✅",
                "timestamp": "14:31"
            }
        ]
    
    return {
        "kpis": [
            {"label": "Active SKUs", "value": "247", "trend": "cyan"},
            {"label": "Expiring 7d", "value": "18", "trend": "warn"},
            {"label": "Open CAPAs", "value": "4", "trend": "down"},
            {"label": "Yield Today", "value": "97.4%", "trend": "up"}
        ],
        "batchHealth": {
            "overall": 87,
            "batches": [
                {"id": "BT-2024-1871", "name": "Paracetamol", "percentage": 96, "status": "ok"},
                {"id": "BT-2024-1872", "name": "Metformin", "percentage": 88, "status": "ok"},
                {"id": "BT-2024-1873", "name": "Amoxicillin", "percentage": 71, "status": "warn"},
                {"id": "BT-2024-1874", "name": "Atorvastatin", "percentage": 44, "status": "crit"}
            ]
        },
        "alerts": alerts_data,
        "inventory": inventory_data,
        "complianceScore": 94
    }

@router.get("/alerts")
async def get_alerts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get all alerts.
    """
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).all()
    
    alerts_data = []
    for alert in alerts:
        alerts_data.append({
            "id": alert.id,
            "title": alert.title,
            "detail": alert.detail,
            "severity": alert.severity,
            "icon": alert.icon,
            "timestamp": alert.timestamp.strftime("%H:%M") if alert.timestamp else "00:00"
        })
    
    # If no alerts in database, return sample data
    if not alerts_data:
        alerts_data = [
            {
                "id": 1,
                "title": "Amoxicillin BT-1858 — Recall Advisory",
                "detail": "CDSCO Circular 22/2024 · Batch below spec threshold",
                "severity": "critical",
                "icon": "🚨",
                "timestamp": "09:14"
            },
            {
                "id": 2,
                "title": "Temperature excursion — Cold Store C-02",
                "detail": "Recorded 8.4°C for 23 min · FDA 21 CFR §211.68",
                "severity": "critical",
                "icon": "⚠️",
                "timestamp": "11:31"
            },
            {
                "id": 3,
                "title": "QC Deviation — BT-2024-1873 assay",
                "detail": "Result 97.3% vs spec 98–102% · CAPA required",
                "severity": "critical",
                "icon": "🔴",
                "timestamp": "12:02"
            },
            {
                "id": 4,
                "title": "Metformin inventory — 30-day low threshold",
                "detail": "880 kg remaining · Reorder point: 750 kg",
                "severity": "warning",
                "icon": "🟡",
                "timestamp": "13:45"
            },
            {
                "id": 5,
                "title": "SOP-QC-047 review overdue by 3 days",
                "detail": "Reviewer: Priya Menon · WHO GMP Section 15",
                "severity": "warning",
                "icon": "📋",
                "timestamp": "14:00"
            },
            {
                "id": 6,
                "title": "AI Procurement: Price drop detected",
                "detail": "Atorvastatin API · ₹3,870 → ₹3,710 (-4.1%) · Vendor: Divi's Lab",
                "severity": "info",
                "icon": "🔵",
                "timestamp": "14:28"
            },
            {
                "id": 7,
                "title": "Batch BT-2024-1871 — GMP Certificate issued",
                "detail": "Paracetamol 500mg Tablet · WHO Schedule M",
                "severity": "ok",
                "icon": "✅",
                "timestamp": "14:31"
            }
        ]
    
    return alerts_data
