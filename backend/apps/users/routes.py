from fastapi import APIRouter, Depends, status

from apps.users.schemas import OwnerRegistration, UserRegistration
from apps.users.services import add_employee_company, delete_user_from_company, get_all_users_for_company, register_owner_company
from core.middleware.firebase_auth_guard import  get_current_user_id,check_role, get_current_user_and_role 


router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(manager_data: dict = Depends(get_current_user_id)):
    return {"status": "healthy"}

# --- Endpoint Público registro de empresa y usuario (sin autenticación) ---
@router.post("/register-owner", status_code=status.HTTP_201_CREATED)
async def __register_owner_company(owner_data: OwnerRegistration , manager_data: dict = Depends(get_current_user_id)):
    """
    Registra al propietario de una empresa.
    Esta ruta es pública y solo se debe usar una vez por empresa.
    args:
    """
    return await register_owner_company(owner_data, manager_data)

# --- Endpoints de Gestión de Usuarios (protegidos) ---
@router.post("/users/add", status_code=status.HTTP_201_CREATED, dependencies=[Depends(check_role(['owner', 'admin']))])
async def add_user(user_data: UserRegistration, manager_data: dict = Depends(get_current_user_and_role)):
    """
    Añade un nuevo usuario a la empresa.
    """
    return await add_employee_company(user_data, manager_data)

@router.get("/users", dependencies=[Depends(check_role(['owner', 'admin']))])
async def get_users(manager_data: dict = Depends(get_current_user_and_role)):
    """
    Obtiene todos los users de la empresa.
    """
    return await get_all_users_for_company(manager_data)

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(check_role(['owner', 'admin']))])
async def delete_user(user_id: str, manager_data: dict = Depends(get_current_user_and_role)):
    """
    Elimina un usuario de la empresa.
    """
    return await delete_user_from_company(user_id, manager_data)