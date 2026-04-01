from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class AnalysisRequest(BaseModel):
    """Request schema for AI analysis."""
    alerts: Optional[List[Dict[str, Any]]] = Field(default=None, description="List of alerts")
    inventory: Optional[List[Dict[str, Any]]] = Field(default=None, description="List of inventory items")
    complianceScore: Optional[float] = Field(default=None, description="Current compliance score")
    analysis_type: Optional[str] = Field(default="compliance", description="Type of analysis")


class AnalysisResponse(BaseModel):
    """Response schema for AI analysis."""
    id: int = Field(..., description="Insight ID")
    content: str = Field(..., description="AI-generated analysis content")
    recommendations: List[str] = Field(..., description="List of recommendations")
    timestamp: str = Field(..., description="Timestamp of analysis")
    analysis_type: str = Field(..., description="Type of analysis performed")


class InsightResponse(BaseModel):
    """Response schema for AI insights."""
    id: int = Field(..., description="Insight ID")
    content: str = Field(..., description="AI-generated analysis content")
    recommendations: List[str] = Field(..., description="List of recommendations")
    timestamp: str = Field(..., description="Timestamp of analysis")
    analysis_type: str = Field(..., description="Type of analysis performed")
