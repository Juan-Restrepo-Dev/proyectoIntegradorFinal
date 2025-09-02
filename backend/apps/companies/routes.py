from fastapi import APIRouter, Depends ,status


from apps.companies.schemas import CompanyDataRequest
from apps.companies.services import create_company_data, delete_my_company_data, get_my_company_data, get_my_company_id

from core.middleware.firebase_auth_guard import check_role, get_current_user_and_role


router = APIRouter()

# Los propietarios son quienes pueden crear los datos de la empresa.
@router.post("/me", status_code=status.HTTP_201_CREATED, dependencies=[Depends(check_role(['owner']))])
async def __create_company_data(company_data: CompanyDataRequest, user_data: dict = Depends(get_current_user_and_role)):
    """
    Crea un nuevo documento de datos de empresa.
    """
    return await create_company_data(company_data, user_data)

@router.get("/me/id")
async def __get_my_company_id(user_data: dict = Depends(get_current_user_and_role)):
    """
    Obtiene los datos de la empresa a la que pertenece el usuario autenticado.
    """
    return await get_my_company_id(user_data)

@router.get("/me")
async def __get_my_company_data(user_data: dict = Depends(get_current_user_and_role)):
    """
    Obtiene los datos de la empresa a la que pertenece el usuario autenticado.
    """
    return await get_my_company_data(user_data)

@router.put("/me", dependencies=[Depends(check_role(['owner', 'admin']))])
async def update_my_company_data(company_data: CompanyDataRequest, user_data: dict = Depends(get_current_user_and_role)):
    """
    Actualiza los datos de la empresa a la que pertenece el usuario.
    """
    return await update_my_company_data(company_data, user_data)

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(check_role(['owner']))])
async def __delete_my_company_data(user_data: dict = Depends(get_current_user_and_role)):
    """
    Elimina los datos de la empresa a la que pertenece el usuario.
    """
    return await delete_my_company_data(user_data)
