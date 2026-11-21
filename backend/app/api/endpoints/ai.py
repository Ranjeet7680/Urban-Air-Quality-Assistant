from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import AIChatRequest, AIChatResponse, AIExplainRequest, AIExplainResponse
from app.ai.gemini_service import AirSenseAIService
from app.models.models import AIConversation, AIMessage
from app.api.deps import get_current_user_optional

router = APIRouter()

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_airsense(
    req: AIChatRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    
    # Retrieve or create conversation
    conv_id = req.conversation_id
    if not conv_id:
        conv = AIConversation(
            user_id=user_id,
            title=f"Chat: {req.message[:35]}..."
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
        conv_id = conv.id
    else:
        conv = db.query(AIConversation).filter(AIConversation.id == conv_id).first()
        if not conv:
            conv = AIConversation(user_id=user_id, title=f"Chat: {req.message[:35]}...")
            db.add(conv)
            db.commit()
            db.refresh(conv)
            conv_id = conv.id

    # Record user message
    user_msg = AIMessage(
        conversation_id=conv_id,
        sender="user",
        content=req.message,
        measured_data_context=req.aqi_context
    )
    db.add(user_msg)
    db.commit()

    # Call AI reasoning service
    response = await AirSenseAIService.chat(
        message=req.message,
        city=req.city or "New York",
        aqi_context=req.aqi_context
    )

    # Record assistant message
    ai_msg = AIMessage(
        conversation_id=conv_id,
        sender="assistant",
        content=response["reply"],
        measured_data_context=req.aqi_context
    )
    db.add(ai_msg)
    db.commit()

    return {
        "conversation_id": conv_id,
        "reply": response["reply"],
        "measured_data_badge": response["measured_data_badge"],
        "forecast_badge": response["forecast_badge"],
        "ai_badge": response["ai_badge"],
        "suggested_actions": response["suggested_actions"],
        "citations": response["citations"]
    }

@router.post("/explain-aqi", response_model=AIExplainResponse)
async def explain_aqi(req: AIExplainRequest):
    return {
        "overview": f"In {req.city}, current AQI is {req.aqi} driven primarily by {req.dominant_pollutant}.",
        "causes": [
            "Urban commuter fleet vehicular exhaust",
            "Ground-level ozone photochemical reaction",
            "Thermal inversion restricting vertical atmospheric ventilation"
        ],
        "health_impact": "Fine particulates penetrate deep into lung bronchioles, aggravating respiratory and cardio sensitivity.",
        "dispersion_factor": "Moderate breeze conditions support gradual clearing over 12-18 hours.",
        "precautionary_actions": [
            "Run indoor HEPA filtration",
            "Avoid roadside exercising during rush hours",
            "Wear an N95 mask if AQI exceeds 150"
        ]
    }
