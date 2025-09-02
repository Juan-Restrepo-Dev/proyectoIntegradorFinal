import { getCompanyId, registerCompany } from "../../services/api/companyService.js";
import { registerOwnerCompany, healthCheck } from "../../services/api/ownerRegisterService.js";
import { AuthService } from "../../services/auth/authService.js";
import { storageService} from "../../services/firebase/storageService.js"
import { Router } from "../../utils/router.js";

export default {
  template: `
    <div class="container">
      <div class="title">
        <div class="logo">P</div>
        <div>
          <h1>Publitron — Registro de Empresa</h1>
          <div class="subtitle">Crea tu cuenta empresarial paso a paso</div>
        </div>
      </div>

      <!-- Flow de pasos -->
      <div class="flow" id="flow">
        <div class="step active" data-step="1">Registro:<br>correo + contraseña <span class="arrow"></span></div>
        <div class="step" data-step="2">Verificación de correo <span class="arrow"></span></div>
        <div class="step" data-step="3">Empresa:<br>nombre comercial + país <span class="arrow"></span></div>
        <div class="step" data-step="4">Empresa:<br>sector o actividad  <span class="arrow"></span></div>
        <div class="step" data-step="5">Empresa:<br>público objetivo  <span class="arrow"></span></div>
        <div class="step" data-step="6">Branding:<br>subir logo y definir colores <span class="arrow"></span></div>
        <div class="step" data-step="7">Conectar <br> redes sociales <span class="arrow"></span></div>
        <div class="step" data-step="8">Finalizar onboarding → Ir a Dashboard</div>
      </div>

      <div class="grid">
        <!-- Formulario -->
        <div class="card">
          <h2 id="formTitle">1) Registro: correo y contraseña</h2>
          <p class="hint" id="formHint">Crea tu cuenta de empresa. Puedes avanzar con "Siguiente".</p>

          <form id="wizard" onsubmit="return false">
            <!-- STEP 1 -->
            <div class="view" data-step="1">
              <div class="row">
                <div class="field">
                  <label class="label">Correo corporativo</label>
                  <input type="email" id="email" placeholder="nombre@empresa.com" required>
                </div>
                <div class="field">
                  <label class="label">Confirmar correo</label>
                  <input type="email" id="email2" placeholder="Repite tu correo" required>
                </div>
              </div>
              <div class="row">
                <div class="field">
                  <label class="label">Contraseña</label>
                  <input type="password" id="pass" placeholder="Mínimo 8 caracteres" minlength="8" required>
                </div>
                <div class="field">
                  <label class="label">Confirmar contraseña</label>
                  <input type="password" id="pass2" placeholder="Repite tu contraseña" minlength="8" required>
                </div>
              </div>
              <div class="divider"><span class="center">Tambien puedes registrarte con tu cuenta de Google o de Facebook.</span></div>
               <div class="social-buttons">
          <button id="googleBtn" class="btn btn-social btn-google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button id="facebookBtn" class="btn btn-social btn-facebook">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
              <div class="muted">Al continuar aceptas los Términos y la Política de Privacidad.</div>
            </div>

            <!-- STEP 2 -->
            <div class="view" data-step="2" hidden>
              <div class="row">
                <div class="field">
                  <label class="label">Enviar código de verificación</label>
                  <button class="btn" type="button" id="sendCodeBtn">Enviar código</button>
                </div>
                <div class="field">
                  <label class="label">Código recibido</label>
                  <input type="text" id="code" placeholder="Ej: 482913">
                </div>
              </div>
              <div class="muted" id="codeStatus">Te enviaremos un código a <span id="emailDisplay">tu correo</span>.</div>
            </div>

            <!-- STEP 3 -->
            <div class="view" data-step="3" hidden>
              <div class="row">
                <div class="field">
                  <label class="label">Nombre comercial de la empresa</label>
                  <input type="text" id="company" placeholder="Ej: Sneaker King S.A.S." required>
                </div>
                <div class="field">
                  <label class="label">País</label>
                  <select id="country" required>
                    <option value="" disabled selected>Selecciona país…</option>
                    <option>Colombia</option>
                    <option>México</option>
                    <option>Perú</option>
                    <option>Chile</option>
                    <option>Argentina</option>
                    <option>Estados Unidos</option>
                    <option>España</option>
                  </select>
                </div>
              </div>
              <div class="divider"></div>
              <div class="row">
                <div class="field">
                  <label for="company_description" class="label">descripcion de la empresa</label>
                    <textarea 
                      id="company_description" 
                      rows="4" 
                      cols="70"
                      placeholder="Ej: Tienda en línea especializada en réplicas AAA de zapatillas de alta gama. Ofrecemos productos de calidad y las últimas tendencias a precios asequibles..."
                      required></textarea>
                </div>
              </div>
              <div class="small">Atencion! entre mas especifico sea, mejor seran los resultados generados por la ia.</div>
              <div class="divider"></div>
              <div class="row">
                <div class="field">
                  <label class="label">NIT / RUC (opcional)</label>
                  <input type="text" id="taxid" placeholder="Número tributario">
                </div>
                <div class="field">
                  <label class="label">Sitio web (opcional)</label>
                  <input type="url" id="web" placeholder="https://www.tuempresa.com">
                </div>
              </div>
            </div>
            <!-- STEP 4 -->
            <div class="view" data-step="4" hidden>
            <div class="row">
              <div class="field">
                <label class="label">Sector o actividad principal (opcional)</label>
                <select id="sector">
                  <option value="" selected>— No especificar —</option>
                  <option>Comercio minorista</option>
                  <option>Servicios profesionales</option>
                  <option>Manufactura</option>
                  <option>Tecnología</option>
                  <option>Salud</option>
                  <option>Educación</option>
                  <option>Construcción</option>
                  <option>Turismo & Hotelería</option>
                </select>
              </div>
              <div class="field">
                <label class="label">Tamaño de empresa</label>
                <select id="size">
                  <option>Micro</option>
                  <option>Pequeña</option>
                  <option>Mediana</option>
                  <option>Grande</option>
                </select>
              </div>
            </div>

            <div class="divider"></div>
              <div class="row">
                <div class="field">
                  <label class="label">
                    Objetivo estratégico de la empresa
                    <span class="tooltip">?</span>
                    <span class="tooltip-text">
                      Un objetivo estratégico es una meta a mediano o largo plazo que guía las acciones de la empresa
                      para crecer, competir mejor o mejorar su posición en el mercado.
                    </span>
                  </label>
                  <textarea 
                    id="strategic_objective_company" 
                    rows="4" 
                    cols="70"
                    placeholder="Ej: Generar ventas directas de un producto específico para atraer nuevos clientes y fortalecer la imagen de la marca como un proveedor confiable..."
                    required></textarea>
                </div>
              </div>
              <div class="divider"></div>
            </div>
            <!-- STEP 5 -->
            <div class="view" data-step="5" hidden>
              <div class="row">
                <div class="field">
                  <label for="audience_demographics" class="label">
                    Demografía de la audiencia
                    <span class="tooltip">?</span>
                    <span class="tooltip-text">
                      La demografía de la audiencia describe las características de tu público objetivo:
                      edad, género, ubicación, nivel socioeconómico, intereses u otros datos relevantes.
                    </span>
                  </label>
                  <textarea 
                    id="audience_demographics" 
                    rows="2" 
                    cols="70"
                    placeholder="Ej: Adultos jóvenes de 18 a 30 años, principalmente hombres en áreas urbanas, interesados en moda urbana y cultura hip hop..."
                    required></textarea>
                </div>
              </div>
              <div class="divider"></div>
              <div class="row">
                <div class="field">
                  <label for="audience_interests" class="label">
                    Intereses de la audiencia
                    <span class="tooltip">?</span>
                    <span class="tooltip-text">
                      Describe los intereses o aficiones de tu audiencia.  
                      Ej: Streetwear, moda urbana, música hip hop, influencers de moda, etc.  
                      Estos se agregarán como etiquetas (tags).
                    </span>
                  </label>
                  <div id="interests-container" class="tags-input-container">
                    <input id="audience_interests_input" type="text" placeholder="Escribe un interés y presiona Enter">
                  </div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="row">
                <div class="field">
                  <label for="audience_pain_points" class="label">
                    Puntos de dolor de la audiencia
                    <span class="tooltip">?</span>
                    <span class="tooltip-text">
                      Los puntos de dolor son los problemas, frustraciones o dificultades que enfrenta tu audiencia.  
                      Ej: "Los tenis originales son demasiado caros",  
                      "El acceso a modelos de edición limitada es difícil",  
                      "Miedo a comprar réplicas de mala calidad en línea".  
                      Se agregarán como etiquetas (tags) de texto largo.
                    </span>
                  </label>
                  <div id="painpoints-container" class="tags-input-container">
                    <input id="audience_painpoints_input" type="text" placeholder="Escribe un punto de dolor y presiona Enter">
                  </div>
                </div>
              </div>

              <div class="divider"></div>
                <div class="row">
                  <div class="field">
                    <label for="current_geographic_scope" class="label">
                      Alcance geográfico actual
                      <span class="tooltip">?</span>
                      <span class="tooltip-text">
                        Define el ámbito territorial en el que tu empresa opera actualmente.<br>
                        Ejemplo: "A nivel nacional en Colombia." o "Presencia en Latinoamérica".
                      </span>
                    </label>
                    <input 
                      type="text" 
                      id="current_geographic_scope" 
                      placeholder="Ejemplo: A nivel nacional en Colombia.">
                  </div>
                </div>
            </div>

            <!-- STEP 6 -->
            <div class="view" data-step="6" hidden>
              <div class="row">
                <div class="field">
                  <label class="label">Logo (PNG/JPG)</label>
                  <input type="file" id="logo" accept="image/*">
                </div>
                <div class="field">
                  <label class="label">Color primario</label>
                  <input type="color" id="colorPrimary" value="#5b4bdb">
                </div>
              </div>
              <div class="row">
                <div class="field">
                  <label class="label">Color acento</label>
                  <input type="color" id="colorAccent" value="#21c4b7">
                </div>
                <div class="field">
                  <label class="label">Lema (opcional)</label>
                  <input type="text" id="tagline" placeholder="Ej: Innovación que impulsa tu negocio">
                </div>
              </div>
            </div>

            <!-- STEP 7 -->
            <div class="view" data-step="7" hidden>
              <div class="row-3">
                <!-- WhatsApp -->
                <div class="field">
                  <label class="label">WhatsApp</label>
                  <label class="pill">
                    <input type="checkbox" class="switch" id="wa"> 
                    <span class="muted">Habilitar</span>
                  </label>
                  <input type="text" id="waHandle" placeholder="+57 300 000 0000">

                  <div class="input-wrapper">
                    <input type="password" id="waToken" placeholder="Token de seguridad">
                    <span class="toggle-token" data-target="waToken">👁</span>
                  </div>
                </div>

                <!-- Instagram -->
                <div class="field">
                  <label class="label">Instagram</label>
                  <label class="pill">
                    <input type="checkbox" class="switch" id="ig"> 
                    <span class="muted">@usuario</span>
                  </label>
                  <input type="text" id="igHandle" placeholder="@tuempresa">

                  <div class="input-wrapper">
                    <input type="password" id="igToken" placeholder="Token de seguridad">
                    <span class="toggle-token" data-target="igToken">👁</span>
                  </div>
                </div>

                <!-- Facebook -->
                <div class="field">
                  <label class="label">Facebook</label>
                  <label class="pill">
                    <input type="checkbox" class="switch" id="fb"> 
                    <span class="muted">Página</span>
                  </label>
                  <input type="text" id="fbHandle" placeholder="facebook.com/tuempresa">

                  <div class="input-wrapper">
                    <input type="password" id="fbToken" placeholder="Token de seguridad">
                    <span class="toggle-token" data-target="fbToken">👁</span>
                  </div>
                </div>
              </div>

              <div class="row">
                <!-- LinkedIn -->
                <div class="field">
                  <label class="label">LinkedIn</label>
                  <label class="pill">
                    <input type="checkbox" class="switch" id="li"> 
                    <span class="muted">Empresa</span>
                  </label>
                  <input type="text" id="liHandle" placeholder="linkedin.com/company/tuempresa">

                  <div class="input-wrapper">
                    <input type="password" id="liToken" placeholder="Token de seguridad">
                    <span class="toggle-token" data-target="liToken">👁</span>
                  </div>
                </div>

                <!-- TikTok -->
                <div class="field">
                  <label class="label">TikTok</label>
                  <label class="pill">
                    <input type="checkbox" class="switch" id="tt"> 
                    <span class="muted">@usuario</span>
                  </label>
                  <input type="text" id="ttHandle" placeholder="@tuempresa">

                  <div class="input-wrapper">
                    <input type="password" id="ttToken" placeholder="Token de seguridad">
                    <span class="toggle-token" data-target="ttToken">👁</span>
                  </div>
                </div>
              </div>

              <div class="small">Esta sección es opcional. Puedes conectarlas más tarde desde el Dashboard.</div>
            </div>

            <!-- STEP 8 -->
            <div class="view" data-step="8" hidden>
              <div class="brand-preview" id="finalPreview">
                <div class="preview-header">
                  <div class="logo-preview" id="finalLogo"><span style="font-weight:800">SB</span></div>
                  <div>
                    <div style="font-weight:700" id="finalCompany">Tu Empresa</div>
                    <div class="small">País: <span id="finalCountry">—</span> · Sector: <span id="finalSector">—</span> · <span class="badge">Nuevo</span></div>
                  </div>
                </div>
                <div class="kpis">
                  <div class="kpi"><h3>Estado</h3><p class="success">Cuenta creada ✓</p></div>
                  <div class="kpi"><h3>Marca</h3><p>Colores aplicados</p></div>
                  <div class="kpi"><h3>Social</h3><p id="socialCount">0 canales conectados</p></div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="actions">
                <button class="btn secondary" type="button" id="goDashboardBtn">Ir al Dashboard</button>
                <button class="btn ghost" type="button" id="backBtn">Volver</button>
              </div>
            </div>

            <div class="actions" id="navButtons">
              <button class="btn ghost" type="button" id="prevBtn">Atrás</button>
              <button class="btn" type="button" id="nextBtn">Siguiente</button>
            </div>
          </form>
        </div>

        <!-- Vista previa -->
        <div class="card">
          <h2>Vista previa en vivo</h2>
          <p class="hint">Así podría verse tu marca al finalizar el onboarding.</p>

          <div class="brand-preview">
            <div class="preview-header">
              <div class="logo-preview" id="logoPreview"><span style="font-weight:800">SB</span></div>
              <div>
                <div style="font-weight:700" id="previewName">Tu Empresa</div>
                <div class="small" id="previewCountry">País: —</div>
              </div>
            </div>
            <div class="kpis">
              <div class="kpi">
                <h3>Color primario</h3>
                <p id="pColor">#5B4BDB</p>
              </div>
              <div class="kpi">
                <h3>Color acento</h3>
                <p id="aColor">#21C4B7</p>
              </div>
              <div class="kpi">
                <h3>Progreso</h3>
                <p id="progress">Paso 1 de 8</p>
              </div>
            </div>
          </div>

          <div class="divider"></div>
          <div class="small">Tip: puedes ajustar los colores ahora; la vista previa se actualiza al instante.</div>
        </div>
      </div>

      <div class="footer">
        <div>© 2025 Publitron • Demo de flujo de onboarding</div>
        <div>Soporte: soporte@publitron.demo</div>
      </div>
    </div>
  `,


  async afterRender() {
    this.currentStep = 1;
    this.totalSteps = 8;
    this.ownerData = {};
    this.audienceInterests = [];
    this.audiencePainPoints = [];
    this.setupEventListeners();
    this.updateStep();
  },

  setupEventListeners() {
    // Botones de navegación
    const googleBtn = document.getElementById("googleBtn");
    const facebookBtn = document.getElementById("facebookBtn");
    googleBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await this.handleGoogleLogin();
    });

    facebookBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await this.handleFacebookLogin();
    });
    document.getElementById("nextBtn").addEventListener("click", async (e) => {
      e.preventDefault();
      await this.next();
    });
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.prev());
    document
      .getElementById("sendCodeBtn")
      .addEventListener("click", () => this.fakeSendCode());
    document
      .getElementById("goDashboardBtn")
      .addEventListener("click", () => this.goDashboard());

    // Flow steps
    document.querySelectorAll(".flow .step").forEach((step) => {
      step.addEventListener("click", () => {
        this.currentStep = parseInt(step.dataset.step);
        this.updateStep();
      });
      this.hideLoading();
    });
    //intereses inpout
    const interestsInput = document.getElementById("audience_interests_input");
    interestsInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && interestsInput.value.trim() !== "") {
        e.preventDefault();
        this.addInterestTag(interestsInput.value.trim());
        interestsInput.value = "";
      }
    });
    //puntos de dolor
    const painpointsInput = document.getElementById("audience_painpoints_input");
    painpointsInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && painpointsInput.value.trim() !== "") {
        e.preventDefault();
        this.addPainPoint(painpointsInput.value.trim());
        painpointsInput.value = "";
      }
    });
    // Color pickers
    const pPicker = document.getElementById("colorPrimary");
    const aPicker = document.getElementById("colorAccent");
    const pColor = document.getElementById("pColor");
    const aColor = document.getElementById("aColor");

    pPicker.addEventListener("input", (e) => {
      document.documentElement.style.setProperty("--primary", e.target.value);
      pColor.textContent = e.target.value.toUpperCase();
    });

    aPicker.addEventListener("input", (e) => {
      document.documentElement.style.setProperty("--accent", e.target.value);
      aColor.textContent = e.target.value.toUpperCase();
    });
    //sociual tokens
    document.querySelectorAll(".toggle-token").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        input.type = input.type === "password" ? "text" : "password";
      });
    });

    // Live preview
    const nameInput = document.getElementById("company");
    const countrySel = document.getElementById("country");
    const previewName = document.getElementById("previewName");
    const previewCountry = document.getElementById("previewCountry");

    nameInput?.addEventListener("input", () => {
      previewName.textContent = nameInput.value || "Tu Empresa";
    });

    countrySel?.addEventListener("change", () => {
      previewCountry.textContent = "País: " + (countrySel.value || "—");
    });

    // Logo preview
    const logoInput = document.getElementById("logo");
    const logoPrev = document.getElementById("logoPreview");
    const finalLogo = document.getElementById("finalLogo");

    logoInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        this.loadPreview(logoPrev, file);
        this.loadPreview(finalLogo, file);
      }
    });
  },

  async handleGoogleLogin() {
    this.showLoading();

    try {
      const ownerCredentials = await AuthService.loginWithGoogle();
      const ownerData = {
        companyId: "123",
        nombre: ownerCredentials.user.email,//agregar aqui nombre en el flujo del registro
        email: ownerCredentials.user.email,
        rol: "owner"
      }
      if (ownerCredentials.success) {

        await this.saveOwner(ownerData, ownerCredentials.user.idToken);
        console.log("oki");

        this.currentStep = 2;
        this.updateStep();
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError("Error al iniciar sesión con Google");
    } finally {
      this.hideLoading();
    }
  },

  async handleFacebookLogin() {
    this.showLoading();

    try {
      const result = await AuthService.loginWithFacebook();

      if (result.success) {
        this.currentStep = 2;
        this.updateStep
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError("Error al iniciar sesión con Facebook");
    } finally {
      this.hideLoading();
    }
  },

  updateStep() {
    // Actualizar vistas
    document.querySelectorAll(".view").forEach((view) => {
      view.hidden = parseInt(view.dataset.step) !== this.currentStep;
    });

    // Actualizar steps
    document.querySelectorAll(".flow .step").forEach((step) => {
      step.classList.toggle(
        "active",
        parseInt(step.dataset.step) === this.currentStep
      );
    });

    // Actualizar títulos y hints
    const titles = {
      1: "1) Registro: correo y contraseña",
      2: "2) Verificación de correo",
      3: "3) Empresa: nombre comercial y país",
      4: "4) Sector o actividad ",
      5: "5) Público objetivo ",
      6: "6) Branding: logo y colores",
      7: "7) Conectar redes sociales (opcional)",
      8: "8) Finalizar y continuar al Dashboard",
    };

    const hints = {
      1: "Crea tu usuario corporativo.",
      2: "Ingresa el código recibido en tu correo.",
      3: "Cuéntanos cómo se llama tu empresa y dónde opera.",
      4: "Esto nos ayuda a personalizar la experiencia.",
      5: "Cuéntanos sobre tu público objetivo.",
      6: "Sube tu logo y elige tus colores.",
      7: "Conecta tus canales para automatizar mensajes.",
      8: "Todo listo, te llevamos a tu Dashboard.",
    };

    document.getElementById("formTitle").textContent = titles[this.currentStep];
    document.getElementById("formHint").textContent = hints[this.currentStep];
    document.getElementById(
      "progress"
    ).textContent = `Paso ${this.currentStep} de ${this.totalSteps}`;

    // Mostrar/ocultar botones de navegación
    document.getElementById("navButtons").style.display =
      this.currentStep === 8 ? "none" : "flex";

    // Actualizar email display en paso 2
    if (this.currentStep === 2) {
      const email = document.getElementById("email").value || "tu correo";
      document.getElementById("emailDisplay").textContent = email;
    }

    // Llenar preview final en paso 7
    if (this.currentStep === 8) {
      this.fillFinalPreview();
    }
  },

  async next() {
    let validate = await this.validateCurrentStep();
    if (validate) {
      this.currentStep = Math.min(this.totalSteps, this.currentStep + 1);
      this.updateStep();
    }
  },

  prev() {
    this.currentStep = Math.max(1, this.currentStep - 1);
    this.updateStep();
  },

  async validateCurrentStep() {
    if (this.currentStep === 1) {
      const e1 = document.getElementById("email").value.trim();
      const e2 = document.getElementById("email2").value.trim();
      const p1 = document.getElementById("pass").value;
      const p2 = document.getElementById("pass2").value;

      if (!e1 || e1 !== e2) {
        alert("Verifica tu correo.");
        return false;
      }
      if (p1.length < 8 || p1 !== p2) {
        alert("La contraseña debe coincidir y tener al menos 8 caracteres.");
        return false;
      }
      // Intentar registrar el usuario
      this.showLoading();
      try {
        const ownerCredentials = await AuthService.register(e1, p1);
        console.log(ownerCredentials);

        const ownerData = {
          companyId: "123",
          nombre: ownerCredentials.user.email,//agregar aqui nombre en el flujo del registro
          email: ownerCredentials.user.email,
          rol: "owner"
        }
        if (ownerCredentials.success) {

          await this.saveOwner(ownerData, ownerCredentials.user.idToken);
          console.log("ok");


          return true;
        } else {
          throw new Error(ownerCredentials.error || "Error al registrar usuario.");
        }
      } catch (error) {
        console.error(error);
        alert(error.message);
        return false;
      } finally {
        this.hideLoading();
      }
    }

    if (this.currentStep === 3) {
      if (
        !document.getElementById("company").value.trim() ||
        !document.getElementById("country").value
      ) {
        alert("Nombre comercial y país son obligatorios.");
        return false;
      }
    }

    return true;
  },

  fakeSendCode() {
    const el = document.getElementById("codeStatus");
    el.textContent = "Código enviado ✓ (simulado)";
    el.style.color = "var(--ok)";
  },

  addInterestTag(text) {
    const interestsContainer = document.getElementById("interests-container");
    const interestsInput = document.getElementById("audience_interests_input");
    if (this.audienceInterests.includes(text)) return; // evitar duplicados

    this.audienceInterests.push(text);

    const tag = document.createElement("span");
    tag.classList.add("tag");
    tag.innerHTML = `${text} <span class="remove-tag">&times;</span>`;

    tag.querySelector(".remove-tag").addEventListener("click", () => {
      this.removeInterestTag(text, tag);
    });

    interestsContainer.insertBefore(tag, interestsInput);
  },

  removeInterestTag(text, tagElement) {
    const index = this.audienceInterests.indexOf(text);
    if (index > -1) {
      this.audienceInterests.splice(index, 1);
    }
    tagElement.remove();
  },

  addPainPoint(text) {
    const container = document.getElementById("painpoints-container");
    const input = document.getElementById("audience_painpoints_input");
    if (this.audiencePainPoints.includes(text)) return; // evitar duplicados

    this.audiencePainPoints.push(text);

    const tag = document.createElement("span");
    tag.classList.add("tag", "long-tag"); // clase extra para estilos largos
    tag.innerHTML = `${text} <span class="remove-tag">&times;</span>`;

    tag.querySelector(".remove-tag").addEventListener("click", () => {
      this.removePainPoint(text, tag);
    });

    container.insertBefore(tag, input);
  },

  removePainPoint(text, tagElement) {
    const index = this.audiencePainPoints.indexOf(text);
    if (index > -1) {
      this.audiencePainPoints.splice(index, 1);
    }
    tagElement.remove();
  },

  getAudienceData() {
    return {
      demographics: document.getElementById("audience_demographics").value,
      interests: this.audienceInterests
    };
  },

  loadPreview(target, file) {
    const img = new Image();
    const r = new FileReader();
    r.onload = (e) => {
      img.onload = () => {
        target.innerHTML = "";
        target.appendChild(img);
      };
      img.src = e.target.result;
      img.alt = "Logo";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
    };
    r.readAsDataURL(file);
  },

  fillFinalPreview() {
    document.getElementById("finalCompany").textContent =
      document.getElementById("company").value || "Tu Empresa";
    document.getElementById("finalCountry").textContent =
      document.getElementById("country").value || "—";
    document.getElementById("finalSector").textContent =
      document.getElementById("sector").value || "—";

    const count = ["wa", "ig", "fb", "li", "tt"]
      .map((id) => document.getElementById(id).checked)
      .filter(Boolean).length;
    document.getElementById("socialCount").textContent = `${count} canal${count === 1 ? "" : "es"
      } conectados`;
  },

  showLoading(message = "Cargando...", targetId = "nextBtn") {
    const btn = document.getElementById(targetId);
    if (!btn) return;
    btn.dataset.originalText = btn.textContent; // guarda el texto original
    btn.textContent = message;
    btn.disabled = true;
    btn.classList.add("loading"); // clase css opcional
  },

  hideLoading(targetId = "nextBtn") {
    const btn = document.getElementById(targetId);
    if (!btn) return;
    btn.textContent = btn.dataset.originalText || "Siguiente";
    btn.disabled = false;
    btn.classList.remove("loading");
  },
  async saveOwner(ownerData, token) {

    const health = await healthCheck(token);
    console.log("Health Check:", health);
    const res = await registerOwnerCompany(ownerData, token);
    console.log("Register Owner Company:", res);
    // res = await registerOwnerCompany({
    //     companyId: "123",
    //     nombre:  ownerCredentials.user.email,
    //     email: ownerCredentials.user.email,
    //     rol: "owner"
    // }, ownerCredentials.user.accessToken);
    // console.log("ok");

  },
  async saveCompanyLogo (logo,path){
    try {
      const res =  await storageService.uploadFile(logo,path)
      console.log(res);
      return res
      
    } catch (error) {
      console.error("no se pudo guardar la imagen");
      
    }
      
  },
  async saveCompany() {
    const company  = await getCompanyId(AuthService.getAuthToken());
    const companyId  = company.companyId
    const logo = document.getElementById("logo").files[0]
    const pathLogo =`${companyId}/branding/logo`
    await this.saveCompanyLogo(logo,pathLogo)

    const data = {
      companyData: {
        // email: document.getElementById("email").value.trim(),
        generalData: {
          company: document.getElementById("company").value.trim(),
          country: document.getElementById("country").value,
          taxid: document.getElementById("taxid").value.trim(),
          sector: document.getElementById("sector").value,
          size: document.getElementById("size").value,

        },
        audience: {
          demographics: document.getElementById("audience_demographics").value.trim(),
          interests: this.audienceInterests,
          painpoints: this.audiencePainPoints,
          current_geographic_scope: document.getElementById("current_geographic_scope").value.trim(),
        },
        branding: {
          company_description: document.getElementById("company_description").value.trim(),
          strategic_objective_company: document.getElementById("strategic_objective_company").value.trim(),
          tagline: document.getElementById("tagline").value.trim(),
          colors: {
            primary: document.getElementById("colorPrimary").value,
            accent: document.getElementById("colorAccent").value,
          },
          // El logo se puede guardar como url falta aplicar la logica de subida a fire storage :)
          logo: `${pathLogo}/${logo.name}`,
        },
        socials: {
          whatsapp: document.getElementById("wa").checked
            ? {
              handle: document.getElementById("waHandle").value.trim(),
              token: document.getElementById("waToken").value.trim()
            }
            : null,
          instagram: document.getElementById("ig").checked
            ? {
              handle: document.getElementById("igHandle").value.trim(),
              token: document.getElementById("igToken").value.trim()
            }
            : null,
          facebook: document.getElementById("fb").checked
            ? {
              handle: document.getElementById("fbHandle").value.trim(),
              token: document.getElementById("fbToken").value.trim()
            }
            : null,
          linkedin: document.getElementById("li").checked
            ? {
              handle: document.getElementById("liHandle").value.trim(),
              token: document.getElementById("liToken").value.trim()
            }
            : null,
          tiktok: document.getElementById("tt").checked
            ? {
              handle: document.getElementById("ttHandle").value.trim(),
              token: document.getElementById("ttToken").value.trim()
            }
            : null,
          web: document.getElementById("web").value.trim(),
        },
      }
    };



    console.log("Datos recopilados:", data);
    const res = await registerCompany(data, AuthService.getAuthToken())
    return res ;

  },

async goDashboard() {
  this.showLoading("Guardando...", "goDashboardBtn");
  try {
      const res = await  this.saveCompany();
      if ( await res.message) {
         console.log(res)
         window.location.href = "/admin"
      }
 
  } catch (error) {
    console.error("Error al guardar empresa:", error);
    alert("Ocurrió un error al guardar la empresa.");
  } finally {
       
    this.hideLoading("goDashboardBtn");
    
  }
},
};
