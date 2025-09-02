from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from backend.core.middleware.auth_context import AuthContextMiddleware
from core.config import settings,firebase_app,firestore_db
# from core.database import Base, engine
from core.middleware.firebase_auth_guard import get_current_user_and_role
# Routers 
from apps.generator.routes import router as generator_router
from apps.companies.routes import router as companies_router
from apps.users.routes import router as users_router
from apps.dynamic_entities.routes import dynamic_entities_router  




app = FastAPI(title=settings.project_name, version=settings.project_version)
origins = [
    "http://127.0.0.1:5500",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://localhost:8001",
    "http://localhost:3000/"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.add_middleware(get_current_user_and_role)
api_router = APIRouter(
    prefix="/api/v1",
    tags=["API v1"]
)
app.include_router(generator_router, prefix="/ia/generator", tags=["Generator"])
app.include_router(companies_router, prefix="/companies", tags=["Companies"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(dynamic_entities_router, prefix="/dinamic-entities", tags=["Dynamic Entities"])

