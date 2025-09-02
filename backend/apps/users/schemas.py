from typing import Optional, List, Any, Dict
from pydantic import BaseModel

from apps.companies.schemas import CompanyData

class OwnerRegistration(BaseModel):
    """Modelo para el registro inicial del propietario de la empresa."""
    companyId: str
    nombre: str
    email: str
    rol: str
    # company_data: CompanyData

class UserRegistration(BaseModel):
    """Modelo para el registro de nuevos usuarios por parte de un administrador."""
    email: str
    rol: str
    nombre: Optional[str] = None