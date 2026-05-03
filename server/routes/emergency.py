from fastapi import APIRouter
from models.schemas import EmergencyRouteRequest
from services.emergency_service import emergency_service

router = APIRouter()

@router.post("/route")
async def request_emergency_route(request: EmergencyRouteRequest):
    """
    Request priority emergency routing via the service layer.
    """
    result = await emergency_service.activate_emergency_route(request)
    return result
