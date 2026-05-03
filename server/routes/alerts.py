from fastapi import APIRouter
from models.schemas import IncidentReport
from services.alert_service import alert_service

router = APIRouter()

@router.post("/report")
async def report_incident(report: IncidentReport):
    """
    Submit an incident report via the service layer.
    """
    result = await alert_service.process_report(report)
    return result
