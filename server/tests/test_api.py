import sys
import os
from fastapi.testclient import TestClient
import pytest

# Add the server directory to sys.path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_normal_routing():
    """Scenario 1: Normal routing optimization request."""
    response = client.post("/route/optimize", json={
        "origin": "A",
        "destination": "G",
        "preferences": {"w1": 0.5, "w2": 0.5, "w3": 0, "w4": 0}
    })
    assert response.status_code == 200
    data = response.json()
    assert "path" in data
    assert "total_cost" in data
    print(f"\n[Test 1] Normal Routing: {data['path']} (Cost: {data['total_cost']})")

def test_traffic_prediction():
    """Scenario 2: Traffic prediction endpoint."""
    response = client.post("/route/predict", json={
        "origin": "A",
        "destination": "G",
        "time_window": 30
    })
    assert response.status_code == 200
    data = response.json()
    assert "predicted_congestion" in data
    print(f"[Test 2] Traffic Prediction: {data['predicted_congestion']}")

def test_emergency_routing():
    """Scenario 3: Emergency priority route activation."""
    response = client.post("/emergency/route", json={
        "vehicle_id": "AMB-911",
        "current_location": {"lat": 12.97, "lon": 77.59},
        "destination": {"lat": 12.98, "lon": 77.61}
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Active"
    assert "clearance_path" in data
    print(f"[Test 3] Emergency Routing: {data['status']} for {data['vehicle_id']}")

def test_weather_impact():
    """Scenario 4: Impact of weather on routing."""
    # We test this by checking if the optimize endpoint still works 
    # even when weather service logic is invoked.
    response = client.post("/route/optimize", json={
        "origin": "B", # B to D is 'risky'
        "destination": "G",
        "preferences": {"w1": 1.0}
    })
    assert response.status_code == 200
    data = response.json()
    # Path should ideally avoid B-D if it's raining (simulated in weather_service)
    print(f"[Test 4] Weather-Aware Path: {data['path']}")

if __name__ == "__main__":
    # Mocking startup events for TestClient if necessary
    # Note: connect_to_mongo might fail if DB is not running, 
    # in a real test we'd mock the DB.
    try:
        test_normal_routing()
        test_traffic_prediction()
        test_emergency_routing()
        test_weather_impact()
        print("\nAll test scenarios completed successfully!")
    except Exception as e:
        print(f"\nTest failed: {e}")
