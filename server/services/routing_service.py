import heapq
from typing import List, Dict, Tuple
from ml_models.traffic_prediction import traffic_predictor
from ml_models.eco_model import eco_model
from services.weather_service import weather_service
from services.traffic_service import traffic_service

class RoutingService:
    def __init__(self):
        # Nodes: neighbors are (target, distance, safety, comfort, is_risky)
        self.graph = {
            "MS Palya": [("Sambhram College", 1.5, 0.9, 0.8, False), ("BEL Circle", 4.2, 0.95, 0.9, False)],
            "Sambhram College": [("Jalahalli Cross", 3.8, 0.85, 0.7, True), ("Gangamma Circle", 2.2, 0.9, 0.85, False)],
            "BEL Circle": [("Yeshwanthpur", 3.1, 0.8, 0.6, False)],
            "Jalahalli Cross": [("Jalahalli", 2.5, 0.9, 0.9, False)],
            "Gangamma Circle": [("Jalahalli", 1.8, 0.85, 0.8, False)],
            "Yeshwanthpur": [("Jalahalli", 5.5, 0.95, 0.9, True)],
            "Jalahalli": []
        }

    async def calculate_edge_score(self, node_from, node_to, dist, safety, comfort, is_risky, weights, hour, day):
        # 1. Integrate Weather Data & Risk Avoidance
        weather_info = await weather_service.get_weather_impact(0, 0)
        weather_multiplier = weather_info.get("multiplier", 1.0)
        
        # Logic: Rain/Storm -> Avoid risky roads by significantly increasing their cost
        risk_penalty = 0
        if is_risky and weather_info.get("risky_roads_avoidance", False):
            risk_penalty = 100 # prohibitive cost

        # 2. Integrate Live Traffic & Rerouting Logic
        segment_id = f"{node_from}-{node_to}"
        live_congestion = await traffic_service.get_live_traffic(segment_id)
        
        # 3. Integrate ML Traffic Prediction (Future Traffic)
        predicted_traffic = traffic_predictor.predict(hour, day, live_congestion)
        
        # Combine live and predicted traffic
        combined_traffic = (live_congestion * 0.6) + (predicted_traffic * 0.4)
        
        # Logic: High traffic -> higher cost (rerouting)
        traffic_penalty = 0
        if traffic_service.should_reroute(live_congestion):
            traffic_penalty = 10 # Encourage alternative paths

        # 4. Calculate metrics
        avg_speed = 50 / (combined_traffic + weather_multiplier)
        time_val = dist / avg_speed
        
        fuel_data = eco_model.estimate_fuel_consumption(dist, avg_speed, time_val * 60)
        fuel_val = fuel_data["estimated_fuel_liters"]
        
        safety_val = 1 - safety
        comfort_val = 1 - comfort
        
        # Final Multi-objective optimization score
        score = (
            weights.get("w1", 0.4) * time_val +
            weights.get("w2", 0.3) * safety_val +
            weights.get("w3", 0.2) * fuel_val +
            weights.get("w4", 0.1) * comfort_val +
            risk_penalty + 
            traffic_penalty
        )
        return score

    async def find_best_route(self, start: str, goal: str, weights: Dict, hour: int, day: int):
        pq = [(0, start, [])] 
        visited = set()

        while pq:
            (cost, current, path) = heapq.heappop(pq)
            if current in visited: continue
            
            path = path + [current]
            if current == goal:
                return {"path": path, "total_cost": round(cost, 2)}

            visited.add(current)

            for neighbor, dist, safety, comfort, is_risky in self.graph.get(current, []):
                if neighbor not in visited:
                    edge_cost = await self.calculate_edge_score(
                        current, neighbor, dist, safety, comfort, is_risky, weights, hour, day
                    )
                    heapq.heappush(pq, (cost + edge_cost, neighbor, path))
        return None

routing_service = RoutingService()
