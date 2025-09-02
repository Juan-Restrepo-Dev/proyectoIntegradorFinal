// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { AuthService } from "../../services/auth/authService.js";
import { Calendar } from "../../components/calendar/Calendar.js";

export default {
  template: `

        <!-- Calendar Component Container -->
        <div id="calendarContainer" class="calendar-wrapper">
          <h1>Calendario</h1>
          <!-- El componente Calendar se montará aquí -->
        </div>

  `,

  afterRender() {
    this.loadUserData();
    this.setupEventListeners();
    this.initializeCalendar();
  },

  setupEventListeners() {
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

  initializeCalendar() {
    const calendarContainer = document.getElementById("calendarContainer");
    if (calendarContainer) {
      this.calendarComponent = new Calendar(calendarContainer, {
        onPublicationSave: (publication) => {
          console.log('Publicación guardada:', publication);
          // Aquí puedes agregar lógica adicional como notificaciones
        },
        onPublicationDelete: (id) => {
          console.log('Publicación eliminada:', id);
          // Aquí puedes agregar lógica adicional
        }
      });
    }
  },

  destroy() {
    if (this.calendarComponent) {
      this.calendarComponent.destroy();
    }
  }
};
