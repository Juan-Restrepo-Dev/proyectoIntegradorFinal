import csv
import json
import uuid
from typing import Any, Dict, Optional
from io import StringIO
from datetime import datetime

from fastapi import Depends, Form,requests,UploadFile, File
from pydantic import ValidationError

from core.middleware.firebase_auth_guard import get_current_user_and_role
from core.config import firestore_db
from shared.services.firebase_storage.firebase_storage import upload_image_to_storage
from shared.utils import raise_error
from shared.utils.dynamic_schemas import cast_value_to_type, validate_data_against_schema

async def get_schema(company_id: str, entity_name: str):
    schema_ref = firestore_db.collection(f'companies/{company_id}/schemas').document(entity_name)
    schema_doc = schema_ref.get()
    if not schema_doc.exists:
        raise_error(f"Esquema para '{entity_name}' no encontrado.",404)
    return schema_doc.to_dict()

async def create_or_update_schema(company_id: str, entity_name: str, schema_data: dict):
    schema_ref = firestore_db.collection(f'companies/{company_id}/schemas').document(entity_name)
    await schema_ref.set(schema_data)
    return {"message": f"Esquema para '{entity_name}' guardado correctamente."}

async def delete_schema(company_id: str, entity_name: str):
    schema_ref = firestore_db.collection(f'companies/{company_id}/schemas').document(entity_name)
    schema_doc = schema_ref.get()
    if not schema_doc.exists:
        raise_error(f"Esquema para '{entity_name}' no encontrado.",404)
    await schema_ref.delete()
    return {"message": f"Esquema para '{entity_name}' eliminado correctamente."}

async def create_entity(company_id: str, entity_name: str, data: str, file: UploadFile):
    """Crea una nueva entidad con sus datos y opcionalmente una imagen de galería."""
    try:
        schema = await get_schema(company_id, entity_name)
        entity_data = json.loads(data)
        
        error_message = validate_data_against_schema(entity_data, schema)
        if error_message:
            raise_error(error_message, 400)
        
        if file and file.filename:
            image_url = await upload_image_to_storage(file, company_id)
            if not image_url:
                raise_error("Error al subir la imagen.", 500)
            
            entity_data['galeria'] = entity_data.get('galeria', [])
            entity_data['galeria'].append({"link": image_url, "descripcion": file.filename})
            
        doc_ref = firestore_db.collection(f'companies/{company_id}/dynamic_entities/{entity_name}').document()
        await doc_ref.set(entity_data)
        
        return {"message": "Documento creado con éxito.", "id": doc_ref.id}
    except json.JSONDecodeError:
        raise_error("Datos de formulario inválidos. Asegúrate de que los datos 'data' son JSON válido.", 400)
    except ValidationError as e:
        raise_error(str(e), 422)
    except Exception as e:
        raise e

async def get_all_entities(company_id: str, entity_name: str):
    """Obtiene todas las entidades de una colección."""
    collection_ref = firestore_db.collection(f'companies/{company_id}/dynamic_entities/{entity_name}')
    docs = collection_ref.stream()
    entities = [{"id": doc.id, **doc.to_dict()} for doc in docs]
    return {"entities": entities}

async def get_entity_by_id(company_id: str, entity_name: str, doc_id: str):
    """Obtiene una entidad específica por su ID."""
    doc_ref = firestore_db.collection(f'companies/{company_id}/dynamic_entities/{entity_name}').document(doc_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise_error("Documento no encontrado.",404)
    return {"id": doc.id, **doc.to_dict()}

async def update_entity(company_id: str, entity_name: str, doc_id: str, data: str, file: UploadFile):
    """Actualiza una entidad existente. Si se provee una imagen, la añade a la galería."""
    try:
        schema = await get_schema(company_id, entity_name)
        entity_data = json.loads(data)
        
        error_message = validate_data_against_schema(entity_data, schema)
        if error_message:
            raise_error(error_message, 400)
        
        if file and file.filename:
            image_url = await upload_image_to_storage(file, company_id)
            if not image_url:
                raise_error("Error al subir la imagen.", 500)

            entity_data['galeria'] = entity_data.get('galeria', [])
            entity_data['galeria'].append({"link": image_url, "descripcion": file.filename})

        doc_ref = firestore_db.collection(f'companies/{company_id}/dynamic_entities/{entity_name}').document(doc_id)
        await doc_ref.update(entity_data)
        
        return {"message": "Documento actualizado con éxito.", "id": doc_id}
    except json.JSONDecodeError:
        raise_error("Datos de formulario inválidos. Asegúrate de que los datos 'data' son JSON válido.", 400)
    except Exception as e:
        if "No document to update" in str(e):
             raise_error("Documento no encontrado para actualizar.",404)
        raise e

async def delete_entity(company_id: str, entity_name: str, doc_id: str):
    """Elimina una entidad por su ID."""
    doc_ref = firestore_db.collection(f'companies/{company_id}/dynamic_entities/{entity_name}').document(doc_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise_error("Documento no encontrado.",404)
    await doc_ref.delete()
    return {"message": "Documento eliminado con éxito."}

async def import_csv(company_id: str, entity_name: str, file: UploadFile):
    if not file.filename.endswith('.csv'):
        raise_error("El archivo debe ser un CSV.", 400)

    contents = await file.read()
    decoded_content = contents.decode('utf-8')
    csv_reader = csv.DictReader(StringIO(decoded_content))
    
    schema = await get_schema(company_id, entity_name)
    
    batch = firestore_db.batch()
    collection_ref = firestore_db.collection(f'companies/{company_id}/dynamic_entities/{entity_name}')
    
    for row in csv_reader:
        error_message = validate_data_against_schema(row, schema, is_import=True)
        if error_message:
            raise_error(f"Error en el CSV: {error_message}", 400)

        # Convertir tipos de datos
        converted_row = {}
        for field, value in row.items():
            field_schema = schema.get(field)
            if field_schema:
                target_type = field_schema.get("type")
                if target_type:
                    converted_value = cast_value_to_type(value, target_type)
                    if converted_value is None:
                        raise_error(f"Error de conversión para el campo '{field}' con valor '{value}'", 400)
                    converted_row[field] = converted_value
            else:
                converted_row[field] = value # Si el campo no está en el esquema, se pasa tal cual

        doc_ref = collection_ref.document()
        batch.set(doc_ref, converted_row)
        
    await batch.commit()
    
    return {"message": f"Se importaron {len(csv_reader.fieldnames)} filas correctamente."}


# async def create_dynamic_schema_for_company(entity_name: str, schema: Dict[str, Dict[str, Any]], user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Define y guarda un esquema de validación para una entidad dinámica.
#     """
#     empresa_id = user_data.get('companyId')
#     schema_ref = firestore_db.collection(f'empresas/{empresa_id}/schemas').document(entity_name)

#     if schema_ref.get().exists:
#         raise  raise_error(f"El esquema para '{entity_name}' ya existe. Usa PUT para actualizarlo.",409)

#     schema_ref.set(schema)
#     return {"message": f"Esquema para '{entity_name}' creado con éxito."}


# async def create_dynamic_entity_for_company(
#     entity_name: str, 
#     user_data: dict = Depends(get_current_user_and_role),
#     data: str = Form(...),
#     image: Optional[UploadFile] = File(None)
# ):
#     """
#     Crea un nuevo documento en una colección dinámica validando contra su esquema.
#     Puede recibir un cuerpo JSON o un formulario con JSON y un archivo de imagen.
#     """
#     empresa_id = user_data.get('companyId')
    
#     # Obtener el esquema de la entidad
#     schema_doc = firestore_db.collection(f'empresas/{empresa_id}/schemas').document(entity_name).get()
#     if not schema_doc.exists:
#         raise raise_error("Esquema para '{entity_name}' no encontrado. Por favor, crea uno primero.",404)
        
#     schema = schema_doc.to_dict()

#     # Cargar y parsear los datos
#     try:
#         record_data = json.loads(data)
#     except json.JSONDecodeError:
#         raise raise_error("Datos JSON inválidos.", 400)

#     # Si se sube una imagen, procesarla
#     if image:
#         try:
#             content_type = image.content_type
#             if not content_type or not content_type.startswith('image/'):
#                 raise ValueError("El archivo subido no es una imagen válida.")
                
#             file_ext_map = {
#                 "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
#                 "image/svg+xml": "svg", "image/webp": "webp"
#             }
#             file_ext = file_ext_map.get(content_type, "jpg")
#             filename = f"{uuid.uuid4()}.{file_ext}"
#             destination_path = f"empresas/{empresa_id}/{entity_name}/{filename}"
            
#             image_content = await image.read()
#             image_url = upload_image_to_storage(image_content, destination_path, content_type)
            
#             if image_url:
#                 # Si el campo 'galeria' ya existe, añadir la nueva imagen. Si no, crearlo.
#                 if 'galeria' not in record_data:
#                     record_data['galeria'] = []
#                 record_data['galeria'].append({
#                     "link": image_url,
#                     "descripcion": image.filename,
#                     "fecha_anadido": datetime.now().isoformat()
#                 })
#         except Exception as e:
#             print(f"Error al subir la imagen: {e}")
#             raise raise_error("Ocurrió un error al procesar y subir la imagen.", 500)

#     # Validar los datos finales contra el esquema
#     error_message = validate_data_against_schema(record_data, schema)
#     if error_message:
#         raise raise_error(error_message, 400)
    
#     collection_ref = firestore_db.collection(f'empresas/{empresa_id}/{entity_name}')
#     new_doc_ref = collection_ref.add(record_data)
    
#     return {"message": f"Documento creado en la colección '{entity_name}'.", "id": new_doc_ref[1].id}



# async def get_all_dynamic_entities_company(entity_name: str, user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Obtiene todos los documentos de una colección dinámica.
#     """
#     empresa_id = user_data.get('companyId')
#     collection_ref = firestore_db.collection(f'empresas/{empresa_id}/{entity_name}')
#     docs = collection_ref.stream()
    
#     entities_list = [{"id": doc.id, **doc.to_dict()} for doc in docs]
#     return {"entities": entities_list}


# async def get_dynamic_entity_company(entity_name: str, doc_id: str, user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Obtiene un documento específico de una colección dinámica.
#     """
#     empresa_id = user_data.get('companyId')
#     doc_ref = firestore_db.collection(f'companies/{empresa_id}/{entity_name}').document(doc_id)
#     doc = doc_ref.get()
    
#     if not doc.exists:
#        print(f"Documento con ID '{doc_id}' no encontrado en '{entity_name}'.")

#     return {"id": doc.id, **doc.to_dict()}


# async def update_dynamic_entity_company(
#     entity_name: str, 
#     doc_id: str, 
#     data: str = Form(...),
#     image: Optional[UploadFile] = File(None),
#     user_data: dict = Depends(get_current_user_and_role)
# ):
#     """
#     Actualiza un documento específico en una colección dinámica validando contra su esquema.
#     Puede recibir un cuerpo JSON y un archivo de imagen.
#     """
#     empresa_id = user_data.get('companyId')
#     doc_ref = firestore_db.collection(f'empresas/{empresa_id}/{entity_name}').document(doc_id)
#     doc = doc_ref.get()
    
#     if not doc.exists:
#         raise raise_error(f"Documento no encontrado en '{entity_name}'.", 404)

#     schema_doc = firestore_db.collection(f'empresas/{empresa_id}/schemas').document(entity_name).get()
#     if not schema_doc.exists:
#         raise raise_error(f"Esquema para '{entity_name}' no encontrado. Por favor, crea uno primero.", 404)

#     # Cargar y parsear los datos
#     try:
#         updated_data = json.loads(data)
#     except json.JSONDecodeError:
#         raise raise_error("Datos JSON inválidos.", 400)

#     # Si se sube una nueva imagen, procesarla
#     if image:
#         try:
#             content_type = image.content_type
#             if not content_type or not content_type.startswith('image/'):
#                 raise ValueError("El archivo subido no es una imagen válida.")
                
#             file_ext_map = {
#                 "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
#                 "image/svg+xml": "svg", "image/webp": "webp"
#             }
#             file_ext = file_ext_map.get(content_type, "jpg")
#             filename = f"{uuid.uuid4()}.{file_ext}"
#             destination_path = f"empresas/{empresa_id}/{entity_name}/{filename}"
            
#             image_content = await image.read()
#             image_url = upload_image_to_storage(image_content, destination_path, content_type)
            
#             if image_url:
#                 # Si el campo 'galeria' no existe, lo inicializamos. Si no, añadimos la nueva imagen.
#                 if 'galeria' not in updated_data:
#                     updated_data['galeria'] = doc.to_dict().get('galeria', [])
#                 updated_data['galeria'].append({
#                     "link": image_url,
#                     "descripcion": image.filename,
#                     "fecha_anadido": datetime.now().isoformat()
#                 })
#         except Exception as e:
#             print(f"Error al subir la imagen: {e}")
#             raise raise_error("Ocurrió un error al procesar y subir la imagen.", 500)

#     # Validar los datos finales contra el esquema
#     error_message = validate_data_against_schema(updated_data, schema_doc.to_dict())
#     if error_message:
#         raise raise_error(error_message, 400)
        
#     doc_ref.update(updated_data)
#     return {"message": f"Documento actualizado en la colección '{entity_name}'."}


# async def delete_dynamic_entity_company(entity_name: str, doc_id: str, user_data: dict = Depends(get_current_user_and_role)):
#     """
#     Elimina un documento específico de una colección dinámica.
#     """
#     empresa_id = user_data.get('companyId')
#     doc_ref = firestore_db.collection(f'empresas/{empresa_id}/{entity_name}').document(doc_id)
    
#     if not doc_ref.get().exists:
#         raise raise_error(f"Documento no encontrado en '{entity_name}'.", 404)

#     doc_ref.delete()
#     return {"message": f"Documento eliminado de la colección '{entity_name}'."}


# async def import_csv_data_entity_company(entity_name: str, file: UploadFile = File(...), user_data: dict = Depends(get_current_user_and_role)):
    # """
    # Importa datos de un archivo CSV a una colección dinámica.
    # Requiere que exista un esquema para la entidad.
    # Acceso: 'owner', 'admin'.
    # Si el CSV contiene una columna 'galeria', se leerán los links,
    # se subirán las imágenes a Storage y se guardarán los nuevos enlaces en Firestore.
    # """
    # empresa_id = user_data.get('companyId')
    
    # # 1. Obtener el esquema de la entidad
    # schema_doc = firestore_db.collection(f'empresas/{empresa_id}/schemas').document(entity_name).get()
    # if not schema_doc.exists:
    #     raise raise_error(f"Esquema para '{entity_name}' no encontrado. Crea un esquema antes de importar datos.", 404)
    # schema = schema_doc.to_dict()

    # try:
    #     content = await file.read()
    #     csv_file = StringIO(content.decode('utf-8'))
    #     csv_reader = csv.DictReader(csv_file)
        
    #     records_to_save = []
    #     errors = []

    #     # 2. Iterar sobre las filas y validar/convertir
    #     for i, row in enumerate(csv_reader):
    #         clean_row = {k.strip(): v.strip() for k, v in row.items()}
    #         record = {}
    #         row_errors = []
            
    #         # --- Manejo de la columna 'galeria' ---
    #         gallery_data = []
    #         if 'galeria' in clean_row and clean_row['galeria']:
    #             image_links = clean_row['galeria'].split(',')
    #             for link in image_links:
    #                 link = link.strip()
    #                 if not link:
    #                     continue
    #                 try:
    #                     response = requests.get(link, stream=True)
    #                     response.raise_for_status() # Lanza un error si el request es inválido
                        
    #                     # Infiere el tipo de contenido de la imagen de la respuesta HTTP
    #                     content_type = response.headers.get('Content-Type')
    #                     if not content_type or not content_type.startswith('image/'):
    #                         raise ValueError(f"URL de imagen inválida o tipo de contenido no es una imagen: '{link}'")

    #                     # Mapea tipos MIME a extensiones de archivo para el nombre
    #                     mime_to_ext = {
    #                         "image/jpeg": "jpg",
    #                         "image/png": "png",
    #                         "image/gif": "gif",
    #                         "image/svg+xml": "svg",
    #                         "image/webp": "webp"
    #                     }
    #                     file_ext = mime_to_ext.get(content_type, "jpg") # Usa .jpg como fallback
                        
    #                     filename = f"{uuid.uuid4()}.{file_ext}"
    #                     destination_path = f"empresas/{empresa_id}/{entity_name}/{filename}"
                        
    #                     # Pasa el content_type inferido a la función de subida
    #                     image_url = upload_image_to_storage(response.content, destination_path, content_type)
    #                     if image_url:
    #                         gallery_data.append({
    #                             "link": image_url,
    #                             "descripcion": f"Imagen para {entity_name}",
    #                             "fecha_anadido": datetime.now().isoformat()
    #                         })
    #                     else:
    #                         row_errors.append(f"No se pudo subir la imagen desde '{link}'.")

    #                 except (requests.exceptions.RequestException, ValueError) as e:
    #                     row_errors.append(f"Error con la URL de la imagen '{link}': {e}")
            
    #         if gallery_data:
    #             record['galeria'] = gallery_data

    #         # 3. Validar y convertir los otros campos
    #         for field, props in schema.items():
    #             if field == 'galeria':
    #                 continue # Ya se ha manejado
                
    #             value = clean_row.get(field)
    #             if props.get('required') and not value:
    #                 row_errors.append(f"El campo '{field}' es requerido.")
    #                 continue
                
    #             if value is not None:
    #                 converted_value = cast_value_to_type(value, props['type'])
    #                 if converted_value is None and props['type'] != 'str':
    #                      row_errors.append(f"El campo '{field}' debe ser de tipo '{props['type']}'.")
    #                 record[field] = converted_value
            
    #         if row_errors:
    #             errors.append(f"Fila {i+2} (encabezado): " + " | ".join(row_errors))
    #         else:
    #             records_to_save.append(record)
        
    #     if errors:
    #         raise raise_error({"message": "Errores de validación encontrados en el archivo.", "errors": errors},400)
    #     # 4. Guardar los datos en Firestore usando una escritura por lotes
    #     batch = firestore_db.batch()
    #     collection_ref = firestore_db.collection(f'empresas/{empresa_id}/{entity_name}')
    #     for record in records_to_save:
    #         doc_ref = collection_ref.document()
    #         batch.set(doc_ref, record)
        
    #     await batch.commit()
        
    #     return {"message": f"Importación exitosa. {len(records_to_save)} documentos creados en '{entity_name}'."}

    # except Exception as e:
    #     print(f"Error en la importación de CSV: {e}")
    #     raise raise_error("'message': 'Ocurrió un error al procesar el archivo CSV.'",500)