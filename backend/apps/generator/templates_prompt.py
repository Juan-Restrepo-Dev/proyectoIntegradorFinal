from langchain.prompts import PromptTemplate
import json

def format_system_prompt_strategy(prompt_data):
    # Serializar los diccionarios de datos a cadenas JSON
    plataform_json = json.dumps(prompt_data["platform_to_publish"], indent=2)
    product_json = json.dumps(prompt_data["product_data"], indent=2)
    company_json = json.dumps(prompt_data["company_data"], indent=2)
    
    template_string = """
    Eres un experto en marketing digital con una amplia experiencia en la creación de estrategias efectivas para redes sociales. Tu tarea es generar una estrategia de marketing detallada para una publicación en Facebook o Instagram, utilizando la información de la empresa y del producto proporcionada.
    La estrategia debe incluir los siguientes elementos:
    1.  **Título de la Estrategia:** Un nombre claro y conciso para la campaña.
    2.  **Objetivo de la Campaña:** ¿Qué se busca lograr con esta publicación? (Ej. Aumentar ventas, generar leads, aumentar el reconocimiento de marca).
    3.  **Análisis del Público Objetivo:** Basado en la información de la empresa, describe el perfil del cliente ideal.
    4.  **Concepto Creativo de la Publicación:** Ideas para el tipo de contenido visual (imagen, video, carrusel, Reel) y el mensaje principal.
    5.  **Copy (Texto) para la Publicación:** Redacta al menos tres opciones de texto con diferentes enfoques (llamativo, informativo, directo) que incluyan un llamado a la acción (CTA) claro.
    6.  **Hashtags:** Propón un conjunto de hashtags relevantes, incluyendo algunos de nicho, de marca y populares.
    7.  **Sugerencias de Segmentación:** Recomendaciones para la segmentación del anuncio (intereses, datos demográficos, comportamientos).
    8.  **Indicadores Clave de Rendimiento (KPIs):** ¿Cómo se medirá el éxito de la publicación? (Ej. Tasa de clics (CTR), conversiones, alcance).
    *la empresa te entrega esta lista de requisitos* **Datos a considerar:**
    "plataforma_a_publicar":{platform_to_publish},
    "product_data":{product_data},
    "company_data":{company_data}
    ---
    importante! debes responder en estructura json  usando como partida de cada objeto cada uno de los 8 puntos anteriores No omitas ninguna si omites alguna la respuesta sera Erronea ejemplo de la estructura que debes seguir: {{
    "titulo_estrategia": {{"Lanzamiento 'Glow Up' - Campaña de Verano"}},
    "objetivo_campana": {{"Generar ventas directas del nuevo producto 'Kit Glow Up' y aumentar la conciencia de marca sobre 'Aura Natural' en el mercado colombiano, especialmente en Medellín y ciudades principales."}},
    "analisis_publico_objetivo": {{
        "perfil_demografico": "Mujeres de 25-45 años, con ingresos medios-altos, residentes en Medellín y otras áreas urbanas de Colombia. Profesionales, estudiantes o madres, con un estilo de vida consciente de la salud y el bienestar.",
        "intereses": "Belleza, cuidado de la piel, productos naturales, cosmética vegana, sostenibilidad, bienestar personal, rutinas de noche, cuidado facial."
    }},
    "concepto_creativo_publicacion": {{
        "tipo_contenido": "Video corto (Reel o TikTok) que muestre la rutina de uso de los 3 productos de forma atractiva y relajante. El concepto se centra en el 'ritual de belleza nocturno' como un momento de autocuidado. Alternativa: Carrusel de imágenes que muestre los productos individualmente con sus ingredientes clave y beneficios.",
        "mensaje_principal": "Descubre la rutina de noche que tu piel amará. Ilumina tu rostro de forma natural con el Kit 'Glow Up'."
    }},
    "copys_publicacion": [
        {{
        "enfoque": "Llamativo y Emocional",
        "texto": "¿Lista para el resplandor natural? ✨ Nuestro Kit 'Glow Up' es la clave para una piel radiante. Con un 20% de descuento de lanzamiento, es el momento perfecto para consentirte. ¡No esperes más! Haz clic para comprar. #AuraNatural #GlowUp #PielRadiante"
        }},
        {{
        "enfoque": "Informativo y Detallado",
        "texto": "Presentamos el Kit 'Glow Up': Limpiador facial, sérum de Vitamina C y crema hidratante. 🌿 Formulado con ingredientes 100% naturales, este set está diseñado para nutrir y revitalizar tu piel mientras duermes. Ideal para pieles sensibles y libre de parabenos. Aprovecha el 20% de descuento de lanzamiento y obtén la rutina completa. Más información en el link de la bio. #CuidadoDeLaPiel #RutinaDeNoche #CosmeticaNatural"
        }},
        {{
        "enfoque": "Directo y con Llamado a la Acción (CTA) fuerte",
        "texto": "¡Oferta exclusiva! Consigue el nuevo Kit 'Glow Up' con un 20% de descuento. Stock limitado. ¡Haz tu pedido hoy y comienza a transformar tu piel! Clic en el enlace para comprar. 👉 [Link a la tienda] #OfertaCosmetica #Lanzamiento #AuraNatural"
        }}
    ],
    "hashtags": [
        "#AuraNatural",
        "#GlowUp",
        "#CosmeticaNatural",
        "#CuidadoDeLaPiel",
        "#PielRadiante",
        "#RutinaDeNoche",
        "#ProductosVeganos",
        "#HechoEnColombia",
        "#Medellin"
    ],
    "sugerencias_segmentacion": {{
        "plataforma": "Facebook & Instagram Ads",
        "datos_demograficos": "Mujeres, 25-45 años, residiendo en Medellín, Bogotá, Cali y Barranquilla. Idioma español. Intereses en cosmética, salud y bienestar.",
        "intereses_y_comportamientos": "Públicos personalizados (si aplica) de visitantes a la web, interés en marcas de cosmética natural, spa, bienestar, sostenibilidad, cuidado facial. Comportamiento de compra online reciente."
    }},
    "kpis": [
        "Tasa de Clics (CTR) en el enlace de la tienda: Objetivo > 2%",
        "Costo por Adquisición (CPA): Mantener bajo el costo por cada venta.",
        "Número de ventas generadas directamente por la campaña.",
        "Alcance y frecuencia de la publicación.",
        "Tasa de interacción (Engagement Rate) > 5%."
    ]
    }}
    """
    
    # Crear el objeto PromptTemplate. Las variables de entrada son las claves del diccionario raíz.
    prompt = PromptTemplate(
        input_variables=["platform_to_publish", "product_data", "company_data"],
        template=template_string,
    )

    # Formatear el prompt final pasando los strings JSON como valores de las variables.
    final_prompt = prompt.format(
        platform_to_publish=plataform_json,
        product_data=product_json,
        company_data=company_json
    )
    
    return final_prompt

def format_sytem_prompt_text_post():
    pass
     # Serializar los diccionarios de datos a cadenas JSON
#     plataform_json = json.dumps(prompt_data["strategy"]["plataforma_a_publicar"], indent=2)
#     product_json = json.dumps(prompt_data["product_data"], indent=2)
#     company_json = json.dumps(prompt_data["company_data"], indent=2)
    
#     template_string = 
#     {
#     "plataforma_a_publicar": {
#         "plataformas": [
#             "Instagram",
#             "TikTok",
#             "Google Ads"
#         ],
#         "formatos_preferidos": [
#             "Reel",
#             "Video de unboxing",
#             "Anuncio de carrusel (detalles)",
#             "Anuncio de Shopping"
#         ],
#         "presupuesto_diario": "$20 USD",
#         "duracion_campana": "15 días"
#     },
#     "product_data": {
#         "nombre": "Nike Nocta Hombre",
#         "descripcion_detallada": "Réplica AAA de alta calidad. Creado en colaboración con Drake. Tallas de 37 a 44, disponibles en varios colores. Incluye caja y etiquetas originales.",
#         "sku": "NIKENOCTAH1",
#         "precio_original": "$110 USD",
#         "descuento_aplicado": "Envío gratis a nivel nacional",
#         "beneficios_clave_para_el_cliente": [
#             "Estilo exclusivo y a la moda",
#             "Calidad garantizada (réplica AAA)",
#             "Excelente relación calidad-precio",
#             "Entrega rápida y segura"
#         ],
#         "caracteristicas_tecnicas": [
#             "Material de alta durabilidad",
#             "Réplica AAA",
#             "Diseño de edición limitada (colaboración con Drake)",
#             "Cómodos para uso diario"
#         ]
#     },
#     "company_data": {
#         "nombre_empresa": "Sneaker King",
#         "descripcion_completa": "Tienda en línea especializada en réplicas AAA de zapatillas de alta gama. Ofrecemos productos de calidad y las últimas tendencias a precios asequibles.",
#         "publico_objetivo": {
#             "demografia": "Hombres de 18-30 años, con ingresos medios. Residentes en ciudades principales de Colombia. Amantes del streetwear.",
#             "intereses": [
#                 "Streetwear",
#                 "moda urbana",
#                 "colección de tenis",
#                 "música urbana (hip hop, trap)",
#                 "influencers de moda masculina"
#             ],
#             "puntos_de_dolor_a_resolver": [
#                 "Los tenis originales son demasiado caros",
#                 "El acceso a modelos de edición limitada es difícil",
#                 "Miedo a comprar réplicas de mala calidad en línea"
#             ]
#         },
#         "objetivo_estrategico_empresa": "Generar ventas directas de un producto específico para atraer nuevos clientes y fortalecer la imagen de la marca como un proveedor confiable.",
#         "ubicacion_operativa": "Medellín, Colombia",
#         "canales_de_venta": [
#             "Tienda en línea",
#             "Instagram DM",
#             "WhatsApp"
#         ],
#         "alcance_geografico_actual": "A nivel nacional en Colombia."
#     }
# }
#     {
#   "response": [
#     {
#       "titulo_estrategia": "Sneaker King: Estilo Drake al Alcance - Campaña Nike Nocta",
#       "objetivo_campana": "Generar ventas directas del modelo Nike Nocta Hombre, atraer nuevos clientes al ecosistema de Sneaker King y posicionar la marca como referente en réplicas AAA de alta calidad.",
#       "analisis_publico_objetivo": {
#         "perfil_demografico": "Hombres de 18 a 30 años, con ingresos medios, residentes en ciudades principales de Colombia (Bogotá, Medellín, Cali, Barranquilla). Interesados en moda urbana y coleccionismo de zapatillas.",
#         "intereses": "Streetwear, moda urbana, colecciones de tenis exclusivas, música urbana (hip hop, trap), cultura sneaker, influencers de moda masculina, marcas deportivas de alta gama (Nike, Jordan)."
#       },
#       "concepto_creativo_publicacion": {
#         "tipo_contenido": "Video corto tipo Reel/TikTok mostrando un 'unboxing' rápido y dinámico del Nike Nocta Hombre, destacando detalles de calidad (costuras, materiales, logo). Seguido por un clip corto de alguien usándolas en un contexto urbano/streetwear. Alternativamente, un carrusel de imágenes de alta calidad mostrando el producto desde diferentes ángulos, los colores disponibles y un slide final con el beneficio del envío gratis.",
#         "mensaje_principal": "Eleva tu estilo con el exclusivo Nike Nocta, diseñado con Drake. Calidad AAA y envío gratis a todo Colombia. ¡El look que buscas, a tu alcance!"
#       },
#       "copys_publicacion": [
#         {
#           "enfoque": "Llamativo y Coleccionista",
#           "texto": "¡Directo de la colaboración con Drake! 🦉🔥 Las Nike Nocta Hombre ya están aquí. Réplicas AAA con la calidad que mereces y el estilo que buscas. ¡No te quedes sin las tuyas! Envío GRATIS a nivel nacional. 🇨🇴 Haz tu pedido por DM o WhatsApp. #NikeNocta #Drake #SneakerKing #StreetwearColombia #ModaUrbana #TenisAAA"
#         },
#         {
#           "enfoque": "Informativo y con Beneficios",
#           "texto": "¿Cansado de precios imposibles? 🤔 Sneaker King te trae el Nike Nocta Hombre (Réplica AAA) en tallas 37-44, varios colores. Disfruta de materiales de alta durabilidad y el diseño exclusivo de Drake. ¡Lo mejor? ¡ENVÍO GRATIS a toda Colombia! 📦 Visita nuestra tienda en línea o contáctanos por WhatsApp para más info. #SneakerHead #ReplicaAAA #CalidadGarantizada #EnvioGratis #ModaMasculina #Nike"
#         },
#         {
#           "enfoque": "Directo y de Urgencia",
#           "texto": "¡Últimas unidades del Nike Nocta Hombre (Réplica AAA)! 🚀 Diseñado con Drake, calidad top, y ¡te lo enviamos GRATIS a casa! 🏠 Tallas disponibles: 37-44. ¡No dejes pasar esta oportunidad! Compra ahora vía DM o WhatsApp. ¡Stock limitado! #SneakerKing #NikeNocta #EdicionLimitada #Descuento #CompraOnline #TenisColombia"
#         }
#       ],
#       "hashtags": [
#         "#NikeNocta",
#         "#Drake",
#         "#SneakerKing",
#         "#StreetwearColombia",
#         "#ModaUrbana",
#         "#TenisAAA",
#         "#ReplicaAAA",
#         "#SneakerHead",
#         "#ModaMasculina",
#         "#Colombia",
#         "#MedellinStreetwear",
#         "#HipHopCulture"
#       ],
#       "sugerencias_segmentacion": {
#         "plataforma": "Instagram Ads y TikTok Ads",
#         "datos_demograficos": "Hombres, 18-30 años. Residentes en: Bogotá D.C., Medellín, Cali, Barranquilla, Cartagena, Pereira, Bucaramanga. Idioma: Español.",
#         "intereses_y_comportamientos": "Intereses en: Streetwear, Moda urbana, Zapatillas deportivas, Nike, Jordan, Drake, Hip hop, Trap, Música urbana, Influencers de moda masculina, Compras online. Comportamientos: Compradores que interactuaron con el comercio electrónico. Audiencias similares a clientes existentes (si se tienen datos)."
#       },
#       "kpis": [
#         "Tasa de Clics (CTR) en el enlace/botón de compra: Objetivo > 2.5%",
#         "Costo por Adquisición (CPA): Mantener por debajo de $15 USD por venta.",
#         "Número de Ventas directas generadas (conversiones).",
#         "Alcance y Frecuencia de la publicación.",
#         "Tasa de Interacción (Engagement Rate) en Instagram/TikTok: Objetivo > 4%.",
#         "Costo por Visualización del video (si aplica)."
#       ]
#     }
#   ]
# }
    
# Los datos de de ejemplo que recibiría la función


# Llamar a la función y obtener el prompt formateado
# final_prompt_output = format_post_strategy(prompt_data_example)

# Imprimir el resultado
# print(final_prompt_output)