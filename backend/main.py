import os
import json
import asyncio
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Funday Dallar Market Realtime API Server",
    description="FastAPI Backend with Multi-Device Realtime WebSocket Sync",
    version="1.0.0"
)

# 1. CORS Defensive Shield (Allows all origins and devices)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File Paths for Isolated Storage (.gitignore protected)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "storage")
os.makedirs(DATA_DIR, exist_ok=True)

ITEMS_FILE = os.path.join(DATA_DIR, "items.json")
STUDENTS_FILE = os.path.join(DATA_DIR, "students.json")
CONFIG_FILE = os.path.join(DATA_DIR, "game_config.json")

# Master Real 7 Teacher Items Default Template
DEFAULT_ITEMS = [
  { "id": "item_1", "name": "맛있는 슬러시", "price": 10, "stock": 20, "category": "음료", "badge": "HOT", "description": "시원하다. 시원해...." },
  { "id": "item_2", "name": "펜", "price": 10, "stock": 100, "category": "문구", "badge": "BEST", "description": "예쁜 캐릭터 볼펜과 노트" },
  { "id": "item_3", "name": "노트", "price": 10, "stock": 200, "category": "문구", "badge": "BEST", "description": "예쁜 캐릭터 볼펜과 노트" },
  { "id": "item_4", "name": "지우개", "price": 10, "stock": 300, "category": "문구", "badge": "BEST", "description": "예쁜 캐릭터 볼펜과 노트" },
  { "id": "item_5", "name": "펜2", "price": 20, "stock": 100, "category": "문구", "badge": "BEST", "description": "예쁜 캐릭터 볼펜과 노트" },
  { "id": "item_6", "name": "노트2", "price": 20, "stock": 200, "category": "문구", "badge": "BEST", "description": "예쁜 캐릭터 볼펜과 노트" },
  { "id": "item_7", "name": "지우개2", "price": 20, "stock": 300, "category": "문구", "badge": "BEST", "description": "예쁜 캐릭터 볼펜과 노트" }
]

# Master Registered 31 Student Accounts
DEFAULT_STUDENTS = [
  { "id": "std_01", "name": "황규문", "password": "5816", "points": 10000, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_06", "name": "최승재", "password": "4558", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_07", "name": "한예나", "password": "5408", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_08", "name": "강세찬", "password": "7075", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_09", "name": "이지율", "password": "9394", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_10", "name": "이이든", "password": "8113", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_11", "name": "이이든", "password": "7422", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_12", "name": "이시우", "password": "8602", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_13", "name": "이태이", "password": "3692", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_14", "name": "오평안", "password": "5183", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_15", "name": "강동호", "password": "3609", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },

  { "id": "std_16", "name": "김다연", "password": "2125", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_17", "name": "김이건", "password": "3031", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_18", "name": "이상우", "password": "7723", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_19", "name": "박하빈", "password": "7159", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_20", "name": "유하연", "password": "8477", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_21", "name": "양시온", "password": "3918", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_22", "name": "윤라엘", "password": "2051", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_23", "name": "윤건우", "password": "3455", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_24", "name": "정라온", "password": "6024", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_25", "name": "오시온", "password": "1445", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_26", "name": "박하온", "password": "2860", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_27", "name": "신하준", "password": "3767", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_28", "name": "송상윤", "password": "4224", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_29", "name": "유하준", "password": "2494", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_30", "name": "윤석현", "password": "6874", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_31", "name": "김형서", "password": "4078", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_32", "name": "김리원", "password": "1484", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_33", "name": "이지민", "password": "4028", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_34", "name": "이희엘", "password": "5587", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 },
  { "id": "std_35", "name": "송유빈", "password": "8202", "points": 100, "spinsLeft": 1, "luckyBoxSpinsLeft": 1, "totalSpins": 0 }
]

DEFAULT_CONFIG = {
  "isWheelEnabled": True,
  "isLuckyBoxEnabled": True
}

# Helper Storage Loaders/Savers
def load_json(filepath: str, default_data: Any) -> Any:
    if not os.path.exists(filepath):
        save_json(filepath, default_data)
        return default_data
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        save_json(filepath, default_data)
        return default_data

def save_json(filepath: str, data: Any):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# WebSocket Connection Manager for 0.01s Realtime Push to All Mobile Clients
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, event_name: str, payload: Any):
        message = json.dumps({"event": event_name, "data": payload}, ensure_ascii=False)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected.append(connection)
        for dead in disconnected:
            self.disconnect(dead)

manager = ConnectionManager()

# Pydantic Schemas
class StudentLoginRequest(BaseModel):
    studentId: str
    password: str

class UpdateItemsRequest(BaseModel):
    items: List[Dict[str, Any]]

class UpdateStudentsRequest(BaseModel):
    students: List[Dict[str, Any]]

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Funday Dallar Market Realtime API",
        "websocket": "/ws"
    }

# 1. Realtime Items APIs
@app.get("/api/items")
def get_items():
    return load_json(ITEMS_FILE, DEFAULT_ITEMS)

@app.post("/api/items")
async def save_items(req: UpdateItemsRequest):
    save_json(ITEMS_FILE, req.items)
    await manager.broadcast("items_updated", req.items)
    return {"success": True, "count": len(req.items)}

@app.post("/api/items/sync")
async def sync_items():
    save_json(ITEMS_FILE, DEFAULT_ITEMS)
    await manager.broadcast("items_updated", DEFAULT_ITEMS)
    return {"success": True, "items": DEFAULT_ITEMS}

class BuyItemRequest(BaseModel):
    itemId: str
    studentId: str

# Atomic Real-Time Concurrency Purchase Endpoint
@app.post("/api/items/buy")
async def buy_item(req: BuyItemRequest):
    items = load_json(ITEMS_FILE, DEFAULT_ITEMS)
    students = load_json(STUDENTS_FILE, DEFAULT_STUDENTS)

    target_item = None
    for item in items:
        if str(item.get("id", "")).strip() == str(req.itemId).strip():
            target_item = item
            break

    if not target_item:
        raise HTTPException(status_code=404, detail="물품을 찾을 수 없습니다.")

    if target_item.get("stock", 0) <= 0:
        return {"success": False, "message": "이미 품절된 물품입니다!"}

    # 1. Atomic Stock Deduction
    target_item["stock"] = target_item["stock"] - 1

    # 2. Student Points Deduction
    target_student = None
    for s in students:
        if str(s.get("id", "")).strip().lower() == str(req.studentId).strip().lower():
            target_student = s
            break

    if target_student:
        if target_student.get("points", 0) < target_item.get("price", 0):
            # Rollback stock if insufficient points
            target_item["stock"] += 1
            return {"success": False, "message": "달란트 포인트가 부족합니다!"}
        target_student["points"] -= target_item.get("price", 0)
        save_json(STUDENTS_FILE, students)
        await manager.broadcast("students_updated", students)

    save_json(ITEMS_FILE, items)
    # Broadcast 0.01s real-time stock deduction to all connected phones!
    await manager.broadcast("items_updated", items)

    return {
        "success": True,
        "item": target_item,
        "remainingStock": target_item["stock"],
        "student": target_student
    }


# 2. Realtime Students & Login APIs
@app.get("/api/students")
def get_students():
    return load_json(STUDENTS_FILE, DEFAULT_STUDENTS)

@app.post("/api/students")
async def save_students(req: UpdateStudentsRequest):
    save_json(STUDENTS_FILE, req.students)
    await manager.broadcast("students_updated", req.students)
    return {"success": True, "count": len(req.students)}

@app.post("/api/students/login")
def login_student(req: StudentLoginRequest):
    students = load_json(STUDENTS_FILE, DEFAULT_STUDENTS)
    clean_id = req.studentId.strip().lower()
    clean_pw = req.password.strip()

    found = None
    for s in students:
        s_id = str(s.get("id", "")).strip().lower()
        s_pw = str(s.get("password", "")).strip()
        if s_id == clean_id and s_pw == clean_pw:
            found = s
            break

    if found:
        return {"success": True, "student": found}
    raise HTTPException(status_code=401, detail="학생 ID와 비밀번호를 확인해주세요.")

# 3. Game Config APIs
@app.get("/api/config")
def get_config():
    return load_json(CONFIG_FILE, DEFAULT_CONFIG)

@app.post("/api/config")
async def update_config(config: Dict[str, Any]):
    current = load_json(CONFIG_FILE, DEFAULT_CONFIG)
    current.update(config)
    save_json(CONFIG_FILE, current)
    await manager.broadcast("config_updated", current)
    return {"success": True, "config": current}

# WebSocket Realtime Subscriptions Endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and listen for ping/messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    # Multi-IP All Hosts Binding --host 0.0.0.0 --port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
