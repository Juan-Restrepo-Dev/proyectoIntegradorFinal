import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";


// debo pasar a archivo enviroments esta variable para hacerlo mas seguro y no dejarlo en el codigo.
const firebaseConfig = {
  apiKey: "AIzaSyAqdWZAiC6guluamVANrsdaVBgiALlL4BA",
  authDomain: "publitron-32a7e.firebaseapp.com",
  projectId: "publitron-32a7e",
  storageBucket: "publitron-32a7e.firebasestorage.app",
  messagingSenderId: "663103560696",
  appId: "1:663103560696:web:cab03478e55dea402ad40d",
  measurementId: "G-S1QFJNJJ4J"
};
class FirebaseServiceClass {
  constructor() {
    this.app = null;
    this.auth = null;
    this.googleProvider = new GoogleAuthProvider();
    this.facebookProvider = new FacebookAuthProvider();
  }

  init() {
    try {
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      
      // Configurar proveedores
      this.googleProvider.addScope("email");
      this.facebookProvider.addScope("email");
      
      // Escuchar cambios de autenticación
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          // Guardar token en sessionStorage
          user.getIdToken().then(token => {
            sessionStorage.setItem("authToken", token);
            sessionStorage.setItem("user", JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            }));
          });
        } else {
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("user");
        }
      });
      
      console.log("Firebase inicializado correctamente");
    } catch (error) {
      console.error("Error inicializando Firebase:", error);
    }
  }

  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signUpWithEmail(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("Usuario registrado:", result._tokenResponse);
      return { success: true, user: result._tokenResponse };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      return { success: true, user: result._tokenResponse };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(this.auth, this.facebookProvider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getAuthToken() {
    return sessionStorage.getItem("authToken");
  }

  getUserData() {
    const userData = sessionStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
}

export const FirebaseService = new FirebaseServiceClass();
