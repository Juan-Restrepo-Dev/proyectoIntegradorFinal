from google import genai
from google.genai import types
from typing import List


async def  generate_inference_instructions(
    system_instructions: str,
    prompt: str,
    json_schema: dict,
    project_id: str,
    location: str = "global",
    model: str = "gemini-2.5-flash-lite",
) -> List[types.Content]:
    """
    Genera una estrategia de publicación utilizando la API de Google Gemini.

    Args:
        system_instructions (str): Las instrucciones para guiar el modelo.
        project_id (str): El ID de tu proyecto de Google Cloud.
        location (str): La ubicación del cliente de Vertex AI (por defecto es "global").
        model (str): El nombre del modelo de Gemini a utilizar (por defecto es "gemini-2.5-flash-lite").

    Returns:
        List[types.Content]: Una lista de objetos de contenido con la respuesta del modelo.
    """
    try:
        # Inicializa el cliente de Gemini
        client = genai.Client(
            vertexai=True,
            project=project_id,
            location=location,
        )
        # prepara las instrucciones del sistema
        text1 = types.Part.from_text(
            text=prompt
        )
        system_instructions = [types.Part.from_text(text=system_instructions)]
        # Crea la lista de contenidos con el rol de 'user'
        contents = [types.Content(role="user", parts=[text1])]
        # Define las categorías de seguridad para desactivarlas
        safety_categories = [
            "HARM_CATEGORY_HATE_SPEECH",
            "HARM_CATEGORY_DANGEROUS_CONTENT",
            "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "HARM_CATEGORY_HARASSMENT",
        ]
        safety_settings = [
            types.SafetySetting(category=cat, threshold="OFF")
            for cat in safety_categories
        ]

        # Configura los parámetros de generación
        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            top_p=0.95,
            max_output_tokens=65535,
            safety_settings=safety_settings,
            response_mime_type="application/json",
            response_schema=json_schema,
            system_instruction=system_instructions,
            thinking_config=types.ThinkingConfig(
                thinking_budget=0,
            ),
        )

        # Realiza la llamada a la API
        response =  client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        )
        print("Respuesta completa de la API:", response)
        # Retorna las partes de la respuesta
        return response.candidates[0].content.parts

    except Exception as e:
        print(f"Ocurrió un error al llamar a la API: {e}")
        return []
