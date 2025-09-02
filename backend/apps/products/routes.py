from fastapi import APIRouter, Depends

from core.middleware.firebase_auth_guard import get_current_user

router = APIRouter()

@router.get("/productos")
async def get_productos_por_empresa(id_empresa: int, user: dict = Depends(get_current_user)):
    """
    Endpoint para obtener productos de una empresa específica.
    y a la que pertenece el usuario autenticado.
    El id de la empresa se asume que está en un campo 'companyId' del perfil de usuario en Firestore.
    
    Args:
        id_empresa (int): ID de la empresa cuyos productos se desean obtener.
        current_user (dict): Usuario autenticado (proporcionado por la dependencia).
        
    Returns:
        List[Dict]: Lista de productos asociados a la empresa.
        
    Raises:
        HTTPException: Si no se encuentran productos o si hay un error en la consulta.
    """
