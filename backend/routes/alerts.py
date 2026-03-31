from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db import get_db
from models import Alert
from auth import get_current_user
from typing import Optional

router = APIRouter(prefix="/alerts", tags=["alerts"])

class AlertCreate(BaseModel):
    title: str
    detail: Optional[str] = None
    severity: str
    icon: Optional[str] = None

class AlertResponse(BaseModel):
    id: int
    title: str
    detail: Optional[str]
    severity: str
    icon: Optional[str]
    timestamp: str
    is_resolved: bool

@router.post("/", response_model=AlertResponse)
async def create_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new alert.
    """
    new_alert = Alert(
        title=alert.title,
        detail=alert.detail,
        severity=alert.severity,
        icon=alert.icon,
        user_id=current_user.id
    )
    
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    
    return {
        "id": new_alert.id,
        "title": new_alert.title,
        "detail": new_alert.detail,
        "severity": new_alert.severity,
        "icon": new_alert.icon,
        "timestamp": new_alert.timestamp.strftime("%H:%M") if new_alert.timestamp else "00:00",
        "is_resolved": new_alert.is_resolved
    }

@router.put("/{alert_id}/resolve")
async def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Mark an alert as resolved.
    """
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_resolved = True
    db.commit()
    
    return {"message": "Alert resolved successfully"}

@router.delete("/{alert_id}")
async def delete_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete an alert.
    """
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    db.delete(alert)
    db.commit()
    
    return {"message": "Alert deleted successfully"}
