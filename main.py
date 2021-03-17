from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

idx = 0
notifications = []

@app.post("/notify")
async def notify(message: str):
    global idx
    notifications.append({"id": idx, "message": message})
    idx = idx + 1
    return {"message": "Sent..."}


@app.websocket("/ws/{uid}")
async def listen(websocket: WebSocket, uid: str):
    await websocket.accept()
    try:
        while True:
            await websocket.receive_text()
            await _listen_notifications(websocket)
    except WebSocketDisconnect:
        print(f"Client {uid} disconnected")


async def _listen_notifications(websocket: WebSocket):
    if len(notifications) > 0:
        value = notifications.pop()
        print("Sending:", value)
        await websocket.send_text(value.get("message"))
  
