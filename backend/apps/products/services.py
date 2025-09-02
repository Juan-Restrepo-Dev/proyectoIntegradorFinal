from fastapi import Depends, HTTPException, status

from core.middleware.firebase_auth_guard import get_current_user
from core.config import firestore_db 


def get_products_by_company_id(user: dict = Depends(get_current_user)):
    """
    Obtiene los productos asociados a una empresa específica. y a la que pertenece el usuario autenticado.

    Args:
        user (dict): Usuario autenticado (proporcionado por el token jwt en la autenticación).

    Returns:
        List[Dict]: Lista de productos asociados a la empresa.
    """
    user_uid = user['uid']
    print(f"Usuario autenticado: {user_uid}")
    try:
        user_profile_ref = firestore_db.collection('ususers').document(user_uid)
        user_profile_doc = user_profile_ref.get()

        if not user_profile_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Perfil de usuario no encontrado."
            )

        user_profile_data = user_profile_doc.to_dict()
        empresa_id = user_profile_data.get('companyId')
        
        if not empresa_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El usuario no está asociado a una empresa."
            )
        
        # Paso 2: Usar el ID de la empresa para acceder a sus productos
        # Esto asegura que solo se acceda a los datos correctos
        productos_ref = firestore_db.collection(f'empresas/{empresa_id}/productos')
        productos_docs = productos_ref.stream()

        productos_list = []
        for doc in productos_docs:
            producto_data = doc.to_dict()
            productos_list.append({"id": doc.id, **producto_data})

        return {"productos": productos_list}

    except Exception as e:
        print(f"Error al obtener productos: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error al obtener los datos."
        )