
const API_BASE_URL = "http://localhost:8001";


export async function registerCompany(companyData, token) {
    const url = `${API_BASE_URL}/companies/me`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Añade el token al encabezado de autorización
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(companyData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.detail || 'Error al registrar la empresa.';
            throw new Error(errorMessage);
        }

        return await response.json();

    } catch (error) {
        console.error('Ocurrió un error:', error.message);
        throw error;
    }
}

export async function getCompanyId(token) {
        const url = `${API_BASE_URL}/companies/me/id`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Añade el token al encabezado de autorización
                'Authorization': `Bearer ${token}` 
            },
    
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.detail || 'Error al registrar la empresa.';
            throw new Error(errorMessage);
        }

        return await response.json();

    } catch (error) {
        console.error('Ocurrió un error:', error.message);
        throw error;
    }
    
}