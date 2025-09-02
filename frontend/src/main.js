
import { Router } from "./utils/router.js";
import { AuthService } from "./services/auth/authService.js";
import { FirebaseService } from "./services/firebase/firebaseService.js";

// Inicializar Firebase
FirebaseService.init();

// Inicializar el router
const router = new Router();

// Definir rutas
router.addRoute("/",{getElement: () => import("./pages/auth/login.js") ,type:"page",nodeParent:"app"});
router.addRoute("/register", {getElement        : () => import("./pages/auth/register.js"), type: "page",nodeParent:"app"});
router.addRoute("/admin", {getElement: () => import("./pages/admin/layout.js"), type: "page",nodeParent:"app"});
router.addRoute("/admin/dashboard", {getElement: () => import("./pages/admin/dashboard.js"), type: "layoutModule", nodeParent: "contentArea"});
router.addRoute("/admin/calendar", {getElement: () => import("./pages/admin/calendar.js"), type: "layoutModule", nodeParent: "contentArea"});
router.addRoute("/admin/entities", {getElement: () => import("./pages/admin/entities.js"), type: "layoutModule", nodeParent: "contentArea"});
router.addRoute("/admin/users", {getElement: () => import("./pages/admin/users.js"), type: "layoutModule", nodeParent: "contentArea"});
router.addRoute("/admin/company", {getElement: () => import("./pages/admin/company.js"), type: "layoutModule", nodeParent: "contentArea"});

// Middleware de autenticación
router.addMiddleware(async (to, from, next) => {
  const isAuthPage = to === "/" || to === "/register";
  const isAuthenticated = await AuthService.isAuthenticated();
  
  if (!isAuthenticated && !isAuthPage) {
    next("/");
    return;
  }
  
  if (isAuthenticated && isAuthPage) {
    next("/admin");
    return;
  }
  
  next();
});

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  router.init();
});

// window.addEventListener("hashchange", router.init());
// window.addEventListener("load", router.init());