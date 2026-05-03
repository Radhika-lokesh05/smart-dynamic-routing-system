class EcoModel:
    def __init__(self):
        # Constants for a generic mid-sized vehicle
        self.base_fuel_rate = 0.08 # Liters per km
        self.idle_fuel_rate = 0.02 # Liters per minute idling

    def estimate_fuel_consumption(self, distance_km, avg_speed_kmh, traffic_delay_mins):
        """
        Simple physics-based estimation of fuel usage.
        Adjusts for speed efficiency and traffic idling.
        """
        # Optimal speed for fuel is around 60-80 km/h
        speed_factor = 1.0
        if avg_speed_kmh < 40:
            speed_factor = 1.3 # Less efficient in slow traffic
        elif avg_speed_kmh > 100:
            speed_factor = 1.2 # Less efficient at high speeds
        
        consumption = (distance_km * self.base_fuel_rate * speed_factor) + (traffic_delay_mins * self.idle_fuel_rate)
        
        # Carbon footprint estimation: ~2.31 kg CO2 per liter of gasoline
        co2_emissions = consumption * 2.31
        
        return {
            "estimated_fuel_liters": round(consumption, 2),
            "estimated_co2_kg": round(co2_emissions, 2),
            "efficiency_rating": "High" if speed_factor == 1.0 else "Medium"
        }

eco_model = EcoModel()
