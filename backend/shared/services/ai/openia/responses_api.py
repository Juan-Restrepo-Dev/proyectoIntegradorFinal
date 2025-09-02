from openai import OpenAI
import base64

client = OpenAI(api_key="")

def create_file(file_path):
  with open(file_path, "rb") as file_content:
    result = client.files.create(
        file=file_content,
        purpose="vision",
    )
    return result.id
def encode_image(file_path):
    with open(file_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")
    return base64_image

prompt = """Como director creativo, describe una imagen publicitaria impactante: Producto: Nike Nocta Hombre Réplica AAA SKU NIKENOCTAH1 Estilo visual: deportivo Estado de ánimo: frio Audiencia: deportistas y juventud en general La imagen debe: 1. Captar la atención inmediatamente 2. Comunicar el valor del producto 3. Resonar con la audiencia objetivo 4. Seguir las mejores prácticas de la plataformaLa imagen está ambientada en un amanecer helado en una pista de atletismo al aire libre. El cielo es de un azul  5.la imagen debe tener un texto que impacte relacionado al publico pálido y el suelo de tartán está ligeramente húmedo, reflejando la luz tenue. El vaho de la respiración de una persona se condensa en el aire frío. En el centro de la imagen, un atleta masculino de complexión atlética está en posición de salida, vistiendo un conjunto completo de Nike Nocta Hombre Réplica AAA. El conjunto incluye una chaqueta con capucha negra mate, pantalones jogger a juego y zapatillas deportivas blancas con detalles containing all the items in the reference pictures"""

base64_image1 = encode_image("shared\\files\\nocta.png")
# base64_image2 = encode_image("soap.png")
file_id1 = create_file("shared\\files\\nocta.png")
# file_id2 = create_file("incense-kit.png")

response = client.responses.create(
    model="gpt-4.1",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image1}",
                },
                # {
                #     "type": "input_image",
                #     "image_url": f"data:image/jpeg;base64,{base64_image2}",
                # },
                {
                    "type": "input_image",
                    "file_id": file_id1,
                },
                # {
                #     "type": "input_image",
                #     "file_id": file_id2,
                # }
            ],
        }
    ],
    tools=[{"type": "image_generation"}],
)

image_generation_calls = [
    output
    for output in response.output
    if output.type == "image_generation_call"
]

image_data = [output.result for output in image_generation_calls]

if image_data:
    image_base64 = image_data[0]
    with open("gift-basket.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
else:
    print(response.output.content)