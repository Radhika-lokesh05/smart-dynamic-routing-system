from fastapi import APIRouter, HTTPException
from services.user_service import user_service
from models.schemas import UserPreferences, RouteHistory
from ml_models.personalization import personalization_model

router = APIRouter()

@router.get("/preferences/{user_id}")
async def get_user_preferences(user_id: str):
    return await user_service.get_preferences(user_id)

@router.post("/preferences")
async def save_user_preferences(prefs: UserPreferences):
    await user_service.save_preferences(prefs)
    return {"status": "success"}

@router.post("/history")
async def log_route(route: RouteHistory):
    await user_service.log_route(route)
    return {"status": "logged"}

@router.get("/history/{user_id}")
async def get_history(user_id: str):
    return await user_service.get_history(user_id)

@router.get("/suggested-weights/{user_id}")
async def get_suggested_weights(user_id: str):
    history = await user_service.get_history(user_id)
    suggestions = personalization_model.suggest_preferences(history)
    return suggestions
