import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth


# Cargar variables de entorno
load_dotenv()


class Settings:
    project_name = os.getenv("PROJECT_NAME")
    project_version = os.getenv("VERSION")
    firebase_credentials_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    firebase_storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET")
    openai_key = os.getenv("OPENAI_API_KEY")
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")


settings = Settings()


# --- Inicialización singleton ---
def _init_firebase():
    try:
        if not firebase_admin._apps:  # Solo inicializar si no está ya inicializado
            cred = credentials.Certificate(settings.firebase_credentials_path)
            app = firebase_admin.initialize_app(
                cred,
                {"storageBucket": settings.firebase_storage_bucket},
            )
            print("Firebase Admin SDK inicializado correctamente.")
        else:
            app = firebase_admin.get_app()

        db = firestore.client(app,database_id="publitron")
        return app, db

    except Exception as e:
        raise RuntimeError(f"Error al inicializar Firebase Admin SDK: {e}")


# Instancias singleton disponibles globalmente
firebase_app, firestore_db = _init_firebase()


