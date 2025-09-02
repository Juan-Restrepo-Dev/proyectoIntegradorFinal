from fastapi import APIRouter, Depends, requests
import json
import base64
import io

from apps.generator.service import generate_image, generate_post_strategy, generate_social_post
from apps.generator.schema import SocialPostRequest
from core.middleware.firebase_auth_guard import check_role, get_current_user_and_role

router =APIRouter()
example_prompt_data_strategy = {
    "plataforma_a_publicar": {
        "plataformas": [
            "Instagram",
            "TikTok",
            "Google Ads"
        ],
        "formatos_preferidos": [
            "Reel",
            "Video de unboxing",
            "Anuncio de carrusel (detalles)",
            "Anuncio de Shopping"
        ],
        "presupuesto_diario": "$20 USD",
        "duracion_campana": "15 días"
    },
    "datos_producto": {
        "nombre": "Nike Nocta Hombre",
        "descripcion_detallada": "Réplica AAA de alta calidad. Creado en colaboración con Drake. Tallas de 37 a 44, disponibles en varios colores. Incluye caja y etiquetas originales.",
        "sku": "NIKENOCTAH1",
        "precio_original": "$110 USD",
        "descuento_aplicado": "Envío gratis a nivel nacional",
        "beneficios_clave_para_el_cliente": [
            "Estilo exclusivo y a la moda",
            "Calidad garantizada (réplica AAA)",
            "Excelente relación calidad-precio",
            "Entrega rápida y segura"
        ],
        "caracteristicas_tecnicas": [
            "Material de alta durabilidad",
            "Réplica AAA",
            "Diseño de edición limitada (colaboración con Drake)",
            "Cómodos para uso diario"
        ]
    },
    "datos_empresa": {
        "nombre_empresa": "Sneaker King",
        "descripcion_completa": "Tienda en línea especializada en réplicas AAA de zapatillas de alta gama. Ofrecemos productos de calidad y las últimas tendencias a precios asequibles.",
        "publico_objetivo": {
            "demografia": "Hombres de 18-30 años, con ingresos medios. Residentes en ciudades principales de Colombia. Amantes del streetwear.",
            "intereses": [
                "Streetwear",
                "moda urbana",
                "colección de tenis",
                "música urbana (hip hop, trap)",
                "influencers de moda masculina"
            ],
            "puntos_de_dolor_a_resolver": [
                "Los tenis originales son demasiado caros",
                "El acceso a modelos de edición limitada es difícil",
                "Miedo a comprar réplicas de mala calidad en línea"
            ]
        },
        "objetivo_estrategico_empresa": "Generar ventas directas de un producto específico para atraer nuevos clientes y fortalecer la imagen de la marca como un proveedor confiable.",
        "ubicacion_operativa": "Medellín, Colombia",
        "canales_de_venta": [
            "Tienda en línea",
            "Instagram DM",
            "WhatsApp"
        ],
        "alcance_geografico_actual": "A nivel nacional en Colombia."
    }
}

@router.get('/google/gest_enerate_strategy')
def test_generate_strategy():
    # data_product = get_item_entity_by_id(id_company, entity, entity_item_id)
    # data_company = get_company_by_id(id_company)
    # prompt_data_strategy = {"plataforma_a_publicar": plataforma_a_publicar, "datos_producto": data_product, "datos_empresa": data_company}
    response = generate_post_strategy()
    return {"response":response}    
    #guardar estrategia y tambien anadir al inidice en la base de datos vectorial con la etiqueta de si se uso o no para sugerencias posteriores
    
@router.get('/google/test_generate_image')
def test_generate_image():


    generate_image()
     #guardar imagen y tambien anadir al inidice en la base de datos vectorial con la etiqueta de si se uso o no para sugerencias posteriores
# user_data: dict = Depends(get_current_user_and_role)
@router.post('/google/generate_social_post')
async def __generate_social_post(basePrompt:SocialPostRequest, user_data: dict = Depends(get_current_user_and_role)): 
    """
    genera un post para redes sociales 
    """
    return await generate_social_post(basePrompt,user_data)

# @router.post('/generate-content')
# async def generate_content():
#     text = generate_text()
#     image_prompt = generate_image_description()
#     image = generate_image(image_prompt)
#     return {
#         {
#         "text": text,
#         "image": image
#         }
#     }  