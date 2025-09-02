from fastapi import Depends
import firebase_admin
from firebase_admin import  auth
from core.config import firestore_db
from apps.users.schemas import OwnerRegistration, UserRegistration
from core.middleware.firebase_auth_guard import get_current_user_id, get_current_user_and_role
from shared.utils import raise_error


async def register_owner_company(owner_data: OwnerRegistration, manager_data: dict = Depends(get_current_user_id)):
    """
    Registra al propietario de una empresa y los datos de la empresa.
    Esta ruta es pública y solo se debe usar una vez por empresa.
    Args: los defino cuando tengamos todos los datos :)
    """
    # print("Manager Data:", manager_data, owner_data)  # Debugging line to check manager_data content
     # 1. Verificar si el perfil de usuario ya existe en Firestore
    user_profile_ref = firestore_db.collection('users').document(manager_data["uid"])
    if user_profile_ref.get().exists:
        raise raise_error("El perfil de usuario ya existe.", 409)
    
    # 2. Validar que los datos de registro coincidan con el perfil de Firebase Auth
    try:
        user_auth = auth.get_user(manager_data["uid"])
        if owner_data.email != user_auth.email :
            raise raise_error("Los datos de registro no coinciden con el perfil de autenticación.", 400)
    
    except auth.UserNotFoundError:
        raise raise_error("Usuario de autenticación no encontrado.", 404)
    except Exception as e:
        print(f"Error al verificar el usuario de autenticación: {e}")
        raise raise_error("Ocurrió un error interno al verificar el usuario.", 500)
        
    # 3. Crear el documento de la empresa en Firestore
    try:
        # Desempaquetamos la tupla para obtener directamente la referencia del documento
        _ , company_document_ref = firestore_db.collection('companies').add({})
        company_id = company_document_ref.id
    except Exception as e:
        print(f"Error al crear el documento de empresa: {e}")
        raise raise_error("Ocurrió un error al crear la empresa.", 500)

    # 4. Crear el perfil de usuario del propietario en Firestore
    try:
        user_profile_ref.set({
            "nombre": owner_data.nombre,
            "email": owner_data.email,
            "companyId": company_id,
            "rol": "owner"
        })
    except Exception as e:
        print(f"Error al crear el perfil de usuario: {e}")
        # Realizar rollback: eliminar el documento de empresa si esto falla
        company_document_ref.delete()
        raise raise_error("Ocurrió un error al crear el perfil de usuario.", 500)
    return {"message": "Propietario y empresa registrados con éxito.","manager_data":company_id}
    # return {"message": "Empresa y perfil de propietario registrados exitosamente", "company_id": company_id}

    # 1. Verificar si la empresa ya existe
    # company_ref = firestore_db.collection('empresas').document(owner_data.companyId)
    # if company_ref.get().exists:
    #     raise raise_error("La empresa con este ID ya existe.", 409)

    # 2. Intentar obtener el usuario de Firebase Auth usando el email
    # try:
    #     user_record = auth.get_user_by_email(owner_data.email)
    # except auth.AuthError as e:
    #     print(f"Error al obtener el usuario de Firebase Auth: {e}")
    #     raise raise_error("Usuario de Firebase Auth no encontrado. Asegúrate de que el usuario se haya autenticado en el frontend primero.", 404)

    # 3. Crear el documento de la empresa
    # try:
    #     company_ref.set(owner_data.company_data.dict())
    # except Exception as e:
    #     print(f"Error al crear los datos de la empresa: {e}")
    #     raise raise_error("Ocurrió un error al crear los datos de la empresa.", 500)
    
    # # 4. Crear el perfil de usuario del propietario
    # user_profile_ref = firestore_db.collection('usuarios').document(user_record.uid)
    # try:
    #     user_profile_ref.set({
    #         "nombre": owner_data.nombre,
    #         "email": owner_data.email,
    #         "companyId": owner_data.companyId,
    #         "rol": "owner"
    #     })
    # except Exception as e:
    #     print(f"Error al crear el perfil de usuario: {e}")
    #     # Considera eliminar el documento de empresa si esto falla
    #     raise raise_error("Ocurrió un error al crear el perfil de usuario.", 500)

    # return {"message": "Propietario y empresa registrados con éxito.", "uid": user_record.uid}
    

async def add_employee_company(user_data: UserRegistration, manager_data: dict = Depends(get_current_user_and_role)):
    """
    Permite que un propietario o administrador añada un nuevo usuario a su empresa.
    """
    manager_empresa_id = manager_data.get('companyId')
    try:
        user_record = auth.get_user_by_email(user_data.email)
    except auth.AuthError as e:
        raise raise_error("Usuario de Firebase Auth no encontrado. Asegúrate de que el usuario se haya autenticado en el frontend primero.", 404)

    user_profile_ref = firestore_db.collection('usuarios').document(user_record.uid)
    if user_profile_ref.get().exists:
        raise raise_error("El perfil de usuario ya existe.", 409)

    user_profile_ref.set({
        "nombre": user_data.nombre,
        "email": user_data.email,
        "companyId": manager_empresa_id,
        "rol": user_data.rol
    })
    
    return {"message": "Usuario añadido con éxito.", "uid": user_record.uid}


async def get_all_users_for_company(manager_data: dict = Depends(get_current_user_and_role)):
    """
    Obtiene todos los usuarios de la empresa del administrador.
    """
    empresa_id = manager_data.get('companyId')
    users_ref = firestore_db.collection('usuarios').where('companyId', '==', empresa_id)
    users_docs = users_ref.stream()
    
    users_list = []
    for doc in users_docs:
        user_data = doc.to_dict()
        user_data['uid'] = doc.id
        users_list.append(user_data)
        
    return {"usuarios": users_list}


async def delete_user_from_company(user_id: str, manager_data: dict = Depends(get_current_user_and_role)):
    """
    Elimina un usuario de la empresa (solo para administradores y propietarios).
    """
    manager_empresa_id = manager_data.get('companyId')
    user_profile_ref = firestore_db.collection('usuarios').document(user_id)
    user_profile_doc = user_profile_ref.get()

    if not user_profile_doc.exists or user_profile_doc.to_dict().get('companyId') != manager_empresa_id:
        raise raise_error("Usuario no encontrado o no pertenece a tu empresa.", 404)

    user_profile_ref.delete()
    return {"message": "Usuario eliminado con éxito."}


