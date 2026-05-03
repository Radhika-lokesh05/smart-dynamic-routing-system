import httpx
import os
from config.settings import settings

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY", "your_api_key_here")
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"

    async def get_weather_data(self, lat: float, lon: float):
        """
        Fetches real-time weather from OpenWeather API.
        """
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric"
        }
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url, params=params)
                if response.status_code == 200:
                    return response.json()
        except Exception:
            return None
        return None

    async def get_weather_impact(self, lat: float, lon: float) -> dict:
        """
        Analyzes weather and returns an impact score and risks.
        """
        data = await self.get_weather_data(lat, lon)
        
        impact = {
            "multiplier": 1.0,
            "condition": "Clear",
            "risky_roads_avoidance": False
        }

        if data:
            weather_id = data["weather"][0]["id"]
            condition = data["weather"][0]["main"]
            impact["condition"] = condition

            # OpenWeather condition codes: 2xx (Storm), 5xx (Rain)
            if 200 <= weather_id <= 299: # Storm
                impact["multiplier"] = 1.5
                impact["risky_roads_avoidance"] = True
            elif 500 <= weather_id <= 599: # Rain
                impact["multiplier"] = 1.2
                impact["risky_roads_avoidance"] = True
        
        return impact

weather_service = WeatherService()
