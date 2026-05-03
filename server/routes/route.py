from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from models.schemas import RouteRequest
from services.routing_service import routing_service
from datetime import datetime
import httpx
from geopy.geocoders import Nominatim
import random

router = APIRouter()

# Hardcoded coordinates for Bangalore fallback
BANGALORE_NODES = {
    "MS Palya": [13.0886, 77.5512],
    "Sambhram College": [13.0825, 77.5441],
    "BEL Circle": [13.0361, 77.5562],
    "Jalahalli Cross": [13.0494, 77.5029],
    "Gangamma Circle": [13.0558, 77.5552],
    "Yeshwanthpur": [13.0235, 77.5565],
    "Jalahalli": [13.0538, 77.5458]
}

geolocator = Nominatim(user_agent="smart_routing_final")

async def get_coords(location_name: str):
    # Check if input is already coordinates (lat, lon)
    if "," in location_name:
        try:
            parts = location_name.split(",")
            return [float(parts[0].strip()), float(parts[1].strip())]
        except: pass

    if location_name in BANGALORE_NODES:
        return BANGALORE_NODES[location_name]
    
    try:
        # Search globally but prioritize results
        location = geolocator.geocode(location_name, timeout=3)
        if location:
            return [location.latitude, location.longitude]
    except: pass
    
    return [13.0538, 77.5458] # Default Jalahalli

@router.post("/optimize")
async def optimize_route(request: RouteRequest):
    now = datetime.now()
    weights = request.preferences or {"w1": 0.4, "w2": 0.3, "w3": 0.2, "w4": 0.1}
    
    start_coords = await get_coords(request.origin)
    goal_coords = await get_coords(request.destination)

    # Use the reliable OSRM Public API
    osrm_url = f"http://router.project-osrm.org/route/v1/driving/{start_coords[1]},{start_coords[0]};{goal_coords[1]},{goal_coords[0]}?overview=full&geometries=geojson&alternatives=true"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(osrm_url, timeout=5.0)
            data = response.json()
            
            if not data.get("routes"):
                raise HTTPException(status_code=404, detail="No route found")
            
            routes_found = data["routes"]
            
            # Pick the best route based on weights
            # (Time * w1) + (Distance * w3) ...
            scored_routes = []
            for i, r in enumerate(routes_found):
                dist_km = r["distance"] / 1000
                time_min = r["duration"] / 60
                
                # Simple weight scoring
                score = (time_min * weights["w1"]) + (dist_km * weights["w3"])
                scored_routes.append({"score": score, "data": r})

            scored_routes.sort(key=lambda x: x["score"])
            best_match = scored_routes[0]["data"]
            
            # Map coordinates for Leaflet [lat, lon]
            geometry = [[p[1], p[0]] for p in best_match["geometry"]["coordinates"]]
            
            final_dist = best_match["distance"] / 1000
            final_time = best_match["duration"] / 60

            return {
                "provider": "osrm",
                "routes": [
                    {
                        "type": "best",
                        "path": [request.origin, "Smart AI Path", request.destination],
                        "distance": round(final_dist, 2),
                        "time": round(final_time, 1),
                        "traffic": "medium" if final_time > (final_dist * 1.5) else "low",
                        "coordinates": geometry
                    }
                ]
            }
        except Exception as e:
            print(f"Routing Error: {e}")
            raise HTTPException(status_code=500, detail="OSRM service error")
