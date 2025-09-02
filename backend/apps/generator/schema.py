from typing import Any, Dict
from pydantic import BaseModel


class SocialPostRequest(BaseModel):
    platform_to_publish: Dict[str, Any]
    product_data: Dict[str, Any]
    ia_settings: Dict[str, Any]