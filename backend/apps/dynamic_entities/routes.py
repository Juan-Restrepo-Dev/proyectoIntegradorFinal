
from typing import Any, Dict
from fastapi import APIRouter, Depends, Form , status, UploadFile, File

from apps.dynamic_entities.schemas import DynamicSchema
from apps.dynamic_entities.services import create_entity, create_or_update_schema, delete_entity, delete_schema, get_all_entities, get_entity_by_id, get_schema, import_csv, update_entity
from core.middleware.firebase_auth_guard import check_role, get_current_user_and_role



dynamic_entities_router = APIRouter()
@dynamic_entities_router.post("/schemas/{entity_name}", summary="Crear o actualizar esquema dinámico")
async def create_dynamic_schema_endpoint(entity_name: str, schema_data: DynamicSchema, user_data: dict = Depends(get_current_user_and_role)):
    return await create_or_update_schema(user_data["companyId"], entity_name, schema_data.model_dump())
@dynamic_entities_router.get("/schemas/{entity_name}", summary="Obtener esquema dinámico")
async def get_dynamic_schema_endpoint(entity_name: str, user_data: dict = Depends(get_current_user_and_role)):
    return await get_schema(user_data["companyId"], entity_name)
@dynamic_entities_router.delete("/schemas/{entity_name}", summary="Eliminar esquema dinámico")
async def delete_dynamic_schema_endpoint(entity_name: str, user_data: dict = Depends(get_current_user_and_role)):
    return await delete_schema(user_data["companyId"], entity_name)

@dynamic_entities_router.post("/{entity_name}", summary="Crear un nuevo documento de entidad (Create)")
async def create_dynamic_entity_endpoint(entity_name: str, data: str = Form(...), file: UploadFile = File(None), user_data: dict = Depends(get_current_user_and_role)):
    return await create_entity(user_data["companyId"], entity_name, data, file)
@dynamic_entities_router.get("/{entity_name}", summary="Obtener todos los documentos de una entidad (Read All)")
async def get_all_dynamic_entities_endpoint(entity_name: str, user_data: dict = Depends(get_current_user_and_role)):
    return await get_all_entities(user_data["companyId"], entity_name)
@dynamic_entities_router.get("/{entity_name}/{doc_id}", summary="Obtener un documento de entidad por ID (Read One)")
async def get_dynamic_entity_endpoint(entity_name: str, doc_id: str, user_data: dict = Depends(get_current_user_and_role)):
    return await get_entity_by_id(user_data["companyId"], entity_name, doc_id)
@dynamic_entities_router.put("/{entity_name}/{doc_id}", summary="Actualizar un documento de entidad (Update)")
async def update_dynamic_entity_endpoint(entity_name: str, doc_id: str, data: str = Form(...), file: UploadFile = File(None), user_data: dict = Depends(get_current_user_and_role)):
    return await update_entity(user_data["companyId"], entity_name, doc_id, data, file)
@dynamic_entities_router.delete("/{entity_name}/{doc_id}", summary="Eliminar un documento de entidad (Delete)")
async def delete_dynamic_entity_endpoint(entity_name: str, doc_id: str, user_data: dict = Depends(get_current_user_and_role)):
    return await delete_entity(user_data["companyId"], entity_name, doc_id)
@dynamic_entities_router.post("/import/{entity_name}/csv", summary="Importar datos CSV")
async def import_csv_data_endpoint(entity_name: str, file: UploadFile = File(...), user_data: dict = Depends(get_current_user_and_role)):
    return await import_csv(user_data["companyId"], entity_name, file)


# dynamic_router = APIRouter(
#     dependencies=[Depends(check_role(['owner', 'admin', 'editor']))],
#     tags=["Dynamic CRUD"]
# )

# @dynamic_router.post("/{entity_name}/schema", status_code=status.HTTP_201_CREATED, dependencies=[Depends(check_role(['owner', 'admin']))])
# async def create_dynamic_schema(entity_name: str, schema: Dict[str, Dict[str, Any]], user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Define y guarda un esquema de validación para una entidad dinámica.
# """
#     return await create_dynamic_schema_for_company(entity_name, schema, user_data)

# @dynamic_router.post("/{entity_name}", status_code=status.HTTP_201_CREATED)
# async def create_dynamic_entity(entity_name: str, data: Dict[str, Any], user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Crea una nueva entidad dinámica para la empresa del usuario actual.
#     """
#     return await create_dynamic_entity_for_company(entity_name, data, user_data)

# @dynamic_router.get("/{entity_name}")
# async def get_dynamic_entities(entity_name: str, user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Obtiene todas las entidades dinámicas para la empresa del usuario actual.
#     """
#     return await get_all_dynamic_entities_company(entity_name, user_data)

# @dynamic_router.get("/{entity_name}/{doc_id}")
# async def get_dynamic_entity(entity_name: str, doc_id: str, user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Obtiene una entidad dinámica específica para la empresa del usuario actual.
#     """
#     return await get_dynamic_entity_company(entity_name, doc_id, user_data)

# @dynamic_router.put("/{entity_name}/{doc_id}")
# async def update_dynamic_entity(entity_name: str, doc_id: str, data: Dict[str, Any], user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Actualiza una entidad dinámica específica para la empresa del usuario actual.
#     """
#     return await update_dynamic_entity_company(entity_name, doc_id, data, user_data)

# @dynamic_router.post("/import/{entity_name}/csv", dependencies=[Depends(check_role(['owner', 'admin']))])
# async def import_csv_data(entity_name: str, file: UploadFile = File(...), user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Importa datos de un archivo CSV a una colección dinámica.
#     """
#     return await import_csv_data_entity_company(entity_name, file, user_data)
