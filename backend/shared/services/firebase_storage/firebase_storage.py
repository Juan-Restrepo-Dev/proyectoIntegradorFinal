
from typing import Optional
from firebase_admin import  storage
# Función de utilidad para subir una imagen a Firebase Storage
async def upload_image_to_storage(file_content: bytes, destination_path: str, content_type: Optional[str] = 'application/octet-stream'):
    """Sube un archivo a Firebase Storage con su tipo de contenido inferido."""
    try:
        bucket = storage.bucket()
        blob = bucket.blob(destination_path)
        blob.upload_from_string(file_content, content_type=content_type)
        blob.make_public()
        return await blob.public_url
    except Exception as e:
        print(f"Error al subir la imagen a Storage: {e}")
        return None