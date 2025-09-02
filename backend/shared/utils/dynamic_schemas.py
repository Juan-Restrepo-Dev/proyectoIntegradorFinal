# --- Funciones de Utilidad para la validación de esquema y tipos ---
from typing import Optional, List, Any, Dict
# --- Funciones de Utilidad para la validación de esquema y tipos ---
def cast_value_to_type(value: str, target_type: str) -> Any:
    """Intenta convertir un valor de cadena a un tipo específico."""
    if target_type == 'str':
        return str(value)
    if target_type == 'int':
        try:
            return int(value)
        except (ValueError, TypeError):
            return None # Retorna None para indicar error de conversión
    if target_type == 'float':
        try:
            return float(value)
        except (ValueError, TypeError):
            return None
    if target_type == 'bool':
        return value.lower() in ('true', '1', 't', 'y', 'yes')
    return value

def validate_data_against_schema(data: Dict[str, Any], schema_data: Dict[str, Dict[str, Any]], is_import: bool = False) -> Optional[str]:
    """
    Valida un diccionario de datos contra un esquema.
    Retorna un mensaje de error si falla, o None si es exitoso.
    """
    required_fields = {field for field, props in schema_data.items() if props.get("required", False)}
    data_keys = set(data.keys())

    # Para importaciones, los encabezados del CSV deben coincidir exactamente
    if is_import:
        missing_fields = required_fields - data_keys
        extra_fields = data_keys - required_fields
        error_message = ""
        if missing_fields:
            error_message += f"Faltan campos requeridos: {', '.join(missing_fields)}. "
        if extra_fields:
            error_message += f"Campos adicionales en el archivo: {', '.join(extra_fields)}. "
        if error_message:
            return error_message.strip()
    else: # Para las solicitudes de la API normal, solo se verifica la existencia de campos requeridos
        missing_fields = required_fields - data_keys
        if missing_fields:
            return f"Faltan campos requeridos: {', '.join(missing_fields)}"

    for field, value in data.items():
        if field not in schema_data:
            if not is_import: # Los campos extra se permiten en la API normal si no son requeridos
                continue
            else: # En importación, los campos extra no están permitidos
                 return f"Campo inesperado: '{field}'"
        
        expected_type = schema_data[field].get("type")
        if expected_type:
            # En la importación, el valor ya se convierte en cast_value_to_type
            if not isinstance(value, eval(expected_type)):
                return f"El campo '{field}' debe ser de tipo '{expected_type}'."
    
    return None
