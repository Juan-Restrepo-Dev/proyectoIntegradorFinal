const API_BASE_URL = "http://localhost:8001";


export async function generateSocialPost(basePrompt,token) {
    const url = `${API_BASE_URL}/ia/generator/google/generate_social_post`;
 console.log("Generando post para redes sociales con el siguiente prompt base....:", JSON.stringify(basePrompt));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Añade el token al encabezado de autorización
                'Authorization': `Bearer ${token}`

            }, body: JSON.stringify(basePrompt)

        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.detail || 'Error al genera el post.';
            throw new Error(errorMessage);
        }

        return await response.json();

    } catch (error) {
        console.error('Ocurrió un error:', error.message);
        throw error;
    }
}


