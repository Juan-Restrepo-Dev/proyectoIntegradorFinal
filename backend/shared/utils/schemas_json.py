import json

def merge_schemas(schema1, schema2):
    """
    Combina dos esquemas JSON. Si son idénticos, devuelve uno.
    Si difieren, usa 'anyOf' para representarlos.
    """
    # Si los esquemas son idénticos, devuelve uno
    if schema1 == schema2:
        return schema1

    # Si ya tienen 'anyOf', añade el nuevo esquema si no está presente
    if "anyOf" in schema1:
        if schema2 not in schema1["anyOf"]:
            schema1["anyOf"].append(schema2)
        return schema1

    # Si no tienen 'anyOf', crea uno nuevo con ambos esquemas
    return {"anyOf": [schema1, schema2]}

def generar_esquema_json_dinamico(data):
    """
    Genera un esquema JSON de forma dinámica sin asumir que
    los elementos de la lista tienen el mismo esquema.
    """
    if isinstance(data, dict):
        schema = {"type": "OBJECT", "properties": {}}
        for key, value in data.items():
            schema["properties"][key] = generar_esquema_json_dinamico(value)
        return schema
    elif isinstance(data, list):
        if not data:
            return {"type": "ARRAY", "items": {}}  # Lista vacía

        # Genera el esquema para el primer elemento
        items_schema = generar_esquema_json_dinamico(data[0])

        # Recorre el resto de los elementos y combina sus esquemas
        for i in range(1, len(data)):
            current_item_schema = generar_esquema_json_dinamico(data[i])
            items_schema = merge_schemas(items_schema, current_item_schema)

        return {"type": "ARRAY", "items": items_schema}
    elif isinstance(data, str):
        return {"type": "STRING"}
    elif isinstance(data, int):
        return {"type": "INTEGER"}
    elif isinstance(data, float):
        return {"type": "NUMBER"}
    elif isinstance(data, bool):
        return {"type": "BOOLEAN"}
    elif data is None:
        return {"type": "NULL"}
    else:
        return {"type": "UNKNOWN"}

# Tu objeto de datos de ejemplo
datos_marketing = {
    "titulo_estrategia": "Lanzamiento 'Glow Up' - Campaña de Verano...",
    "objetivo_campana": "Generar ventas directas del nuevo 'Kit Glow Up' y aumentar la conciencia de marca sobre 'Aura Natural' en el mercado colombiano, especialmente en Medellín y ciudades principales.",
    "analisis_publico_objetivo": {
        "perfil_demografico": "Mujeres de 25-45 años...",
        "intereses": "Belleza, cuidado de la piel...",
    },
    "concepto_creativo_publicacion": {
        "tipo_contenido": "Video corto (Reel o TikTok)...",
        "mensaje_principal": "Descubre la rutina de noche...",
    },
    "copys_publicacion": [
        {"enfoque": "Llamativo y Emocional", "texto": "¿Lista para el resplandor natural? ✨..."},
    ],
    "hashtags": ["#AuraNatural", "#GlowUp", "#CosmeticaNatural"],
    "sugerencias_segmentacion": {
        "plataforma": "Facebook & Instagram Ads...",
        "datos_demograficos": "Mujeres, 25-45 años...",
        "intereses_y_comportamientos": "Públicos personalizados...",
    },
    "kpis": ["Tasa de Clics (CTR) en el enlace de la tienda..."],
}

# Genera el esquema
esquema_generado = generar_esquema_json_dinamico(datos_marketing)

# Imprime el resultado de manera legible
print(json.dumps(esquema_generado, indent=2))