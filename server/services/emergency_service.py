from models.schemas import EmergencyRouteRequest
from utils.websocket_manager import manager

class EmergencyService:
    async def activate_emergency_route(self, request: EmergencyRouteRequest):
        # Priority routing logic
        result = {
            "status": "Active",
            "clearance_path": ["Sector A", "Sector B"],
            "eta_reduction": "25%",
            "vehicle_id": request.vehicle_id
        }

        # Broadcast emergency alert to clear the path
        await manager.broadcast({
            "type": "EMERGENCY_ALERT",
            "data": result
        })

        return result

emergency_service = EmergencyService()
