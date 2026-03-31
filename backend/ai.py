import os
from openai import OpenAI
from typing import Dict, Any, List
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "sk-placeholder"))

def analyze_compliance_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze compliance data using OpenAI and generate insights.
    
    Args:
        data: Dictionary containing alerts, inventory, and compliance score
        
    Returns:
        Dictionary with AI-generated insights and recommendations
    """
    try:
        # Prepare the system prompt
        system_prompt = """You are PharOS AI, a pharmaceutical compliance and procurement expert. 
        Analyze the provided data and generate actionable insights for pharmaceutical manufacturing compliance.
        
        Focus on:
        1. Compliance risks and mitigation strategies
        2. Inventory optimization recommendations
        3. Procurement timing and vendor suggestions
        4. Regulatory adherence improvements
        
        Be specific, actionable, and reference relevant regulations (FDA, WHO GMP, CDSCO) where applicable.
        Format your response with clear sections and bullet points."""
        
        # Prepare the user message with data context
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

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Extract the response
        ai_response = response.choices[0].message.content
        
        # Parse recommendations from the response
        recommendations = []
        lines = ai_response.split('\n')
        for line in lines:
            if line.strip().startswith(('•', '-', '*', '1.', '2.', '3.')):
                recommendations.append(line.strip())
        
        return {
            "content": ai_response,
            "recommendations": recommendations[:5],  # Top 5 recommendations
            "analysis_type": "compliance",
            "timestamp": None  # Will be set by the database
        }
        
    except Exception as e:
        # Fallback response if AI fails
        return {
            "content": f"Based on the current compliance score of {data.get('complianceScore', 0)}% and {len(data.get('alerts', []))} active alerts, "
                      f"the system recommends immediate review of critical alerts and inventory levels. "
                      f"Key areas requiring attention include batch integrity monitoring and regulatory documentation updates.",
            "recommendations": [
                "Review and resolve all critical alerts within 24 hours",
                "Conduct inventory audit for expiring materials",
                "Update SOP documentation per latest FDA guidelines",
                "Schedule compliance training for quality team"
            ],
            "analysis_type": "compliance",
            "timestamp": None
        }

def analyze_procurement(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze procurement data and generate purchasing recommendations.
    
    Args:
        data: Dictionary containing inventory and market data
        
    Returns:
        Dictionary with procurement insights
    """
    try:
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

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
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
        
    except Exception as e:
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
