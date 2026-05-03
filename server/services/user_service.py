from models.schemas import UserPreferences, RouteHistory
from db.mongo import get_database
from typing import List

class UserService:
    def __init__(self):
        self.db = get_database()

    async def get_preferences(self, user_id: str) -> UserPreferences:
        db = get_database()
        user_data = await db["users"].find_one({"user_id": user_id})
        if user_data:
            return UserPreferences(**user_data["preferences"])
        # Return default if not found
        return UserPreferences(user_id=user_id)

    async def save_preferences(self, preferences: UserPreferences):
        db = get_database()
        await db["users"].update_one(
            {"user_id": preferences.user_id},
            {"$set": {"preferences": preferences.dict()}},
            upsert=True
        )

    async def log_route(self, route: RouteHistory):
        db = get_database()
        await db["route_history"].insert_one(route.dict())
        # Also update user's last routes for quick access
        await db["users"].update_one(
            {"user_id": route.user_id},
            {"$push": {"history": {"$each": [route.dict()], "$slice": -5}}},
            upsert=True
        )

    async def get_history(self, user_id: str) -> List[RouteHistory]:
        db = get_database()
        cursor = db["route_history"].find({"user_id": user_id}).sort("timestamp", -1).limit(10)
        history = await cursor.to_list(length=10)
        return [RouteHistory(**h) for h in history]

user_service = UserService()
