from typing import Any, Dict, Literal
from pydantic import BaseModel, RootModel

class FieldSchema(BaseModel):
    type: Literal["str", "int", "float", "bool", "list", "dict"]
    required: bool = False
    

class DynamicSchema(RootModel[Dict[str, FieldSchema]]):
    pass

class DynamicEntity(BaseModel):
    data: Dict[str, Any]
