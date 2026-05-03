from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import route, user, alerts, emergency
from db.mongo import connect_to_mongo, close_mongo_connection
from db.redis import init_redis, close_redis_connection
from utils.websocket_manager import manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await connect_to_mongo()
    await init_redis()
    yield
    # Shutdown logic
    await close_mongo_connection()
    await close_redis_connection()

app = FastAPI(
    title="Smart Dynamic Routing System",
    description="Backend for AI-powered traffic and routing management.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# WebSocket Endpoint
@app.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and wait for client messages if any
            data = await websocket.receive_text()
            # Handle incoming data if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Register routes
app.include_router(route.router, prefix="/route", tags=["Routing"])
app.include_router(user.router, prefix="/user", tags=["Users"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(emergency.router, prefix="/emergency", tags=["Emergency"])

@app.get("/")
async def root():
    return {"message": "Smart Dynamic Routing API is operational"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
