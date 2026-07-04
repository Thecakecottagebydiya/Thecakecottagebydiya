from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict

# ---------- Mongo ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ---------- App ----------
app = FastAPI(title="The Cake Cottage By Diya API")
api_router = APIRouter(prefix="/api")

# ---------- Auth helpers ----------
JWT_ALGORITHM = "HS256"

def _jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth_header[7:]
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------- Models ----------
class Cake(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    price: float
    category: str = "Signature"
    image_url: str
    weight_kg: float = 0.5
    is_eggless: bool = True
    is_available: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CakeCreate(BaseModel):
    name: str
    description: str = ""
    price: float
    category: str = "Signature"
    image_url: str
    weight_kg: float = 0.5
    is_eggless: bool = True
    is_available: bool = True

class CakeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    weight_kg: Optional[float] = None
    is_eggless: Optional[bool] = None
    is_available: Optional[bool] = None

class LoginIn(BaseModel):
    email: str
    password: str

class LoginOut(BaseModel):
    token: str
    email: str

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    cake_id: Optional[str] = None
    cake_name: Optional[str] = None
    weight_kg: Optional[float] = None
    flavor: Optional[str] = None
    quantity: int = 1
    delivery_date: Optional[str] = None
    message_on_cake: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class Order(OrderCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ---------- Utilities ----------
def _mongo_doc(model: BaseModel) -> dict:
    doc = model.model_dump()
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc

def _clean_out(doc: dict) -> dict:
    if not doc:
        return doc
    doc.pop("_id", None)
    for k, v in list(doc.items()):
        if isinstance(v, str) and k.endswith("_at"):
            try:
                doc[k] = datetime.fromisoformat(v)
            except Exception:
                pass
    return doc

# ---------- Public: Cakes ----------
@api_router.get("/cakes", response_model=List[Cake])
async def list_cakes(available_only: bool = True):
    query = {"is_available": True} if available_only else {}
    cakes = await db.cakes.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Cake(**_clean_out(c)) for c in cakes]

@api_router.get("/cakes/{cake_id}", response_model=Cake)
async def get_cake(cake_id: str):
    doc = await db.cakes.find_one({"id": cake_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Cake not found")
    return Cake(**_clean_out(doc))

# ---------- Public: Orders ----------
@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    order = Order(**payload.model_dump())
    await db.orders.insert_one(_mongo_doc(order))
    return order

# ---------- Admin: Auth ----------
@api_router.post("/auth/login", response_model=LoginOut)
async def login(payload: LoginIn):
    email = payload.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email)
    return LoginOut(token=token, email=email)

@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return {"email": admin["email"], "role": admin["role"]}

# ---------- Admin: Cakes ----------
@api_router.post("/admin/cakes", response_model=Cake)
async def admin_create_cake(payload: CakeCreate, admin: dict = Depends(get_current_admin)):
    cake = Cake(**payload.model_dump())
    await db.cakes.insert_one(_mongo_doc(cake))
    return cake

@api_router.get("/admin/cakes", response_model=List[Cake])
async def admin_list_cakes(admin: dict = Depends(get_current_admin)):
    cakes = await db.cakes.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Cake(**_clean_out(c)) for c in cakes]

@api_router.patch("/admin/cakes/{cake_id}", response_model=Cake)
async def admin_update_cake(cake_id: str, payload: CakeUpdate, admin: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        doc = await db.cakes.find_one({"id": cake_id}, {"_id": 0})
        if not doc:
            raise HTTPException(status_code=404, detail="Cake not found")
        return Cake(**_clean_out(doc))
    result = await db.cakes.find_one_and_update(
        {"id": cake_id}, {"$set": updates}, projection={"_id": 0}, return_document=True,
    )
    # motor's find_one_and_update needs pymongo return_document sentinel; fallback:
    if result is None:
        exists = await db.cakes.find_one({"id": cake_id}, {"_id": 0})
        if not exists:
            raise HTTPException(status_code=404, detail="Cake not found")
        await db.cakes.update_one({"id": cake_id}, {"$set": updates})
        doc = await db.cakes.find_one({"id": cake_id}, {"_id": 0})
        return Cake(**_clean_out(doc))
    doc = await db.cakes.find_one({"id": cake_id}, {"_id": 0})
    return Cake(**_clean_out(doc))

@api_router.delete("/admin/cakes/{cake_id}")
async def admin_delete_cake(cake_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.cakes.delete_one({"id": cake_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cake not found")
    return {"ok": True}

# ---------- Admin: Orders ----------
@api_router.get("/admin/orders", response_model=List[Order])
async def admin_list_orders(admin: dict = Depends(get_current_admin)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Order(**_clean_out(o)) for o in orders]

# ---------- Meta ----------
@api_router.get("/")
async def root():
    return {"app": "The Cake Cottage By Diya", "status": "ok"}

# ---------- Startup ----------
DEFAULT_CAKES = [
    {
        "name": "Molten Chocolate Truffle",
        "description": "Rich Belgian cocoa layers with ganache glaze. 100% eggless.",
        "price": 750,
        "category": "Chocolate",
        "image_url": "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGNob2NvbGF0ZSUyMGNha2V8ZW58MHx8fHwxNzgzMTMzMTQ2fDA&ixlib=rb-4.1.0&q=85",
        "weight_kg": 0.5,
    },
    {
        "name": "Rose & Vanilla Bloom",
        "description": "Two-tier custom floral cake with buttercream roses. Perfect for celebrations.",
        "price": 1450,
        "category": "Custom",
        "image_url": "https://images.unsplash.com/photo-1546379782-7b9235cf24ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBjdXN0b20lMjBjYWtlfGVufDB8fHx8MTc4MzEzMzE0Nnww&ixlib=rb-4.1.0&q=85",
        "weight_kg": 1.0,
    },
    {
        "name": "Golden Celebration",
        "description": "Elegant birthday cake with textured gold accents and vanilla sponge.",
        "price": 950,
        "category": "Birthday",
        "image_url": "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmlydGhkYXklMjBjYWtlfGVufDB8fHx8MTc4MzEzMzE0Nnww&ixlib=rb-4.1.0&q=85",
        "weight_kg": 0.75,
    },
]

async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@thecakecottage.in").strip().lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )

async def seed_cakes():
    count = await db.cakes.count_documents({})
    if count > 0:
        return
    for c in DEFAULT_CAKES:
        cake = Cake(**c)
        await db.cakes.insert_one(_mongo_doc(cake))

@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.cakes.create_index("id", unique=True)
    await db.orders.create_index("id", unique=True)
    await seed_admin()
    await seed_cakes()

@app.on_event("shutdown")
async def on_shutdown():
    client.close()

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
