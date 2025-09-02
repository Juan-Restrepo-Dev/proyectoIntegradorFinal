import { FirebaseService } from "../firebase/firebaseService.js";

class AuthServiceClass {
  async login(email, password) {
    return await FirebaseService.signInWithEmail(email, password);
  }

  async register(email, password) {
    return await FirebaseService.signUpWithEmail(email, password);
  }

  async loginWithGoogle() {
    return await FirebaseService.signInWithGoogle();
  }

  async loginWithFacebook() {
    return await FirebaseService.signInWithFacebook();
  }

  async logout() {
    return await FirebaseService.signOut();
  }

  async isAuthenticated() {
    const token = FirebaseService.getAuthToken();
    const user = FirebaseService.getCurrentUser();
    return !!(token && user);
  }

  getCurrentUser() {
    return FirebaseService.getCurrentUser();
  }

  getUserData() {
    return FirebaseService.getUserData();
  }

  getAuthToken() {
    return FirebaseService.getAuthToken();
  }
}

export const AuthService = new AuthServiceClass();
