# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; python main.py"
# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"
