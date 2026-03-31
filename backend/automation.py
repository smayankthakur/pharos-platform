from typing import Dict, Any, List
from ai import analyze_compliance_data
from models import Alert, AIInsight
from sqlalchemy.orm import Session
import json

def run_automation_check(db: Session, user_id: int = None) -> Dict[str, Any]:
    """
    Run automated compliance checks and create alerts if risks are detected.
    
    Args:
        db: Database session
        user_id: Optional user ID for context
        
    Returns:
        Dictionary with automation results
    """
    # Get recent alerts from database
    recent_alerts = db.query(Alert).filter(
        Alert.is_resolved == False
    ).order_by(Alert.timestamp.desc()).limit(10).all()
    
    # Convert alerts to dict format
    alerts_data = []
    for alert in recent_alerts:
        alerts_data.append({
            "id": alert.id,
            "title": alert.title,
            "detail": alert.detail,
            "severity": alert.severity,
            "timestamp": alert.timestamp.isoformat() if alert.timestamp else None
        })
    
    # Analyze alerts using AI
    analysis_data = {
        "alerts": alerts_data,
        "complianceScore": 94.0,  # Default score
        "inventory": []
    }
    
    ai_result = analyze_compliance_data(analysis_data)
    
    # Check if AI detected critical risks
    critical_keywords = ["critical", "urgent", "immediate", "emergency", "recall"]
    is_critical = any(
        keyword in ai_result.get("content", "").lower() 
        for keyword in critical_keywords
    )
    
    # Create automated alert if critical risk detected
    if is_critical:
        new_alert = Alert(
            title="AI-Detected Compliance Risk",
            detail=ai_result.get("content", "")[:500],
            severity="critical",
            icon="🤖",
            user_id=user_id
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        
        return {
            "action": "create_alert",
            "severity": "critical",
            "message": "Critical compliance risk detected by AI automation",
            "alert_id": new_alert.id,
            "ai_insight": ai_result.get("content", "")[:200]
        }
    
    # Check for warning-level risks
    warning_keywords = ["warning", "attention", "review", "monitor", "expiring"]
    is_warning = any(
        keyword in ai_result.get("content", "").lower() 
        for keyword in warning_keywords
    )
    
    if is_warning:
        return {
            "action": "monitor",
            "severity": "warning",
            "message": "Potential compliance issues detected - monitoring recommended",
            "ai_insight": ai_result.get("content", "")[:200]
        }
    
    return {
        "action": "none",
        "severity": "ok",
        "message": "No critical compliance risks detected",
        "ai_insight": ai_result.get("content", "")[:200]
    }

def schedule_compliance_audit(db: Session) -> Dict[str, Any]:
    """
    Schedule automated compliance audits based on risk assessment.
    
    Args:
        db: Database session
        
    Returns:
        Dictionary with audit scheduling results
    """
    # Get unresolved alerts
    unresolved_alerts = db.query(Alert).filter(
        Alert.is_resolved == False,
        Alert.severity.in_(["critical", "warning"])
    ).count()
    
    if unresolved_alerts > 5:
        return {
            "action": "schedule_audit",
            "priority": "high",
            "message": f"High number of unresolved alerts ({unresolved_alerts}) - scheduling immediate audit",
            "audit_type": "comprehensive"
        }
    elif unresolved_alerts > 2:
        return {
            "action": "schedule_audit",
            "priority": "medium",
            "message": f"Moderate number of unresolved alerts ({unresolved_alerts}) - scheduling standard audit",
            "audit_type": "standard"
        }
    
    return {
        "action": "none",
        "priority": "low",
        "message": "Alert levels within acceptable range - no audit required",
        "audit_type": None
    }

def generate_compliance_report(db: Session) -> Dict[str, Any]:
    """
    Generate automated compliance report.
    
    Args:
        db: Database session
        
    Returns:
        Dictionary with compliance report data
    """
    # Get alert statistics
    total_alerts = db.query(Alert).count()
    critical_alerts = db.query(Alert).filter(Alert.severity == "critical").count()
    resolved_alerts = db.query(Alert).filter(Alert.is_resolved == True).count()
    
    # Calculate compliance metrics
    resolution_rate = (resolved_alerts / total_alerts * 100) if total_alerts > 0 else 100
    risk_score = (critical_alerts / total_alerts * 100) if total_alerts > 0 else 0
    
    return {
        "total_alerts": total_alerts,
        "critical_alerts": critical_alerts,
        "resolved_alerts": resolved_alerts,
        "resolution_rate": round(resolution_rate, 2),
        "risk_score": round(risk_score, 2),
        "compliance_status": "Good" if risk_score < 10 else "Needs Attention" if risk_score < 30 else "Critical"
    }
