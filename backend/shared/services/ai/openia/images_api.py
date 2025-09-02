import base64
from openai import OpenAI
# from core.config import settings

client = OpenAI(api_key="")

prompt = """Como director creativo, describe una imagen publicitaria impactante: Producto: Nike Nocta Hombre Réplica AAA SKU NIKENOCTAH1 Estilo visual: deportivo Estado de ánimo: frio Audiencia: deportistas y juventud en general La imagen debe: 1. Captar la atención inmediatamente 2. Comunicar el valor del producto 3. Resonar con la audiencia objetivo 4. Seguir las mejores prácticas de la plataformaLa imagen está ambientada en un amanecer helado en una pista de atletismo al aire libre. El cielo es de un azul  5.la imagen debe tener un texto que impacte relacionado al publico pálido y el suelo de tartán está ligeramente húmedo, reflejando la luz tenue. El vaho de la respiración de una persona se condensa en el aire frío. En el centro de la imagen, un atleta masculino de complexión atlética está en posición de salida, vistiendo un conjunto completo de Nike Nocta Hombre Réplica AAA. El conjunto incluye una chaqueta con capucha negra mate, pantalones jogger a juego y zapatillas deportivas blancas con detalles containing all the items in the reference pictures"""

result = client.images.edit(
    model="gpt-image-1",
    image=[
        open("shared\\files\\nocta.png", "rb"),
    ],
    prompt=prompt
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

# Save the image to a file
with open("gift-basket.png", "wb") as f:
    f.write(image_bytes)