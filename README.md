# Smart Dynamic Routing System

An AI-powered traffic and routing management system featuring predictive pathfinding, multi-objective optimization, and real-time emergency protocols.

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB (Running locally or on Atlas)
- Redis (Running locally)

### 2. Backend Setup (FastAPI)
```bash
cd server
pip install -r requirements.txt
# Configure your .env file
python main.py
```
*API will be available at: http://localhost:8000*

### 3. Frontend Setup (React + Tailwind)
```bash
cd client
npm install
npm run dev
```
*App will be available at: http://localhost:5173*

## 🧪 Testing the Flow
1. **Optimize Route**: Use the "Pathfinder" panel to request a route between nodes (e.g., A to G).
2. **Toggle Emergency**: Activate "Emergency Mode" and check the console/WebSocket for the broadcast alert.
3. **Adjust Weights**: Use the sliders in "Optimization Weights" to see how the AI adapts the path scoring.
4. **Report Alerts**: Use the "Smart Alerts" panel to report incidents and see them broadcasted.

## 🛠️ Debugging
- **CORS Errors**: Ensure `allow_origins=["*"]` is present in `server/main.py`.
- **DB Connection**: Check your `MONGO_URI` and `REDIS_URL` in `server/.env`.
- **ML Models**: If routing fails, check `server/ml_models/traffic_prediction.py` to ensure the dummy data generation is working.
- **WebSocket**: Use the browser console to verify connection to `ws://localhost:8000/ws/updates`.

## 📂 Project Structure
- `server/`: FastAPI, ML Models, MongoDB/Redis integration.
- `client/`: React, Tailwind CSS, Leaflet Maps, Framer Motion.
