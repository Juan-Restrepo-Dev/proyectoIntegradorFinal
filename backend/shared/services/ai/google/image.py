
from google import genai
from typing import List
# from langchain.prompts import PromptTemplate
from google.genai import types
# from PIL import Image
# from io import BytesIO

def generate_ad_content(
    image_context_url: str,
    prompt_text: str,
    project_id: str,
    location: str = "global",
    model: str = "gemini-2.5-flash-image-preview"
) -> List[types.Content]:
    """
       Genera contenido publicitario multimodal (texto e imagen) usando la API de Google Gemini.

    Args:
        image_context_url (str): La ruta del archivo de imagen local a utilizar como referencia o contexto.
        prompt_text (str): El prompt de texto que describe la publicidad.
        project_id (str): El ID de tu proyecto de Google Cloud.
        location (str): La ubicación del cliente de Vertex AI (por defecto es "global").
        model (str): El nombre del modelo de Gemini a utilizar (por defecto es "gemini-2.5-flash-image-preview").

    Returns:
        List[types.Content]: Una lista de objetos de contenido con la respuesta del modelo.þ
    """
    try:
        client = genai.Client(
            vertexai=True,
            project=project_id,
            location=location,
        )
        # muchachos aqui falta definir apartir de el tipo de imagen el mime tipe es decir reconocerlo apartir de como este la estencion del archivo esto hay que hacer dinamico 
        msg_image =  types.Part.from_uri(
            file_uri=image_context_url,
            mime_type="image/jpeg",
        )
        msg_text = types.Part.from_text(text=prompt_text)

        contents = [types.Content(role="user", parts=[msg_image, msg_text])]

        safety_categories = [
            "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_IMAGE_HATE", "HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT",
            "HARM_CATEGORY_IMAGE_HARASSMENT", "HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT",
        ]
        safety_settings = [types.SafetySetting(category=cat, threshold="OFF") for cat in safety_categories]

        generate_content_config = types.GenerateContentConfig(
            temperature=1, top_p=0.95, max_output_tokens=32768, response_modalities=["IMAGE","TEXT"], safety_settings=safety_settings,
        )
        
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        )
        
        return response.candidates[0].content.parts

    except FileNotFoundError as e:
        print(f"Error: {e}")
        return []
    except Exception as e:
        print(f"Ocurrió un error al llamar a la API: {e}")
        return []

# if __name__ == "__main__":
#     # --- Configuración de Datos del Prompt ---
#     prompt_data = {
#         "producto": "Nike Nocta Hombre Réplica AAA SKU NIKENOCTAH1",
#         "estilo": "Deportivo, urbano, premium, minimalista.",
#         "ambiente": "Frío, intenso, determinado, aspiracional.",
#         "audiencia": "Deportistas, juventud (18-30).",
#         "ubicacion": "Medellín, Colombia.",
#         "escena": "Atleta masculino (etnia diversa) en posición de salida en pista de atletismo al amanecer en Medellín. Cielo gélido, pista escarchada. Vaho visible de la respiración.",
#         "foco": "Atleta vistiendo conjunto completo {producto} (chaqueta negra mate, jogger, zapatillas blancas).",
#         "composicion": "Plano medio-cerrado, perspectiva baja.",
#         "texto": "Esto se cuece Cabrones"
#     }

#     # --- Creación del Prompt Template de LangChain ---
#     template_string = """
#     Como diseñador gráfico, crea una imagen publicitaria:
#     Producto Clave: {producto} (Detalles y diseño exactos de la imagen de producto adjunta).
#     Elementos Esenciales Compartidos:
#     Estilo: {estilo}
#     Ambiente: {ambiente}
#     Audiencia: {audiencia}
#     Ubicación: {ubicacion}
#     Escena: {escena}
#     Foco: {foco}
#     Composición: {composicion}
#     Texto: {texto}
#     """
    
#     # 1. Resuelve las variables anidadas en los datos
#     prompt_data['escena'] = prompt_data['escena'].format(ubicacion=prompt_data['ubicacion'])
#     prompt_data['foco'] = prompt_data['foco'].format(producto=prompt_data['producto'])
    
#     # 2. Crea el objeto PromptTemplate con la plantilla y las variables
#     prompt_template = PromptTemplate(
#         template=template_string,
#         input_variables=list(prompt_data.keys())
#     )

#     # 3. Formatea la plantilla con tus datos para obtener el prompt final
#     prompt_final_formateado = prompt_template.format(**prompt_data)

#     my_project_id = "publitron-32a7e"
    
#     generated_parts = generate_ad_content(
#         image_context_url ="https://standshop.com.co/wp-content/uploads/2024/09/9a053d4f-2ae7-4a18-9ca5-435f6b15410f.jpeg",
#         prompt_text=prompt_final_formateado,
#         project_id=my_project_id
#     )

#     print("Partes generadas:", generated_parts)
#     for part in generated_parts:
#       if part.text is not None:
#         print("--- Texto Generado por la IA ---")
#         print(part.text)
#       elif part.inline_data is not None:
#         image = Image.open(BytesIO(part.inline_data.data))   
#         image.save("generated_image.png")
#         print("\n--- Imagen Generada por la IA ---")
#         print("Imagen guardada como 'generated_image.png'")



