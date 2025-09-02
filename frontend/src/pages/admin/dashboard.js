import { AuthService } from "../../services/auth/authService.js";

export default {
  template: `

      <!-- Main Content -->
   
        <div class="dashboard-content">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>Total Ventas</h3>
                <p class="stat-value">$24,500</p>
                <span class="stat-change positive">+12.5%</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>Usuarios Activos</h3>
                <p class="stat-value">1,234</p>
                <span class="stat-change positive">+8.2%</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>Publicaciones</h3>
                <p class="stat-value">89</p>
                <span class="stat-change positive">+15.3%</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>Engagement</h3>
                <p class="stat-value">92.4%</p>
                <span class="stat-change positive">+5.7%</span>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-section">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Ventas Mensuales</h3>
                <div class="chart-actions">
                  <select id="chartPeriod">
                    <option value="7">Últimos 7 días</option>
                    <option value="30" selected>Últimos 30 días</option>
                    <option value="90">Últimos 90 días</option>
                  </select>
                </div>
              </div>
              <div class="chart-container">
                <canvas id="salesChart" width="400" height="200"></canvas>
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-header">
                <h3>Actividad Reciente</h3>
              </div>
              <div class="activity-list" id="activityList">
                <!-- Activity items will be loaded dynamically -->
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <h3>Acciones Rápidas</h3>
            <div class="actions-grid">
              <button class="action-btn" onclick="window.location.href=\"/admin/calendar\"">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Programar Publicación
              </button>
              
              <button class="action-btn" onclick="window.location.href=\"/admin/entities\"">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                Gestionar Entidades
              </button>
              
              <button class="action-btn" onclick="window.location.href=\"/admin/users\"">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Ver Usuarios
              </button>
              
              <button class="action-btn" onclick="window.location.href=\"/admin/company\"">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                Configurar Empresa
              </button>
            </div>
          </div>
        </div>
  `,

  afterRender() {
    this.setupEventListeners();
    this.loadUserData();
    this.loadDashboardData();
    this.setupCharts();
  },

  setupEventListeners() {
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await this.handleLogout();
    });

    document.getElementById("chartPeriod").addEventListener("change", (e) => {
      this.updateChart(e.target.value);
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

  async loadDashboardData() {
    this.loadActivityData();
  },

  loadActivityData() {
    const activities = [
      { type: "publication", message: "Nueva publicación programada para Instagram", time: "2 min ago" },
      { type: "user", message: "Usuario \"Juan Pérez\" se registró", time: "15 min ago" },
      { type: "sale", message: "Nueva venta: $1,250", time: "1 hora ago" },
      { type: "system", message: "Backup automático completado", time: "2 horas ago" },
      { type: "publication", message: "Publicación en Facebook exitosa", time: "3 horas ago" }
    ];

    const activityList = document.getElementById("activityList");
    activityList.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon ${activity.type}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${this.getActivityIcon(activity.type)}
          </svg>
        </div>
        <div class="activity-content">
          <p>${activity.message}</p>
          <small>${activity.time}</small>
        </div>
      </div>
    `).join("");
  },

  getActivityIcon(type) {
    const icons = {
      publication: "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14,2 14,8 20,8\"/>",
      user: "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>",
      sale: "<path d=\"M22 12h-4l-3 9L9 3l-3 9H2\"/>",
      system: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 1v6m0 6v6\"/>"
    };
    return icons[type] || icons.system;
  },

  setupCharts() {
    const canvas = document.getElementById("salesChart");
    const ctx = canvas.getContext("2d");
    
    const data = [12, 19, 3, 5, 2, 3, 15, 8, 12, 9, 14, 7];
    
    ctx.fillStyle = "var(--primary)";
    ctx.strokeStyle = "var(--primary)";
    ctx.lineWidth = 2;
    
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / data.length;
    const maxValue = Math.max(...data);
    
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 40);
      const x = index * barWidth + 10;
      const y = height - barHeight - 20;
      
      ctx.fillRect(x, y, barWidth - 10, barHeight);
    });
  },

  updateChart(period) {
    console.log("Actualizando gráfico para período:", period);
    this.setupCharts();
  }
};
