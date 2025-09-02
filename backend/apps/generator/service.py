from fastapi import Depends
from langchain.prompts import PromptTemplate
from PIL import Image
from io import BytesIO
import json
from core.middleware.firebase_auth_guard import get_current_user_and_role
from core.config import firestore_db
from apps.generator.templates_prompt import format_system_prompt_strategy
from apps.generator.schema import SocialPostRequest
from shared.services.ai.google.image import generate_ad_content
from shared.services.ai.google.system_instructions import generate_inference_instructions
from shared.utils import raise_error

#pasar a settings
my_project_id = "publitron-32a7e"

"hacer esto dinamico para que pueda sr alterada la respuesta de el llm"
json_schema = {
    "type":"OBJECT",
    "properties":{
        "titulo_estrategia":{
            "type":"STRING"
        },
        "objetivo_campana":{
            "type":"STRING"
        },
        "analisis_publico_objetivo":{
            "type":"OBJECT",
            "properties":{
                "perfil_demografico":{
                "type":"STRING"
                },
                "intereses":{
                "type":"STRING"
                }
            }
        },
        "concepto_creativo_publicacion":{
            "type":"OBJECT",
            "properties":{
                "tipo_contenido":{
                "type":"STRING"
                },
                "mensaje_principal":{
                "type":"STRING"
                }
            }
        },
        "copys_publicacion":{
            "type":"ARRAY",
            "items":{
                "type":"OBJECT",
                "properties":{
                "enfoque":{
                    "type":"STRING"
                },
                "texto":{
                    "type":"STRING"
                }
                }
            }
        },
        "hashtags":{
            "type":"ARRAY",
            "items":{
                "type":"STRING"
            }
        },
        "sugerencias_segmentacion":{
            "type":"OBJECT",
            "properties":{
                "plataforma":{
                "type":"STRING"
                },
                "datos_demograficos":{
                "type":"STRING"
                },
                "intereses_y_comportamientos":{
                "type":"STRING"
                }
            }
        },
        "kpis":{
            "type":"ARRAY",
            "items":{
                "type":"STRING"
            }
        }
    }
    }


async def generate_post_strategy(data_strategy):
    if isinstance(data_strategy, dict):
        data_dict = data_strategy
    else:
        data_dict = data_strategy.model_dump() if hasattr(data_strategy, 'model_dump') else data_strategy.dict()
    strategy = await generate_inference_instructions(
        format_system_prompt_strategy(data_dict),
        str(data_dict),
        json_schema,
        my_project_id
    )
    response = []
    for part in strategy:
        if part.text is not None:
                print("--- Texto Generado por la IA ---")
                print("estrategia generada:",part.text)
                response.append(json.loads(part.text))
    return response
#   print("estrategia generada:", strategy)

def generate_text(
        context: str,
        style: str = "profesional",
        tone: str = "amigable",
        platform: str = "instagram" ) -> str:
    pass
    
def generate_image_description():
    pass

def generate_image():     
    prompt_data = {
        "producto": "Nike Nocta Hombre Réplica AAA SKU NIKENOCTAH1",
        "estilo": "Deportivo, urbano, premium, minimalista.",
        "ambiente": "Frío, intenso, determinado, aspiracional.",
        "audiencia": "Deportistas, juventud (18-30).",
        "ubicacion": "Medellín, Colombia.",
        "escena": "Atleta masculino (etnia diversa) en posición de salida en pista de atletismo al amanecer en Medellín. Cielo gélido, pista escarchada. Vaho visible de la respiración.",
        "foco": "Atleta vistiendo conjunto completo {producto} (chaqueta negra mate, jogger, zapatillas blancas).",
        "composicion": "Plano medio-cerrado, perspectiva baja.",
        "texto": "Esto se cuece Cabrones"
    }

    # --- Creación del Prompt Template de LangChain ---
    template_string = """
    Como diseñador gráfico, crea una imagen publicitaria:
    Producto Clave: {producto} (Detalles y diseño exactos de la imagen de producto adjunta).
    Elementos Esenciales Compartidos:
    Estilo: {estilo}
    Ambiente: {ambiente}
    Audiencia: {audiencia}
    Ubicación: {ubicacion}
    Escena: {escena}
    Foco: {foco}
    Composición: {composicion}
    Texto: {texto}
    """

    # 1. Resuelve las variables anidadas en los datos
    prompt_data['escena'] = prompt_data['escena'].format(ubicacion=prompt_data['ubicacion'])
    prompt_data['foco'] = prompt_data['foco'].format(producto=prompt_data['producto'])

    # 2. Crea el objeto PromptTemplate con la plantilla y las variables
    prompt_template = PromptTemplate(
        template=template_string,
        input_variables=list(prompt_data.keys())
    )

    # 3. Formatea la plantilla con tus datos para obtener el prompt final
    prompt_final_formateado = prompt_template.format(**prompt_data)

   

    generated_parts = generate_ad_content(
        image_context_url ="https://standshop.com.co/wp-content/uploads/2024/09/9a053d4f-2ae7-4a18-9ca5-435f6b15410f.jpeg",
        prompt_text=prompt_final_formateado,
        project_id=my_project_id
    )
 
    print("Partes generadas:", generated_parts)
    for part in generated_parts:
        if part.text is not None:
            print("--- Texto Generado por la IA ---")
            print(part.text)
        if part.inline_data is not None:
            image = Image.open(BytesIO(part.inline_data.data))   
            image.save("generated_image.png")
            print("\n--- Imagen Generada por la IA ---")
            print("Imagen guardada como 'generated_image.png'")
        else:
            print("No se generó imagen.")







async def generate_social_post(basePrompt:SocialPostRequest,    user_data: dict = Depends(get_current_user_and_role)):
    empresa_id = user_data.get('companyId')
    print(f"Obteniendo datos para la empresa: {empresa_id}")
    company_data_ref = firestore_db.collection('companies').document(empresa_id)
    company_data_doc = company_data_ref.get()
    if not company_data_doc.exists:
        raise raise_error("Datos de la empresa no encontrados.", 404)
    print("Datos de la empresa obtenidos:", company_data_doc.to_dict())
    base_prompt_dict = basePrompt.model_dump()
    base_prompt_dict["company_data"] = company_data_doc.to_dict()
    post_strategy = await generate_post_strategy(base_prompt_dict)

    return res
# Nike Nocta Hombre Réplica AAA


# SKU NIKENOCTAH1

# Tags nike hombre, Nike Nocta, tendencia

# $ 210.000





# Nike NOCTA es una colaboración entre Nike y el artista canadiense Drake. El nombre “NOCTA” proviene de la palabra “nocturna” y está inspirado en el estilo de vida nocturno que Drake menciona como parte de su inspiración.

# 4 disponibles


#    "image": PromptTemplate(
#                 input_variables=["product", "style", "mood", "target_audience"],
#                 template="""
#                 Como director creativo, describe una imagen publicitaria impactante:
                
#                 Producto: Nike Nocta Hombre Réplica AAA SKU NIKENOCTAH1 price:$ 210.000
#                 Estilo visual: deportivo
#                 Estado de ánimo: frio
#                 Audiencia: deportistas y juventud en general
                
#                 La imagen debe:
#                 1. Captar la atención inmediatamente
#                 2. Comunicar el valor del producto
#                 3. Resonar con la audiencia objetivo
#                 4. Seguir las mejores prácticas de la plataforma
#                 """
#             ),