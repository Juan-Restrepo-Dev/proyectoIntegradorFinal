import { render } from "./render";
// router.addRoute("/", () => import("./pages/auth/login.js"));
// router.addRoute("/register", () => import("./pages/auth/register.js"));
// router.addRoute("/admin", () => import("./pages/admin/layout.js"));
// router.addRoute("/admin/dashboard", () => import("./pages/admin/dashboard.js"));
// router.addRoute("/admin/calendar", () => import("./pages/admin/calendar.js"));
// router.addRoute("/admin/entities", () => import("./pages/admin/entities.js"));
// router.addRoute("/admin/users", () => import("./pages/admin/users.js"));
// router.addRoute("/admin/company", () => import("./pages/admin/company.js"));

export class Router {
  constructor() {
    this.routes = new Map();
    this.middlewares = [];
    this.currentRoute = null;
  }

  addRoute(path, elementsLoader) {
    this.routes.set(path, elementsLoader);
  }

  addMiddleware(middleware) {
    this.middlewares.push(middleware);
  }

  async navigate(path) {
    const from = this.currentRoute;
    const to = path;

    // Ejecutar middlewares
    for (const middleware of this.middlewares) {
      await new Promise((resolve) => {
        middleware(to, from, resolve);
      });
    }

    // Cargar pagina 
    const loadPage = this.routes.get(path);
    //   console.log(loadPage);

    //   const element = loadPage.getElement;
    //   if (element) {
    //     try {
    //       const elmentToRender = await element();
    //       this.render(elmentToRender.default || elmentToRender);
    //       this.currentRoute = path;
    //       history.pushState({}, "", path);
    //     } catch (error) {
    //       console.error("Error loading elmentToRender:", error);
    //       this.render(this.createErrorPage());
    //     }
    //   } else {
    //     this.render(this.createNotFoundPage());
    //   }
    // }




    console.log(loadPage);

    // const element = loadPage.getElement;
    if (loadPage) {
      try {
        if (loadPage.type == "layoutModule") {
          const container = document.getElementById("contentArea");
          if (container) {
            render(loadPage);
          }
          else {
            let loadLayout = this.routes.get("/admin")
            render(loadLayout);
            render(loadPage);
          }
        } else {
          render(loadPage);
        }
        this.currentRoute = path;
        history.pushState({}, "", path);
      } catch (error) {
        console.error("Error loading elmentToRender:", error);
        render(this.createErrorPage());
      }
    } else {
      render(this.createNotFoundPage());
    }
  }


  createErrorPage() {
    return `
      <div class="error-page">
        <h1>Error</h1>
        <p>Ha ocurrido un error al cargar la página.</p>
        <button onclick="window.location.reload()">Recargar</button>
      </div>
    `;
  }

  createNotFoundPage() {
    return `
      <div class="error-page">
        <h1>404 - Página no encontrada</h1>
        <p>La página que buscas no existe.</p>
        <button onclick="window.location.href=\"/\"">Ir al inicio</button>
      </div>
    `;
  }

  init() {
    // Manejar navegación del navegador
    window.addEventListener("popstate", () => {
      this.navigate(window.location.pathname);
    });

    // Interceptar clicks en enlaces
    document.addEventListener("click", (e) => {
      if (e.target.matches("a[href^=\"/\"]")) {
        e.preventDefault();
        this.navigate(e.target.getAttribute("href"));
      }
    });

    // Cargar ruta inicial
    this.navigate(window.location.pathname || "/");
  }
}
