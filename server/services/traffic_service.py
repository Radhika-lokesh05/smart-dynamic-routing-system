import random
from typing import Dict

class TrafficService:
    def __init__(self):
        # Mock traffic data for specific zones or road segments
        self.zone_congestion = {
            "Sector 1": 0.2,
            "Sector 2": 0.8, # High traffic
            "Downtown": 0.9, # High traffic
            "Highway A1": 0.4
        }

    async def get_live_traffic(self, segment_id: str) -> float:
        """
        Simulates live traffic for a road segment.
        Returns congestion level 0.0 (empty) to 1.0 (gridlock).
        """
        # Return mock value or random noise if segment not in mock data
        base_traffic = self.zone_congestion.get(segment_id, random.uniform(0.1, 0.5))
        # Add slight random fluctuation to simulate "live" data
        live_traffic = min(1.0, max(0.0, base_traffic + random.uniform(-0.1, 0.1)))
        return live_traffic

    def should_reroute(self, congestion_level: float) -> bool:
        """
        Logic: High traffic (> 0.7) → trigger rerouting.
        """
        return congestion_level > 0.7

traffic_service = TrafficService()
