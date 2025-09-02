import { AuthService } from "../../services/auth/authService.js";

export default {
  template: `



        <div class="users-content">
          <!-- Users Header -->
          <div class="users-header">
            <div class="users-stats">
              <div class="stat-item">
                <span class="stat-number" id="totalUsers">0</span>
                <span class="stat-label">Total Usuarios</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" id="activeUsers">0</span>
                <span class="stat-label">Activos</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" id="pendingUsers">0</span>
                <span class="stat-label">Pendientes</span>
              </div>
            </div>
            
            <div class="users-actions">
              <button id="addUserBtn" class="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar Usuario
              </button>
            </div>
          </div>

          <!-- Users Table -->
          <div class="users-table-container">
            <div class="table-toolbar">
              <div class="search-box">
                <input type="text" id="userSearch" placeholder="Buscar usuarios..." class="search-input">
              </div>
              
              <div class="filter-options">
                <select id="roleFilter" class="filter-select">
                  <option value="">Todos los roles</option>
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="employee">Empleado</option>
                  <option value="viewer">Visualizador</option>
                </select>
                
                <select id="statusFilter" class="filter-select">
                  <option value="">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>

            <table class="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="usersTableBody">
                <!-- Los usuarios se cargarán dinámicamente -->
              </tbody>
            </table>
          </div>
        </div>


      <!-- Modal para agregar/editar usuario -->
      <div id="userModal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modalTitle">Agregar Usuario</h3>
            <button id="closeUserModal" class="btn btn-ghost">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <form id="userForm" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label for="userName">Nombre completo</label>
                <input type="text" id="userName" required placeholder="Nombre y apellidos">
              </div>
              <div class="form-group">
                <label for="userEmail">Email</label>
                <input type="email" id="userEmail" required placeholder="usuario@empresa.com">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="userRole">Rol</label>
                <select id="userRole" required>
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="employee">Empleado</option>
                  <option value="viewer">Visualizador</option>
                </select>
              </div>
              <div class="form-group">
                <label for="userStatus">Estado</label>
                <select id="userStatus" required>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="userPassword">Contraseña</label>
              <input type="password" id="userPassword" placeholder="Dejar en blanco para mantener actual">
            </div>
            
            <div class="form-group">
              <label for="userPermissions">Permisos especiales</label>
              <div class="permissions-grid">
                <label class="permission-item">
                  <input type="checkbox" id="permDashboard"> Dashboard
                </label>
                <label class="permission-item">
                  <input type="checkbox" id="permCalendar"> Calendario
                </label>
                <label class="permission-item">
                  <input type="checkbox" id="permEntities"> Entidades
                </label>
                <label class="permission-item">
                  <input type="checkbox" id="permUsers"> Usuarios
                </label>
                <label class="permission-item">
                  <input type="checkbox" id="permCompany"> Empresa
                </label>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" id="cancelUserBtn" class="btn btn-ghost">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    
  `,

  afterRender() {
    this.users = this.loadUsers();
    this.setupEventListeners();
    this.loadUserData();
    this.renderUsers();
    this.updateStats();
  },

  setupEventListeners() {
    document.getElementById("addUserBtn").addEventListener("click", () => this.openUserModal());
    document.getElementById("closeUserModal").addEventListener("click", () => this.closeUserModal());
    document.getElementById("cancelUserBtn").addEventListener("click", () => this.closeUserModal());
    document.getElementById("userForm").addEventListener("submit", (e) => this.handleUserSubmit(e));
    document.getElementById("userSearch").addEventListener("input", (e) => this.filterUsers(e.target.value));
    document.getElementById("roleFilter").addEventListener("change", () => this.applyFilters());
    document.getElementById("statusFilter").addEventListener("change", () => this.applyFilters());
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await AuthService.logout();
      window.location.href = "/";
    });
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

  renderUsers() {
    const tableBody = document.getElementById("usersTableBody");
    
    tableBody.innerHTML = this.users.map(user => `
      <tr class="user-row" data-user-id="${user.id}">
        <td class="user-info">
          <div class="user-avatar-small">
            ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : `<span>${user.name.charAt(0).toUpperCase()}</span>`}
          </div>
          <div class="user-details">
            <span class="user-name">${user.name}</span>
            <span class="user-id">ID: ${user.id}</span>
          </div>
        </td>
        <td class="user-email">${user.email}</td>
        <td class="user-role">
          <span class="role-badge ${user.role}">${this.getRoleLabel(user.role)}</span>
        </td>
        <td class="user-status">
          <span class="status-badge ${user.status}">${this.getStatusLabel(user.status)}</span>
        </td>
        <td class="user-last-access">${this.formatDate(user.lastAccess)}</td>
        <td class="user-actions">
          <button class="btn btn-ghost btn-sm" onclick="this.editUser(\"${user.id}\")" title="Editar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn btn-ghost btn-sm" onclick="this.toggleUserStatus(\"${user.id}\")" title="${user.status === "active" ? "Desactivar" : "Activar"}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${user.status === "active" ? 
                "<path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/>" :
                "<path d=\"M9 12l2 2 4-4\"/>"
              }
            </svg>
          </button>
          <button class="btn btn-ghost btn-sm" onclick="this.deleteUser(\"${user.id}\")" title="Eliminar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
          </button>
        </td>
      </tr>
    `).join("");
  },

  updateStats() {
    const total = this.users.length;
    const active = this.users.filter(u => u.status === "active").length;
    const pending = this.users.filter(u => u.status === "pending").length;
    
    document.getElementById("totalUsers").textContent = total;
    document.getElementById("activeUsers").textContent = active;
    document.getElementById("pendingUsers").textContent = pending;
  },

  getRoleLabel(role) {
    const roles = {
      admin: "Administrador",
      manager: "Gerente",
      employee: "Empleado",
      viewer: "Visualizador"
    };
    return roles[role] || role;
  },

  getStatusLabel(status) {
    const statuses = {
      active: "Activo",
      inactive: "Inactivo",
      pending: "Pendiente"
    };
    return statuses[status] || status;
  },

  formatDate(dateString) {
    if (!dateString) return "Nunca";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  },

  filterUsers(searchTerm) {
    const rows = document.querySelectorAll(".user-row");
    rows.forEach(row => {
      const name = row.querySelector(".user-name").textContent.toLowerCase();
      const email = row.querySelector(".user-email").textContent.toLowerCase();
      const matches = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
      row.style.display = matches ? "" : "none";
    });
  },

  applyFilters() {
    const roleFilter = document.getElementById("roleFilter").value;
    const statusFilter = document.getElementById("statusFilter").value;
    
    const rows = document.querySelectorAll(".user-row");
    rows.forEach(row => {
      const role = row.querySelector(".role-badge").textContent;
      const status = row.querySelector(".status-badge").textContent;
      
      const roleMatches = !roleFilter || role === roleFilter;
      const statusMatches = !statusFilter || status === statusFilter;
      
      row.style.display = (roleMatches && statusMatches) ? "" : "none";
    });
  },

  openUserModal(userId = null) {
    this.editingUser = userId;
    const modal = document.getElementById("userModal");
    const title = document.getElementById("modalTitle");
    const form = document.getElementById("userForm");
    
    title.textContent = userId ? "Editar Usuario" : "Agregar Usuario";
    
    if (userId) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        this.fillUserForm(user);
      }
    } else {
      form.reset();
    }
    
    modal.classList.remove("hidden");
  },

  closeUserModal() {
    document.getElementById("userModal").classList.add("hidden");
    document.getElementById("userForm").reset();
    this.editingUser = null;
  },

  fillUserForm(user) {
    document.getElementById("userName").value = user.name;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userRole").value = user.role;
    document.getElementById("userStatus").value = user.status;
    
    document.getElementById("permDashboard").checked = user.permissions?.dashboard || false;
    document.getElementById("permCalendar").checked = user.permissions?.calendar || false;
    document.getElementById("permEntities").checked = user.permissions?.entities || false;
    document.getElementById("permUsers").checked = user.permissions?.users || false;
    document.getElementById("permCompany").checked = user.permissions?.company || false;
  },

  handleUserSubmit(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      role: document.getElementById("userRole").value,
      status: document.getElementById("userStatus").value,
      password: document.getElementById("userPassword").value,
      permissions: {
        dashboard: document.getElementById("permDashboard").checked,
        calendar: document.getElementById("permCalendar").checked,
        entities: document.getElementById("permEntities").checked,
        users: document.getElementById("permUsers").checked,
        company: document.getElementById("permCompany").checked
      }
    };
    
    if (this.editingUser) {
      this.updateUser(this.editingUser, formData);
    } else {
      this.createUser(formData);
    }
    
    this.closeUserModal();
  },

  createUser(userData) {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      avatar: null,
      lastAccess: null,
      createdAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    this.saveUsers();
    this.renderUsers();
    this.updateStats();
    
    alert("Usuario creado exitosamente!");
  },

  updateUser(userId, userData) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      this.saveUsers();
      this.renderUsers();
      this.updateStats();
      
      alert("Usuario actualizado exitosamente!");
    }
  },

  editUser(userId) {
    this.openUserModal(userId);
  },

  toggleUserStatus(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === "active" ? "inactive" : "active";
      this.saveUsers();
      this.renderUsers();
      this.updateStats();
      
      alert(`Usuario ${user.status === "active" ? "activado" : "desactivado"} exitosamente!`);
    }
  },

  deleteUser(userId) {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      this.users = this.users.filter(u => u.id !== userId);
      this.saveUsers();
      this.renderUsers();
      this.updateStats();
      
      alert("Usuario eliminado exitosamente!");
    }
  },

  loadUsers() {
    const saved = localStorage.getItem("users");
    if (saved) {
      return JSON.parse(saved);
    }
    
    return [
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan.perez@empresa.com",
        role: "admin",
        status: "active",
        avatar: null,
        lastAccess: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        permissions: {
          dashboard: true,
          calendar: true,
          entities: true,
          users: true,
          company: true
        }
      },
      {
        id: "2",
        name: "María García",
        email: "maria.garcia@empresa.com",
        role: "manager",
        status: "active",
        avatar: null,
        lastAccess: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        permissions: {
          dashboard: true,
          calendar: true,
          entities: true,
          users: false,
          company: false
        }
      },
      {
        id: "3",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com",
        role: "employee",
        status: "pending",
        avatar: null,
        lastAccess: null,
        createdAt: new Date().toISOString(),
        permissions: {
          dashboard: true,
          calendar: false,
          entities: false,
          users: false,
          company: false
        }
      }
    ];
  },

  saveUsers() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }
};
