from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class Location(BaseModel):
    lat: float
    lon: float

class RouteRequest(BaseModel):
    origin: str
    destination: str
    preferences: Optional[Dict] = None

class PredictionRequest(BaseModel):
    origin: str
    destination: str
    time_window: Optional[int] = 30 # minutes

class IncidentReport(BaseModel):
    type: str
    severity: str
    location: Location
    description: Optional[str] = None

class EmergencyRouteRequest(BaseModel):
    vehicle_id: str
    current_location: Location
    destination: Location

class UserPreferences(BaseModel):
    user_id: str
    eco_friendly: float = 0.5
    time_sensitivity: float = 0.5
    safety_priority: float = 0.5
    comfort_level: float = 0.5
    preferred_mode: str = "fastest"

class RouteHistory(BaseModel):
    user_id: str
    origin: str
    destination: str
    path: List[str]
    timestamp: datetime = Field(default_factory=datetime.now)
    metrics: Dict

class UserProfile(BaseModel):
    user_id: str
    preferences: UserPreferences
    history: List[RouteHistory] = []
