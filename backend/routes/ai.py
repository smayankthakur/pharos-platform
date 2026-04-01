from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from ..core.database import get_db
from ..core.logging import get_logger
from ..models import AIInsight
from ..auth import get_current_user
from ..services.ai_service import ai_service, AIServiceError
from ..schemas.ai import AnalysisRequest, AnalysisResponse, InsightResponse
from ..schemas.common import success_response, error_response

router = APIRouter(prefix="/ai", tags=["ai"])
logger = get_logger(__name__)


@router.post("/analyze")
async def analyze(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Analyze compliance data using AI and generate insights.
    """
    try:
        # Prepare data for analysis
        analysis_data = {
            "alerts": request.alerts or [],
            "inventory": request.inventory or [],
            "complianceScore": request.complianceScore or 94.0
        }
        
        # Choose analysis function based on type
        try:
            if request.analysis_type == "procurement":
                result = ai_service.analyze_procurement(analysis_data)
            else:
                result = ai_service.analyze_compliance_data(analysis_data)
        except AIServiceError as e:
            logger.warning(f"AI service failed, using fallback: {e}")
            result = ai_service.get_fallback_response(request.analysis_type or "compliance", analysis_data)
        
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
        
        return success_response({
            "id": new_insight.id,
            "content": result["content"],
            "recommendations": result["recommendations"],
            "timestamp": new_insight.timestamp.isoformat() if new_insight.timestamp else "",
            "analysis_type": result["analysis_type"]
        })
        
    except Exception as e:
        logger.error(f"Error in AI analysis: {e}")
        return error_response(str(e))


@router.get("/insights")
async def get_insights(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    limit: int = 10
):
    """
    Get recent AI insights.
    """
    try:
        insights = db.query(AIInsight).filter(
            AIInsight.user_id == current_user.id
        ).order_by(AIInsight.timestamp.desc()).limit(limit).all()
        
        insights_data = []
        for insight in insights:
            recommendations = []
            try:
                recommendations = json.loads(insight.recommendations) if insight.recommendations else []
            except json.JSONDecodeError:
                recommendations = []
            
            insights_data.append({
                "id": insight.id,
                "content": insight.content,
                "recommendations": recommendations,
                "timestamp": insight.timestamp.isoformat() if insight.timestamp else "",
                "analysis_type": insight.analysis_type
            })
        
        return success_response(insights_data)
        
    except Exception as e:
        logger.error(f"Error fetching insights: {e}")
        return error_response(str(e))


@router.post("/automation/check")
async def run_automation(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Run automated compliance checks.
    """
    try:
        from ..automation import run_automation_check
        
        result = run_automation_check(db, current_user.id)
        return success_response(result)
        
    except Exception as e:
        logger.error(f"Error running automation: {e}")
        return error_response(str(e))
