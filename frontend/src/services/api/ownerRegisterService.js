
const API_BASE_URL = "http://localhost:8001";


export async function registerOwnerCompany(ownerData, token) {
    const url = `${API_BASE_URL}/users/register-owner`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Añade el token al encabezado de autorización
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(ownerData)
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
export async function healthCheck(token) {
    const url = `${API_BASE_URL}/users/health`;

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
            const errorMessage = errorData.detail || 'Error al verificar la salud del servicio.';
            throw new Error(errorMessage);
        }

        return await response.json();

    } catch (error) {
        console.error('Ocurrió un error:', error.message);
        throw error;
    }
}

// Ejemplo de uso
// async function exampleUsage() {
//     const res = await registerOwnerCompany({
//         companyId: "123",
//         nombre: "nierr",
//         email: "adminggg@email.com",
//         rol: "owner"
//     }, "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVmMjQ4ZjQyZjc0YWUwZjk0OTIwYWY5YTlhMDEzMTdlZjJkMzVmZTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHVibGl0cm9uLTMyYTdlIiwiYXVkIjoicHVibGl0cm9uLTMyYTdlIiwiYXV0aF90aW1lIjoxNzU2NzExMTQ1LCJ1c2VyX2lkIjoiY3cxNFB5U2NUVWNqbXVpZmw1cjZlV3FHOHNmMSIsInN1YiI6ImN3MTRQeVNjVFVjam11aWZsNXI2ZVdxRzhzZjEiLCJpYXQiOjE3NTY3MTExNDUsImV4cCI6MTc1NjcxNDc0NSwiZW1haWwiOiJhZG1pbmdnZ0BlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWRtaW5nZ2dAZW1haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.NZzMMpUv6lS2cpdn4fBwmJ_EUr2lL5wkAJHR_8NyyTYL08TjvrOGIAVRnEjJQBUyDqdMa5z6QDSTweq1va5PUBhn7FlcsumswuBun-IAahyuQepp0k0q8FLd_lNhNV-lkH6Yjs1l0JYNwq65Y4T8NbCAuUAIM_vsXzmzxsKXNGO02djOsN1ugElRPN12qZUvaQDMd0I9aOwuxnvWMT9reJspW_vOG_GAc-JfqOHRmQSjPbP1kOgRRPPqkTAfZdRtGvABdhVp86CFsiCmC5pOiHm-4mdncuMaXFEY8LZAGbaYlVTYSoWbGGrKsVhvYm8k-8_eGomapYM8ztiZL0MyQQ");
//     console.log("res",res);
// }




// exampleUsage()