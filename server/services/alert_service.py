from models.schemas import IncidentReport
from utils.websocket_manager import manager

class AlertService:
    async def process_report(self, report: IncidentReport):
        # Logic to save report (e.g. to MongoDB)
        
        # Broadcast the alert to all connected users
        await manager.broadcast({
            "type": "CROWD_ALERT",
            "data": report.dict()
        })
        
        return {"status": "Report received and broadcasted", "id": "alert_123"}

alert_service = AlertService()
