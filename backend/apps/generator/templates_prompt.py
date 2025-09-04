from langchain.prompts import PromptTemplate
import json

def format_system_prompt_strategy(prompt_data):
    # Serializar los diccionarios de datos a cadenas JSON
    platform_json = json.dumps(prompt_data["platform_to_publish"], indent=2)
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
        platform_to_publish=platform_json,
        product_data=product_json,
        company_data=company_json
    )
    
    return final_prompt

def format_sytem_prompt_text_post(prompt_data):
    platform_json = json.dumps(prompt_data["platform_to_publish"], indent=2)
    product_json = json.dumps(prompt_data["product_data"], indent=2)
    company_json = json.dumps(prompt_data["company_data"], indent=2)
    post_strategy_json = json.dumps(prompt_data["post_estrategy"], indent=2)

    template_string = """Eres un experto en marketing digital y copywriting, con un profundo conocimiento de las diferentes plataformas de redes sociales. Tu tarea es generar el texto (copy) para una publicación en Facebook o Instagram, basándote en la información proporcionada de la empresa y del producto, y siguiendo una estrategia de contenido específica.

    El texto que generes debe ser persuasivo, atractivo y adaptado a la plataforma seleccionada. No olvides incluir un llamado a la acción (CTA) claro y una selección de hashtags relevantes.

    Datos a considerar:
    "plataforma_a_publicar": {platform_to_publish},
    "product_data": {product_data},
    "company_data": {company_data},
    "post_estrategy": {post_strategy}

    Instrucciones de formato:
      importante! debes responder en estructura json Debes responder únicamente. No incluyas ningún texto introductorio, explicaciones, encabezados, viñetas o cualquier otro formato. La respuesta debe ser un bloque de texto plano, listo para ser copiado y pegado directamente en la red social.
    """
    prompt = PromptTemplate(
        input_variables=["platform_to_publish", "product_data", "company_data", "post_strategy"],
        template=template_string,
    )
    final_prompt = prompt.format(
        platform_to_publish=platform_json,
        product_data=product_json,
        company_data=company_json,
        post_strategy=post_strategy_json
    )
    return final_prompt

def format_system_prompt_image_description(prompt_data):
    platform_json = json.dumps(prompt_data["platform_to_publish"], indent=2)
    product_json = json.dumps(prompt_data["product_data"], indent=2)
    company_json = json.dumps(prompt_data["company_data"], indent=2)
    post_strategy_json = json.dumps(prompt_data["post_estrategy"], indent=2)
    # Serializar post_text correctamente (puede ser objeto Part, lista de Part, o texto)
    def serialize_part(obj):
        if isinstance(obj, list):
            return [serialize_part(item) for item in obj]
        if hasattr(obj, "text"):
            return obj.text
        return obj
    post_text_serializable = serialize_part(prompt_data["post_text"])
    post_text_json = json.dumps(post_text_serializable, indent=2)

    template_string = """Eres un experto en marketing digital con una amplia experiencia en la creación de estrategias visuales y descripciones para redes sociales. Tu tarea es generar una descripción detallada para una publicación visual (imagen o video), basándote en la información de la empresa, del producto y en la estrategia de marketing proporcionada.

    La descripción debe ser concisa y precisa, enfocándose en los elementos visuales clave que un generador de imágenes de IA podría utilizar, como el producto, el estilo, el ambiente, la audiencia, la ubicación, la escena, el foco, la composición y el texto sobre la imagen.

    Asegúrate de incluir todos los siguientes elementos en la estructura de salida. No omitas ninguno.

    Datos a considerar:
    "plataforma_a_publicar": {platform_to_publish},
    "product_data": {product_data},
    "company_data": {company_data},
    "post_estrategy": {post_strategy},
    "post_text": {post_text}

    Ejemplo de la estructura que debes seguir:
    {{
    "producto": "Nike Nocta Hombre Réplica AAA SKU NIKENOCTAH1",
    "estilo": "Deportivo, urbano, premium, minimalista.",
    "ambiente": "Frío, intenso, determinado, aspiracional.",
    "audiencia": "Deportistas, juventud (18-30).",
    "ubicacion": "Medellín, Colombia.",
    "escena": "Atleta masculino (etnia diversa) en posición de salida en pista de atletismo al amanecer en Medellín. Cielo gélido, pista escarchada. Vaho visible de la respiración.",
    "foco": "Atleta vistiendo conjunto completo {{producto}} (chaqueta negra mate, jogger, zapatillas blancas).",
    "composicion": "Plano medio-cerrado, perspectiva baja.",
    "texto": "Esto se cuece Cabrones"
    }}
    """
    prompt = PromptTemplate(
        input_variables=["platform_to_publish", "product_data", "company_data", "post_strategy", "post_text"],
        template=template_string,
    )
    final_prompt = prompt.format(
        platform_to_publish=platform_json,
        product_data=product_json,
        company_data=company_json,
        post_strategy=post_strategy_json,
        post_text=post_text_json
    )
    return final_prompt

