from typing import Optional, List
from pydantic import BaseModel, HttpUrl

class SocialHandle(BaseModel):
    handle: Optional[str] = None 
    token: Optional[str] = None


class GeneralData(BaseModel):
    company: str
    country: str
    taxid: str
    sector: str
    size: str

class AudienceData(BaseModel):
    demographics: str
    interests: List[str]
    painpoints: Optional[List[str]] = []
    current_geographic_scope: str

class Colors(BaseModel):
    primary: str
    accent: str

class BrandingData(BaseModel):
    company_description: str
    strategic_objective_company: str
    tagline: str
    colors: Colors
    logo: str # Pydantic valida que sea una URL

class SocialsData(BaseModel):
    whatsapp: Optional[SocialHandle] = None
    instagram: Optional[SocialHandle] = None
    facebook: Optional[SocialHandle] = None
    linkedin: Optional[SocialHandle] = None
    tiktok: Optional[SocialHandle] = None
    web:str 

# Modelo principal para todos los datos de la empresa
class CompanyData(BaseModel):
    generalData: GeneralData
    audience: AudienceData
    branding: BrandingData
    socials: SocialsData

class CompanyDataRequest(BaseModel):
    companyData: CompanyData