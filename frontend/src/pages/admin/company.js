import { AuthService } from "../../services/auth/authService.js";

export default {
  template: `
  

        <div class="company-content">
          <!-- Company Info Section -->
          <div class="company-section">
            <h2>Información General</h2>
            <div class="company-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="companyName">Nombre de la empresa</label>
                  <input type="text" id="companyName" placeholder="Nombre comercial">
                </div>
                <div class="form-group">
                  <label for="companyLegalName">Razón social</label>
                  <input type="text" id="companyLegalName" placeholder="Nombre legal">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="companyTaxId">NIT / RUC</label>
                  <input type="text" id="companyTaxId" placeholder="Número tributario">
                </div>
                <div class="form-group">
                  <label for="companyCountry">País</label>
                  <select id="companyCountry">
                    <option value="">Seleccionar país</option>
                    <option value="CO">Colombia</option>
                    <option value="MX">México</option>
                    <option value="PE">Perú</option>
                    <option value="CL">Chile</option>
                    <option value="AR">Argentina</option>
                    <option value="US">Estados Unidos</option>
                    <option value="ES">España</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="companyEmail">Email corporativo</label>
                  <input type="email" id="companyEmail" placeholder="contacto@empresa.com">
                </div>
                <div class="form-group">
                  <label for="companyPhone">Teléfono</label>
                  <input type="tel" id="companyPhone" placeholder="+57 300 000 0000">
                </div>
              </div>
              
              <div class="form-group">
                <label for="companyAddress">Dirección</label>
                <textarea id="companyAddress" rows="3" placeholder="Dirección completa"></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="companyWebsite">Sitio web</label>
                  <input type="url" id="companyWebsite" placeholder="https://www.empresa.com">
                </div>
                <div class="form-group">
                  <label for="companySector">Sector</label>
                  <select id="companySector">
                    <option value="">Seleccionar sector</option>
                    <option value="retail">Comercio minorista</option>
                    <option value="services">Servicios profesionales</option>
                    <option value="manufacturing">Manufactura</option>
                    <option value="technology">Tecnología</option>
                    <option value="healthcare">Salud</option>
                    <option value="education">Educación</option>
                    <option value="construction">Construcción</option>
                    <option value="tourism">Turismo & Hotelería</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Branding Section -->
          <div class="company-section">
            <h2>Branding y Apariencia</h2>
            <div class="branding-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="companyLogo">Logo de la empresa</label>
                  <div class="logo-upload">
                    <div class="logo-preview" id="logoPreview">
                      <span>Subir logo</span>
                    </div>
                    <input type="file" id="companyLogo" accept="image/*" hidden>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById(\"companyLogo\").click()">
                      Seleccionar archivo
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="companyTagline">Lema o slogan</label>
                  <input type="text" id="companyTagline" placeholder="Tu lema empresarial">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="primaryColor">Color primario</label>
                  <div class="color-picker">
                    <input type="color" id="primaryColor" value="#5B4BDB">
                    <input type="text" id="primaryColorHex" value="#5B4BDB" placeholder="#5B4BDB">
                  </div>
                </div>
                <div class="form-group">
                  <label for="accentColor">Color acento</label>
                  <div class="color-picker">
                    <input type="color" id="accentColor" value="#21C4B7">
                    <input type="text" id="accentColorHex" value="#21C4B7" placeholder="#21C4B7">
                  </div>
                </div>
              </div>
              
              <div class="brand-preview">
                <h3>Vista previa</h3>
                <div class="preview-card">
                  <div class="preview-header">
                    <div class="preview-logo" id="previewLogo">SB</div>
                    <div class="preview-info">
                      <h4 id="previewName">Tu Empresa</h4>
                      <p id="previewTagline">Tu lema empresarial</p>
                    </div>
                  </div>
                  <div class="preview-colors">
                    <div class="color-sample" id="previewPrimary"></div>
                    <div class="color-sample" id="previewAccent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media Section -->
          <div class="company-section">
            <h2>Redes Sociales</h2>
            <div class="social-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="socialFacebook">Facebook</label>
                  <input type="url" id="socialFacebook" placeholder="https://facebook.com/tuempresa">
                </div>
                <div class="form-group">
                  <label for="socialInstagram">Instagram</label>
                  <input type="text" id="socialInstagram" placeholder="@tuempresa">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="socialTwitter">Twitter</label>
                  <input type="text" id="socialTwitter" placeholder="@tuempresa">
                </div>
                <div class="form-group">
                  <label for="socialLinkedin">LinkedIn</label>
                  <input type="url" id="socialLinkedin" placeholder="https://linkedin.com/company/tuempresa">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="socialYoutube">YouTube</label>
                  <input type="url" id="socialYoutube" placeholder="https://youtube.com/@tuempresa">
                </div>
                <div class="form-group">
                  <label for="socialTiktok">TikTok</label>
                  <input type="text" id="socialTiktok" placeholder="@tuempresa">
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Section -->
          <div class="company-section">
            <h2>Configuración del Sistema</h2>
            <div class="settings-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="timezone">Zona horaria</label>
                  <select id="timezone">
                    <option value="America/Bogota">Colombia (GMT-5)</option>
                    <option value="America/Mexico_City">México (GMT-6)</option>
                    <option value="America/Lima">Perú (GMT-5)</option>
                    <option value="America/Santiago">Chile (GMT-3)</option>
                    <option value="America/Argentina/Buenos_Aires">Argentina (GMT-3)</option>
                    <option value="America/New_York">Estados Unidos (GMT-5)</option>
                    <option value="Europe/Madrid">España (GMT+1)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="language">Idioma</label>
                  <select id="language">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="currency">Moneda</label>
                <select id="currency">
                  <option value="COP">Peso Colombiano (COP)</option>
                  <option value="MXN">Peso Mexicano (MXN)</option>
                  <option value="PEN">Sol Peruano (PEN)</option>
                  <option value="CLP">Peso Chileno (CLP)</option>
                  <option value="ARS">Peso Argentino (ARS)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              
              <div class="settings-options">
                <h3>Opciones adicionales</h3>
                <div class="option-item">
                  <label class="switch-label">
                    <input type="checkbox" id="emailNotifications" checked>
                    <span class="switch"></span>
                    Notificaciones por email
                  </label>
                </div>
                <div class="option-item">
                  <label class="switch-label">
                    <input type="checkbox" id="smsNotifications">
                    <span class="switch"></span>
                    Notificaciones por SMS
                  </label>
                </div>
                <div class="option-item">
                  <label class="switch-label">
                    <input type="checkbox" id="autoBackup" checked>
                    <span class="switch"></span>
                    Backup automático
                  </label>
                </div>
                <div class="option-item">
                  <label class="switch-label">
                    <input type="checkbox" id="analyticsTracking" checked>
                    <span class="switch"></span>
                    Seguimiento de analytics
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="company-actions">
            <button id="saveCompanyBtn" class="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17,21 17,13 7,13 7,21"/>
                <polyline points="7,3 7,8 15,8"/>
              </svg>
              Guardar Cambios
            </button>
          </div>
        </div>
  
  `,

  afterRender() {
    this.companyData = this.loadCompanyData();
    this.setupEventListeners();
    this.loadUserData();
    this.fillForm();
    this.updatePreview();
  },

  setupEventListeners() {
    document.getElementById("companyLogo").addEventListener("change", (e) => this.handleLogoUpload(e));
    document.getElementById("primaryColor").addEventListener("input", (e) => this.updatePrimaryColor(e.target.value));
    document.getElementById("accentColor").addEventListener("input", (e) => this.updateAccentColor(e.target.value));
    document.getElementById("primaryColorHex").addEventListener("input", (e) => this.updatePrimaryColor(e.target.value));
    document.getElementById("accentColorHex").addEventListener("input", (e) => this.updateAccentColor(e.target.value));
    document.getElementById("companyName").addEventListener("input", () => this.updatePreview());
    document.getElementById("companyTagline").addEventListener("input", () => this.updatePreview());
    document.getElementById("saveCompanyBtn").addEventListener("click", () => this.saveCompanyData());
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

  handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoPreview = document.getElementById("logoPreview");
        logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo">`;
        this.companyData.logo = e.target.result;
        this.updatePreview();
      };
      reader.readAsDataURL(file);
    }
  },

  updatePrimaryColor(color) {
    document.getElementById("primaryColor").value = color;
    document.getElementById("primaryColorHex").value = color;
    document.getElementById("previewPrimary").style.backgroundColor = color;
    this.companyData.primaryColor = color;
  },

  updateAccentColor(color) {
    document.getElementById("accentColor").value = color;
    document.getElementById("accentColorHex").value = color;
    document.getElementById("previewAccent").style.backgroundColor = color;
    this.companyData.accentColor = color;
  },

  updatePreview() {
    const name = document.getElementById("companyName").value || "Tu Empresa";
    const tagline = document.getElementById("companyTagline").value || "Tu lema empresarial";
    
    document.getElementById("previewName").textContent = name;
    document.getElementById("previewTagline").textContent = tagline;
    
    if (this.companyData.logo) {
      document.getElementById("previewLogo").innerHTML = `<img src="${this.companyData.logo}" alt="Logo">`;
    }
  },

  fillForm() {
    document.getElementById("companyName").value = this.companyData.name || "";
    document.getElementById("companyLegalName").value = this.companyData.legalName || "";
    document.getElementById("companyTaxId").value = this.companyData.taxId || "";
    document.getElementById("companyCountry").value = this.companyData.country || "";
    document.getElementById("companyEmail").value = this.companyData.email || "";
    document.getElementById("companyPhone").value = this.companyData.phone || "";
    document.getElementById("companyAddress").value = this.companyData.address || "";
    document.getElementById("companyWebsite").value = this.companyData.website || "";
    document.getElementById("companySector").value = this.companyData.sector || "";
    
    if (this.companyData.logo) {
      document.getElementById("logoPreview").innerHTML = `<img src="${this.companyData.logo}" alt="Logo">`;
    }
    document.getElementById("companyTagline").value = this.companyData.tagline || "";
    document.getElementById("primaryColor").value = this.companyData.primaryColor || "#5B4BDB";
    document.getElementById("primaryColorHex").value = this.companyData.primaryColor || "#5B4BDB";
    document.getElementById("accentColor").value = this.companyData.accentColor || "#21C4B7";
    document.getElementById("accentColorHex").value = this.companyData.accentColor || "#21C4B7";
    
    document.getElementById("socialFacebook").value = this.companyData.social?.facebook || "";
    document.getElementById("socialInstagram").value = this.companyData.social?.instagram || "";
    document.getElementById("socialTwitter").value = this.companyData.social?.twitter || "";
    document.getElementById("socialLinkedin").value = this.companyData.social?.linkedin || "";
    document.getElementById("socialYoutube").value = this.companyData.social?.youtube || "";
    document.getElementById("socialTiktok").value = this.companyData.social?.tiktok || "";
    
    document.getElementById("timezone").value = this.companyData.timezone || "America/Bogota";
    document.getElementById("language").value = this.companyData.language || "es";
    document.getElementById("currency").value = this.companyData.currency || "COP";
    
    document.getElementById("emailNotifications").checked = this.companyData.settings?.emailNotifications !== false;
    document.getElementById("smsNotifications").checked = this.companyData.settings?.smsNotifications || false;
    document.getElementById("autoBackup").checked = this.companyData.settings?.autoBackup !== false;
    document.getElementById("analyticsTracking").checked = this.companyData.settings?.analyticsTracking !== false;
  },

  saveCompanyData() {
    this.companyData = {
      name: document.getElementById("companyName").value,
      legalName: document.getElementById("companyLegalName").value,
      taxId: document.getElementById("companyTaxId").value,
      country: document.getElementById("companyCountry").value,
      email: document.getElementById("companyEmail").value,
      phone: document.getElementById("companyPhone").value,
      address: document.getElementById("companyAddress").value,
      website: document.getElementById("companyWebsite").value,
      sector: document.getElementById("companySector").value,
      
      logo: this.companyData.logo,
      tagline: document.getElementById("companyTagline").value,
      primaryColor: document.getElementById("primaryColor").value,
      accentColor: document.getElementById("accentColor").value,
      
      social: {
        facebook: document.getElementById("socialFacebook").value,
        instagram: document.getElementById("socialInstagram").value,
        twitter: document.getElementById("socialTwitter").value,
        linkedin: document.getElementById("socialLinkedin").value,
        youtube: document.getElementById("socialYoutube").value,
        tiktok: document.getElementById("socialTiktok").value
      },
      
      timezone: document.getElementById("timezone").value,
      language: document.getElementById("language").value,
      currency: document.getElementById("currency").value,
      
      settings: {
        emailNotifications: document.getElementById("emailNotifications").checked,
        smsNotifications: document.getElementById("smsNotifications").checked,
        autoBackup: document.getElementById("autoBackup").checked,
        analyticsTracking: document.getElementById("analyticsTracking").checked
      },
      
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem("companyData", JSON.stringify(this.companyData));
    alert("Configuración guardada exitosamente!");
  },

  loadCompanyData() {
    const saved = localStorage.getItem("companyData");
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      name: "Mi Empresa",
      legalName: "",
      taxId: "",
      country: "CO",
      email: "",
      phone: "",
      address: "",
      website: "",
      sector: "",
      
      logo: null,
      tagline: "Innovación que impulsa tu negocio",
      primaryColor: "#5B4BDB",
      accentColor: "#21C4B7",
      
      social: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: ""
      },
      
      timezone: "America/Bogota",
      language: "es",
      currency: "COP",
      
      settings: {
        emailNotifications: true,
        smsNotifications: false,
        autoBackup: true,
        analyticsTracking: true
      }
    };
  }
};
