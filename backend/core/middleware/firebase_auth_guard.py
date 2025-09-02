from typing import List
from firebase_admin import auth, exceptions as firebase_exceptions
from fastapi import  Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import firestore_db
from shared.utils import raise_error

security = HTTPBearer()

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Decodifica el token de ID de Firebase y verifica su validez.
    Esta función solo autentica al usuario sin buscar datos adicionales en Firestore.
    Es útil para proteger rutas que no requieren información del perfil del usuario,
    solo la confirmación de que el token es válido.
    
    Args:
        credentials (HTTPAuthorizationCredentials): Las credenciales del token.
        
    Returns:
        Dict: Los datos decodificados del token si es válido.
        
    Raises:
        AuthError: Si el token es inválido, expirado o revocado.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except firebase_exceptions.ExpiredIdTokenError:
        raise raise_error("Token expirado", 401)
    except firebase_exceptions.RevokedIdTokenError:
        raise raise_error("Token revocado", 401)
    except firebase_exceptions.InvalidIdTokenError:
        raise raise_error("Token inválido", 401)
    except Exception as e:
        raise raise_error(f"Error de autenticación: {e}", 401)


# --- Dependencia de autenticación para FastAPI ---
# Esta función se ejecutará antes de cada ruta que la use
async def get_current_user_and_role(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Decodifica el token de ID de Firebase, verifica la validez y
    obtiene el perfil de usuario de Firestore, incluyendo su rol y companyId.
    
    Args:
        token (str): Token de Firebase a verificar
        
    Returns:
        Dict: Datos decodificados del token
        
    Raises:
        AuthError: Si hay problemas con el token
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        user_uid = decoded_token['uid']
        
        user_profile_ref = firestore_db.collection('users').document(user_uid)
        user_profile_doc = user_profile_ref.get()

        if not user_profile_doc.exists:
            raise raise_error("Perfil de usuario no encontrado en Firestore.", 404)

        user_profile_data = user_profile_doc.to_dict()
        user_profile_data['uid'] = user_uid
        return user_profile_data
    except firebase_exceptions.ExpiredIdTokenError:
        raise raise_error("Token expirado", 401)
    except firebase_exceptions.RevokedIdTokenError:
        raise raise_error("Token revocado", 401)
    except firebase_exceptions.InvalidIdTokenError:
        raise raise_error("Token inválido", 401)
    except Exception as e:
        raise raise_error(f"Error de autenticación: {e}", 401)

def check_role(required_roles: List[str]):
    def role_checker(user_data: dict = Depends(get_current_user_and_role)):
        user_role = user_data.get('rol')
        if user_role not in required_roles:
            raise raise_error("No tienes los permisos necesarios para realizar esta acción.", 403)
        return user_data
    return role_checker