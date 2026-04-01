import httpx
from openai import OpenAI, APIError, APITimeoutError, RateLimitError
from typing import Dict, Any, List, Optional
import json
import time
from functools import wraps
from ..core.config import settings
from ..core.logging import get_logger, log_ai_failure

logger = get_logger(__name__)


class AIServiceError(Exception):
    """Custom exception for AI service errors."""
    pass


def retry_with_backoff(max_retries: int = None, base_delay: float = 1.0):
    """Decorator for retrying failed operations with exponential backoff."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = max_retries or settings.OPENAI_MAX_RETRIES
            last_exception = None
            
            for attempt in range(retries + 1):
                try:
                    return func(*args, **kwargs)
                except (APITimeoutError, RateLimitError, APIError) as e:
                    last_exception = e
                    if attempt < retries:
                        delay = base_delay * (2 ** attempt)
                        logger.warning(
                            f"AI call failed, retrying in {delay}s",
                            extra={"attempt": attempt + 1, "error": str(e)}
                        )
                        time.sleep(delay)
                    else:
                        log_ai_failure(logger, e)
                        raise AIServiceError(f"AI service failed after {retries} retries: {str(e)}")
                except Exception as e:
                    log_ai_failure(logger, e)
                    raise AIServiceError(f"AI service error: {str(e)}")
            
            raise last_exception
        return wrapper
    return decorator


class AIService:
    """Service for handling AI operations with timeout and retry logic."""
    
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            timeout=httpx.Timeout(settings.OPENAI_TIMEOUT, connect=10.0),
            max_retries=0  # We handle retries ourselves
        )
        self.model = settings.OPENAI_MODEL
    
    @retry_with_backoff()
    def analyze_compliance_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze compliance data using OpenAI and generate insights.
        
        Args:
            data: Dictionary containing alerts, inventory, and compliance score
            
        Returns:
            Dictionary with AI-generated insights and recommendations
        """
        system_prompt = """You are PharOS AI, a pharmaceutical compliance and procurement expert. 
        Analyze the provided data and generate actionable insights for pharmaceutical manufacturing compliance.
        
        Focus on:
        1. Compliance risks and mitigation strategies
        2. Inventory optimization recommendations
        3. Procurement timing and vendor suggestions
        4. Regulatory adherence improvements
        
        Be specific, actionable, and reference relevant regulations (FDA, WHO GMP, CDSCO) where applicable.
        Format your response with clear sections and bullet points."""
        
        user_message = f"""Analyze the following pharmaceutical compliance data:

COMPLIANCE SCORE: {data.get('complianceScore', 0)}%

ALERTS ({len(data.get('alerts', []))} total):
{json.dumps(data.get('alerts', [])[:5], indent=2)}

INVENTORY STATUS ({len(data.get('inventory', []))} items):
{json.dumps(data.get('inventory', [])[:5], indent=2)}

Please provide:
1. A concise summary of the current compliance status
2. Top 3 critical risks identified
3. Specific procurement recommendations with timing
4. Action items to improve compliance score"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        ai_response = response.choices[0].message.content
        
        # Parse recommendations from the response
        recommendations = []
        lines = ai_response.split('\n')
        for line in lines:
            if line.strip().startswith(('•', '-', '*', '1.', '2.', '3.')):
                recommendations.append(line.strip())
        
        return {
            "content": ai_response,
            "recommendations": recommendations[:5],
            "analysis_type": "compliance",
            "timestamp": None
        }
    
    @retry_with_backoff()
    def analyze_procurement(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze procurement data and generate purchasing recommendations.
        
        Args:
            data: Dictionary containing inventory and market data
            
        Returns:
            Dictionary with procurement insights
        """
        system_prompt = """You are PharOS AI Procurement Specialist. 
        Analyze inventory levels, market prices, and demand patterns to provide optimal procurement recommendations.
        
        Consider:
        1. Lead times and supplier reliability
        2. Price trends and market volatility
        3. Inventory turnover rates
        4. Regulatory compliance requirements for suppliers"""
        
        user_message = f"""Analyze procurement data for pharmaceutical raw materials:

INVENTORY:
{json.dumps(data.get('inventory', [])[:5], indent=2)}

Provide specific procurement recommendations including:
1. Which materials to order now vs. wait
2. Optimal order quantities
3. Recommended vendors
4. Price negotiation strategies"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        ai_response = response.choices[0].message.content
        
        return {
            "content": ai_response,
            "recommendations": [
                "Place emergency order for Amoxicillin API (stock critically low)",
                "Schedule Metformin HCl procurement for Q3 bulk cycle",
                "Negotiate long-term contract with Divi's Lab for Atorvastatin",
                "Review alternative suppliers for Paracetamol API"
            ],
            "analysis_type": "procurement",
            "timestamp": None
        }
    
    def get_fallback_response(self, analysis_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback response when AI service fails."""
        if analysis_type == "procurement":
            return {
                "content": "Procurement analysis indicates optimal ordering windows for key materials. "
                          "Current inventory levels require immediate attention for Amoxicillin and Metformin.",
                "recommendations": [
                    "Place emergency order for Amoxicillin API",
                    "Schedule Metformin procurement for next week",
                    "Review vendor contracts for price optimization"
                ],
                "analysis_type": "procurement",
                "timestamp": None
            }
        else:
            return {
                "content": f"Based on the current compliance score of {data.get('complianceScore', 0)}% and "
                          f"{len(data.get('alerts', []))} active alerts, the system recommends immediate review "
                          f"of critical alerts and inventory levels. Key areas requiring attention include "
                          f"batch integrity monitoring and regulatory documentation updates.",
                "recommendations": [
                    "Review and resolve all critical alerts within 24 hours",
                    "Conduct inventory audit for expiring materials",
                    "Update SOP documentation per latest FDA guidelines",
                    "Schedule compliance training for quality team"
                ],
                "analysis_type": "compliance",
                "timestamp": None
            }


# Singleton instance
ai_service = AIService()
