// Configuración de ejemplo para Firebase
// Copia este archivo como firebase.config.js y actualiza con tus credenciales

export const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id-aqui"
};

// Instrucciones para obtener estas credenciales:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a Configuración del proyecto > General
// 4. En la sección "Tus apps", haz clic en el ícono de web
// 5. Registra tu app y copia la configuración
// 6. Habilita Authentication en la consola de Firebase
// 7. Configura los proveedores de autenticación (Google, Facebook, Email/Password)

// Después de configurar, actualiza el archivo src/services/firebase/firebaseService.js
// con tus credenciales reales.
