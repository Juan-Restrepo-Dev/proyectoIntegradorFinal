import { AuthService } from "../../services/auth/authService.js";

export default {
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">SB</div>
          <h2>Publitron</h2>
        </div>
        
        <nav class="sidebar-nav">
          <a href="/admin/dashboard" class="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Dashboard
          </a>
          
          <a href="/admin/calendar" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Calendario
          </a>
          
          <a href="/admin/entities" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Entidades
          </a>
          
          <a href="/admin/users" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Usuarios
          </a>
          
          <a href="/admin/company" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Empresa
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <button id="logoutBtn" class="btn btn-ghost">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="top-bar">
          <div class="breadcrumb">
            <h1>Dashboard</h1>
            <p>Bienvenido de vuelta</p>
          </div>
          
          <div class="user-menu">
            <div class="user-info">
              <span id="userName">Usuario</span>
              <small id="userEmail">usuario@email.com</small>
            </div>
            <div class="user-avatar" id="userAvatar">
              <span>U</span>
            </div>
          </div>
        </header>
        <div id="contentArea" class="content-area">
          <!-- Aquí se cargarán los módulos del layout -->
        </div>

      </main>
    </div>
  `,

  afterRender() {
    this.setupEventListeners();
    this.loadUserData();
  },

  setupEventListeners() {
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await this.handleLogout();
    });

    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
        e.currentTarget.classList.add("active");
      });
    });
  },

  async handleLogout() {
    try {
      await AuthService.logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },

  loadUserData() {
    const userData = AuthService.getUserData();
    if (userData) {
      document.getElementById("userName").textContent = userData.displayName || "Usuario";
      document.getElementById("userEmail").textContent = userData.email || "usuario@email.com";
      
      if (userData.photoURL) {
        document.getElementById("userAvatar").innerHTML = `<img src="${userData.photoURL}" alt="Avatar">`;
      } else {
        const initials = (userData.displayName || userData.email || "U").charAt(0).toUpperCase();
        document.getElementById("userAvatar").innerHTML = `<span>${initials}</span>`;
      }
    }
  },

};
