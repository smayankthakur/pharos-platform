from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db import get_db
from models import AIInsight
from auth import get_current_user
from ai import analyze_compliance_data, analyze_procurement
from typing import Dict, Any, List, Optional
import json

router = APIRouter(prefix="/ai", tags=["ai"])

class AnalysisRequest(BaseModel):
    alerts: Optional[List[Dict[str, Any]]] = None
    inventory: Optional[List[Dict[str, Any]]] = None
    complianceScore: Optional[float] = None
    analysis_type: Optional[str] = "compliance"

class AnalysisResponse(BaseModel):
    id: int
    content: str
    recommendations: List[str]
    timestamp: str
    analysis_type: str

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Analyze compliance data using AI and generate insights.
    """
    # Prepare data for analysis
    analysis_data = {
        "alerts": request.alerts or [],
        "inventory": request.inventory or [],
        "complianceScore": request.complianceScore or 94.0
    }
    
    # Choose analysis function based on type
    if request.analysis_type == "procurement":
        result = analyze_procurement(analysis_data)
    else:
        result = analyze_compliance_data(analysis_data)
    
    # Save insight to database
    new_insight = AIInsight(
        content=result["content"],
        recommendations=json.dumps(result["recommendations"]),
        user_id=current_user.id,
        analysis_type=result["analysis_type"]
    )
    
    db.add(new_insight)
    db.commit()
    db.refresh(new_insight)
    
    return {
        "id": new_insight.id,
        "content": result["content"],
        "recommendations": result["recommendations"],
        "timestamp": new_insight.timestamp.isoformat() if new_insight.timestamp else "",
        "analysis_type": result["analysis_type"]
    }

@router.get("/insights")
async def get_insights(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    limit: int = 10
):
    """
    Get recent AI insights.
    """
    insights = db.query(AIInsight).filter(
        AIInsight.user_id == current_user.id
    ).order_by(AIInsight.timestamp.desc()).limit(limit).all()
    
    insights_data = []
    for insight in insights:
        recommendations = []
        try:
            recommendations = json.loads(insight.recommendations) if insight.recommendations else []
        except:
            recommendations = []
        
        insights_data.append({
            "id": insight.id,
            "content": insight.content,
            "recommendations": recommendations,
            "timestamp": insight.timestamp.isoformat() if insight.timestamp else "",
            "analysis_type": insight.analysis_type
        })
    
    return insights_data

@router.post("/automation/check")
async def run_automation(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Run automated compliance checks.
    """
    from automation import run_automation_check
    
    result = run_automation_check(db, current_user.id)
    return result
