
from fastapi import HTTPException

def raise_error(message: str, status_code: int):
    """
    Lanza un error de autenticación con un mensaje y código de estado específicos.
    """
    raise HTTPException(status_code=status_code, detail=message, headers={"WWW-Authenticate": "Bearer"})