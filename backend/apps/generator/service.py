from fastapi import Depends
from langchain.prompts import PromptTemplate
from PIL import Image
from io import BytesIO
import json
from core.middleware.firebase_auth_guard import get_current_user_and_role
from core.config import firestore_db
from apps.generator.templates_prompt import format_system_prompt_strategy, format_sytem_prompt_image_description, format_sytem_prompt_text_post
from apps.generator.schema import SocialPostRequest
from shared.services.ai.google.image import generate_ad_content
from shared.services.ai.google.system_instructions import generate_inference_instructions
from shared.utils import raise_error

#pasar a settings
my_project_id = "publitron-32a7e"

"hacer esto dinamico para que pueda sr alterada la respuesta de el llm"
json_schema_stategy = {
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

json_schema_text_post =  { "type":"OBJECT","properties":{ "text": { "type": "STRING" },  "imageMetadata":{ "type": "STRING" }, "videoMetadata":{ "type": "STRING" }} }

json_schema_image_description = {
  "type": "OBJECT",
  "properties": {
    "producto": {
      "type": "STRING"
      
    },
    "estilo": {
      "type": "STRING"
    },
    "ambiente": {
      "type": "STRING"
    },
    "audiencia": {
      "type": "STRING"
    },
    "ubicacion": {
      "type": "STRING"
    },
    "escena": {
      "type": "STRING"
    },
    "foco": {
      "type": "STRING"
    },
    "composicion": {
      "type": "STRING"
    },
    "texto": {
      "type": "STRING"
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
        json_schema_stategy,
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

def generate_post_text(data_post_text):
    if isinstance(data_post_text, dict):
        data_dict = data_post_text
    else:
        data_dict = data_post_text.model_dump() if hasattr(data_post_text, 'model_dump') else data_post_text.dict()
    post_text = generate_inference_instructions(
        format_sytem_prompt_text_post(data_dict),
        str(data_dict),
        json_schema_text_post,
        my_project_id
    )
    return post_text

def generate_image_description(data_image_description):
    if isinstance(data_image_description, dict):
        data_dict = data_image_description
    else:
        data_dict = data_image_description.model_dump() if hasattr(data_image_description, 'model_dump') else data_image_description.dict()
    image_description = generate_inference_instructions(
        format_sytem_prompt_image_description(data_dict),
        str(data_dict),
        json_schema_image_description,
        my_project_id
    )
    return image_description

def generate_image(url,PromptImage,):     

   

    generated_parts = generate_ad_content(
        image_context_url = url,
        prompt_text=PromptImage,
        project_id=my_project_id
    )
 
    print("Partes generadas:", generated_parts)
    for part in generated_parts:
        if part.text is not None:
            print("--- Texto Generado por la IA ---")
            print(part.text)
        if part.inline_data is not None:
            if part.inline_data.data is not None:
                image = Image.open(BytesIO(part.inline_data.data))   
                image.save("generated_image.png")
                print("\n--- Imagen Generada por la IA ---")
                print("Imagen guardada como 'generated_image.png'")
            else:
                print("No se generó imagen.")    
                print("intentandolo nuevamente.")
                generate_image(url,PromptImage)
        else:
            
            print("No se generó imagen hubo un error.")
            

    return "aqui pongo la logica para devolver url de fire storage"





async def generate_social_post(basePrompt:SocialPostRequest,    user_data: dict = Depends(get_current_user_and_role)):
    empresa_id = user_data.get('companyId')
    print(f"Obteniendo datos para la empresa: {empresa_id}")
    company_data_ref = firestore_db.collection('companies').document(empresa_id)
    company_data_doc = company_data_ref.get()
    if not company_data_doc.exists:
        raise raise_error("Datos de la empresa no encontrados.", 404)
    print("Datos de la empresa obtenidos:", company_data_doc.to_dict())
    base_prompt_dict = basePrompt.model_dump()
    print("Datos del prompt base:", base_prompt_dict['product_data']['multimedia']['main_image'])
    base_prompt_dict["company_data"] = company_data_doc.to_dict()
    post_strategy = await generate_post_strategy(base_prompt_dict)
    base_prompt_dict["post_estrategy"] = post_strategy
    post_text = await generate_post_text(base_prompt_dict)
    base_prompt_dict["post_text"] = post_text
    image_description = await generate_image_description(base_prompt_dict)
    base_prompt_dict["image_description"] = image_description
    url = base_prompt_dict['product_data']['multimedia']['main_image']
    PromptImage = f"Como diseñador gráfico, crea una imagen publicitaria: basado en estos datos a tener en cuenta {base_prompt_dict}"
    image_url = generate_image(url,PromptImage)

    return { "post_strategy": post_strategy, "post_text": post_text, "image_description": image_description, "image_url": image_url }
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