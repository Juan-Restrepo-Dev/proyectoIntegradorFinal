from fastapi import Depends
import firebase_admin
from firebase_admin import  auth
from apps.companies.schemas import CompanyDataRequest
from core.config import firestore_db
from apps.users.schemas import OwnerRegistration, UserRegistration
from core.middleware.firebase_auth_guard import get_current_user_and_role
from shared.utils import raise_error


# --- Endpoints CRUD para los datos de la empresa ---

async def create_company_data(company_data: CompanyDataRequest, user_data: dict = Depends(get_current_user_and_role)):
    """
    Crea un nuevo documento de datos de empresa.
    """
    empresa_id = user_data.get('companyId')
    company_data_ref = firestore_db.collection('companies').document(empresa_id)
    company_data_payload = company_data.companyData
    company_data_ref.set(company_data_payload.dict())
    return {"message": "Datos de empresa creados con éxito.", "companyId": empresa_id}



async def get_my_company_id(user_data: dict = Depends(get_current_user_and_role)):
    """
    Obtiene los datos de la empresa a la que pertenece el usuario autenticado.
    Acceso: todos los roles.
    """
    empresa_id = user_data.get('companyId')


    if not empresa_id:
        raise raise_error("Datos de la empresa no encontrados.", 404)

    return {'companyId':empresa_id}




async def get_my_company_data(user_data: dict = Depends(get_current_user_and_role)):
    """
    Obtiene los datos de la empresa a la que pertenece el usuario autenticado.
    Acceso: todos los roles.
    """
    empresa_id = user_data.get('companyId')
    print(f"Obteniendo datos para la empresa: {empresa_id}")
    company_data_ref = firestore_db.collection('companies').document(empresa_id)
    company_data_doc = company_data_ref.get()

    if not company_data_doc.exists:
        raise raise_error("Datos de la empresa no encontrados.", 404)

    return {"companyId": empresa_id, **company_data_doc.to_dict()}


async def update_my_company_data(company_data: CompanyDataRequest, user_data: dict = Depends(get_current_user_and_role)):
    """
    Actualiza los datos de la empresa a la que pertenece el usuario.
    Acceso: 'owner', 'admin'.
    """
    empresa_id = user_data.get('companyId')
    company_data_ref = firestore_db.collection('empresas').document(empresa_id)
    company_data_ref.update(company_data.dict(exclude_unset=True))
    
    return {"message": "Datos de la empresa actualizados con éxito."}


async def delete_my_company_data(user_data: dict = Depends(get_current_user_and_role)):
    """
    Elimina los datos de la empresa a la que pertenece el usuario.
    Acceso: solo 'owner'.
    """
    empresa_id = user_data.get('companyId')
    company_data_ref = firestore_db.collection('empresas').document(empresa_id)
    company_data_ref.delete()
    
    return {"message": "Datos de la empresa eliminados con éxito."}
