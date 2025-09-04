import { generateSocialPost } from '../../services/api/aiService.js';
import { AuthService } from '../../services/auth/authService.js';
import { Modal } from '../ui/Modal.js';

export class PublicationModal extends Modal {
  constructor(container, options = {}) {
    super(container, {
      title: options.publication ? 'Editar Publicación' : 'Nueva Publicación',
      showFooter: false,
      ...options
    });

    this.mode = options.mode || 'manual';
    this.publication = options.publication || {};
    this.selectedDate = options.selectedDate;
    this.selectedTime = options.selectedTime;
    this.onSave = options.onSave || (() => { });
    this.onDelete = options.onDelete || (() => { });
    this.currentEntity = null;
    this.currentStep = "main";
    this.generatedContent = null;
  }

  render() {
    if (this.currentStep === 'ai') {
      this.renderAIStep();
      this.addEventListeners();
    } else if (this.currentStep === 'manual') {
      this.renderManualStep();
      this.addEventListeners();
    } else if (this.currentStep === 'generated') {
      this.renderGeneratedStep();
      this.addEventListeners();
    } else {
      this.renderMainStep();
      this.addEventListeners();
    }
  }

  renderMainStep() {
    this.data.content = `
      <div class="publication-modal-main">
        <div class="modal-section">
          <h4>Selecciona cómo quieres crear tu publicación</h4>
          <div class="creation-options">
            <button class="creation-option" id="aiOption">
              <div class="option-icon">🤖</div>
              <div class="option-content">
                <h5>Generar con IA</h5>
                <p>Describe tu idea y la IA generará el contenido completo</p>
              </div>
            </button>
            <button class="creation-option" id="manualOption">
              <div class="option-icon">✏️</div>
              <div class="option-content">
                <h5>Crear Manualmente</h5>
                <p>Escribe y personaliza tu contenido desde cero</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;
    super.render();
    super.addEventListeners();
  }

  renderAIStep() {
    this.data.content = `
<div class="publication-modal-ai">
  <div class="modal-section">
    <h4>Generar contenido con IA</h4>
    <form id="aiForm" class="ai-form">
      <div class="form-group">
        <div class="toolbar">
          <label>Entidad:
            <select id="entitySelect"></select>
          </label>
          <label>Dato (Nombre):
            <select id="recordSelect"></select>
          </label>
        </div>
        <div id="selectionResult"></div>
      </div>
      <div class="form-group">
        <label for="aiPrompt">Describe tu idea o tema</label>
        <textarea id="aiPrompt" rows="4"
          placeholder="Ej: Quiero crear un post sobre los beneficios de nuestra nueva tarjeta de crédito..."
          ></textarea>
      </div>
      <div class="form-group">
        <label for="aiTone">Tono</label>
        <select id="aiTone" required>
          <option value="professional">Profesional</option>
          <option value="casual">Casual</option>
          <option value="friendly">Amigable</option>
          <option value="formal">Formal</option>
          <option value="humorous">Humorístico</option>
        </select>
      </div>
      <div class="form-group">
        <label for="pubPlatform">Plataforma</label>
        <select id="pubPlatform" required>
          <option value="">Seleccionar plataforma</option>
          <option value="instagram" ${this.publication.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
          <option value="facebook" ${this.publication.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
          <option value="twitter" ${this.publication.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
          <option value="linkedin" ${this.publication.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
          <option value="tiktok" ${this.publication.platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
        </select>
      </div>
      <div class="form-group">
        <label for="pubType">Tipo de Publicación</label>
        <select id="pubType" required>
          <option value="post" ${this.publication.type === 'post' ? 'selected' : ''}>Post</option>
          <option value="story" ${this.publication.type === 'story' ? 'selected' : ''}>Story</option>
          <option value="reel" ${this.publication.type === 'reel' ? 'selected' : ''}>Reel</option>
          <option value="video" ${this.publication.type === 'video' ? 'selected' : ''}>Video</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="pubDate">Fecha</label>
          <input type="date" id="pubDate" value="${this.selectedDate || this.publication.date || ''}" required>
        </div>
        <div class="form-group">
          <label for="pubTime">Hora</label>
          <input type="time" id="pubTime" value="${this.selectedTime || this.publication.time || ''}" required>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" id="backToMain">Atrás</button>
        <button type="submit" class="btn btn-primary" id="generateContent">
          <span class="btn-text">Generar Contenido</span>
          <span class="btn-loading hidden">Generando...</span>
        </button>
      </div>
    </form>
  </div>
</div>
    `;
    super.render();
    this.addAIStepListeners();
    const modalCloseBtn = this.getElement('#modalClose');
    if (modalCloseBtn) modalCloseBtn.onclick = () => this.close();
  }

  renderManualStep() {
    this.data.content = `
      <div class="publication-modal-manual">
        <form id="manualForm" class="manual-form">
          <div class="form-row">
            <div class="form-group">
              <label for="pubTitle">Título</label>
              <input type="text" id="pubTitle" value="${this.publication.title || ''}" required>
            </div>
            <div class="form-group">
              <label for="pubPlatform">Plataforma</label>
              <select id="pubPlatform" required>
                <option value="">Seleccionar plataforma</option>
                <option value="instagram" ${this.publication.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                <option value="facebook" ${this.publication.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                <option value="twitter" ${this.publication.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                <option value="linkedin" ${this.publication.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                <option value="tiktok" ${this.publication.platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="pubDate">Fecha</label>
              <input type="date" id="pubDate" value="${this.selectedDate || this.publication.date || ''}" required>
            </div>
            <div class="form-group">
              <label for="pubTime">Hora</label>
              <input type="time" id="pubTime" value="${this.selectedTime || this.publication.time || ''}" required>
            </div>
          </div>
          <div class="form-group">
            <label for="pubContent">Contenido</label>
            <textarea id="pubContent" rows="6">${this.publication.content || ''}</textarea>
            <div class="char-counter"><span id="charCount">0</span> caracteres</div>
          </div>
          <div class="form-group">
            <label for="pubType">Tipo de Publicación</label>
            <select id="pubType" required>
              <option value="post" ${this.publication.type === 'post' ? 'selected' : ''}>Post</option>
              <option value="story" ${this.publication.type === 'story' ? 'selected' : ''}>Story</option>
              <option value="reel" ${this.publication.type === 'reel' ? 'selected' : ''}>Reel</option>
              <option value="video" ${this.publication.type === 'video' ? 'selected' : ''}>Video</option>
            </select>
          </div>
          <div class="form-group">
            <label for="pubMedia">Medios (opcional)</label>
            <div class="media-upload">
              <input type="file" id="pubMedia" accept="image/*,video/*" multiple>
              <div class="upload-area" id="uploadArea">
                <p>Arrastra archivos aquí o haz clic para seleccionar</p>
              </div>
              <div class="media-preview" id="mediaPreview"></div>
            </div>
          </div>
          <div class="form-group">
            <label for="pubTags">Etiquetas (opcional)</label>
            <input type="text" id="pubTags" value="${this.publication.tags ? this.publication.tags.join(', ') : ''}">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" id="backToMainManual">Atrás</button>
            ${this.publication.id ? `<button type="button" class="btn btn-danger" id="deletePublication">Eliminar</button>` : ''}
            <button type="submit" class="btn btn-primary">${this.publication.id ? 'Actualizar' : 'Programar'}</button>
          </div>
        </form>
      </div>
    `;
    super.render();
    super.addEventListeners();
    const modalCloseBtn = this.getElement('#modalClose');
    if (modalCloseBtn) modalCloseBtn.onclick = () => this.close();
  }

  afterRender() {
    this.addEventListeners();
  }

  addEventListeners() {
    if (this.currentStep === 'main') this.addMainStepListeners();
    else if (this.currentStep === 'ai') this.addAIStepListeners();
    else if (this.currentStep === 'manual') this.addManualStepListeners();

    // Listeners para cerrar el modal (X y botones volver)
    const closeBtns = this.container.querySelectorAll('.btn-ghost, .modal-header button');
    closeBtns.forEach(btn => {
      if (btn.id === 'closeViewModal' || btn.id === 'closeSheetModal' || btn.id === 'backToMain' || btn.id === 'backToMainManual') {
        btn.onclick = () => this.close();
      }
    });
  }

  addMainStepListeners() {
    const aiOption = this.getElement('#aiOption');
    const manualOption = this.getElement('#manualOption');
    if (aiOption) aiOption.addEventListener('click', () => { this.currentStep = 'ai'; this.destroy(); this.render(); });
    if (manualOption) manualOption.addEventListener('click', () => { this.currentStep = 'manual'; this.destroy(); this.render(); });
  }

  addAIStepListeners() {
    // Listeners para cerrar el modal (X, volver, cancelar)
    const closeBtn = this.getElement('.modal-header button');
    if (closeBtn) closeBtn.onclick = () => this.close();
    const backBtn = this.getElement('#backToMain');
    if (backBtn) backBtn.onclick = () => this.close();
    const backManualBtn = this.getElement('#backToMainManual');
    if (backManualBtn) backManualBtn.onclick = () => this.close();
    const closeViewBtn = this.getElement('#closeViewModal');
    if (closeViewBtn) closeViewBtn.onclick = () => this.close();
    const closeSheetBtn = this.getElement('#closeSheetModal');
    if (closeSheetBtn) closeSheetBtn.onclick = () => this.close();
    let selectedRecord = null;
    let sheets = JSON.parse(localStorage.getItem("entitySheets")) || [];
    let currentEntity = null;

    const entitySelect = this.getElement("#entitySelect");
    const recordSelect = this.getElement("#recordSelect");
    const selectionResult = this.getElement("#selectionResult");
    const aiForm = this.getElement('#aiForm');

    function renderEntitySelect() {
      entitySelect.innerHTML = '<option value="">-- Selecciona una entidad --</option>';
      sheets.forEach((sheet, idx) => {
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = sheet.name;
        entitySelect.appendChild(opt);
      });
    }

    function renderRecordSelect(sheet) {
      recordSelect.innerHTML = '<option value="">-- Selecciona un dato --</option>';
      if (!sheet) return;
      sheet.data.forEach((row, idx) => {
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = row.name || `Registro ${idx + 1}`;
        recordSelect.appendChild(opt);
      });
    }

    entitySelect.onchange = null;
    entitySelect.addEventListener("change", (e) => {
      const idx = e.target.value;
      currentEntity = idx !== "" ? sheets[idx] : null;
      renderRecordSelect(currentEntity);
    });

    recordSelect.onchange = null;
    recordSelect.addEventListener("change", (e) => {
      const idx = e.target.value;
      if (currentEntity && idx !== "") {
        selectedRecord = currentEntity.data[idx];
        selectionResult.innerHTML = `Seleccionaste: <b>${selectedRecord.name}</b> de la entidad <b>${currentEntity.name}</b>`;
      } else {
        selectedRecord = null;
        selectionResult.innerHTML = "";
      }
    });

    renderEntitySelect();

    if (backBtn) backBtn.onclick = null;
    if (backBtn) backBtn.addEventListener('click', () => { this.currentStep = 'main'; this.destroy(); this.render(); });

    if (aiForm) {
      aiForm.onsubmit = null;
      aiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (aiForm._submitting) return;
        aiForm._submitting = true;
        const basePrompt = {
          platform_to_publish: {
            platforms: [
              this.getElement('#pubPlatform').value
            ],
            preferred_formats: [
              this.getElement('#pubType').value,
            ],
            date_to_publish: {
              date: this.getElement('#pubDate').value,
              time: this.getElement('#pubTime').value
            }
          },
          product_data: selectedRecord,
          ia_settings: {
            tone: this.getElement('#aiTone').value,
            prompt: this.getElement('#aiPrompt').value
              || "",
          }
        };
        const publicationData = {
          platform: this.getElement('#pubPlatform').value,
          date: this.getElement('#pubDate').value,
          time: this.getElement('#pubTime').value,
          type: this.getElement('#pubType').value,
          status: 'scheduled',
          generatedByAI: true
        };
        this.generateAIContent(basePrompt, publicationData).finally(() => {
          aiForm._submitting = false;
        });
      });
    }
  }

  addManualStepListeners() {
    const backBtn = this.getElement('#backToMainManual');
    const manualForm = this.getElement('#manualForm');
    const deleteBtn = this.getElement('#deletePublication');
    const contentTextarea = this.getElement('#pubContent');
    const mediaInput = this.getElement('#pubMedia');
    const uploadArea = this.getElement('#uploadArea');

    if (backBtn) backBtn.addEventListener('click', () => { this.currentStep = 'main'; this.render(); });
    if (deleteBtn) deleteBtn.addEventListener('click', () => { if (confirm('¿Eliminar publicación?')) { this.onDelete(this.publication.id); this.close(); } });
    if (manualForm) manualForm.addEventListener('submit', (e) => { e.preventDefault(); this.saveManualPublication(); });
    if (contentTextarea) contentTextarea.addEventListener('input', (e) => { const c = this.getElement('#charCount'); if (c) c.textContent = e.target.value.length; });

    if (mediaInput && uploadArea) {
      uploadArea.addEventListener('click', () => mediaInput.click());
      uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
      uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
      uploadArea.addEventListener('drop', (e) => { e.preventDefault(); uploadArea.classList.remove('dragover'); this.handleMediaFiles(e.dataTransfer.files); });
      mediaInput.addEventListener('change', (e) => { this.handleMediaFiles(e.target.files); });
    }
  }

  async generateAIContent(basePrompt, publicationData) {
    const generateBtn = this.getElement('#generateContent');
    const btnText = this.getElement('.btn-text');
    const btnLoading = this.getElement('.btn-loading');
    console.log('base', basePrompt);

    if (generateBtn) {
      generateBtn.disabled = true;
      btnText?.classList.add('hidden');
      btnLoading?.classList.remove('hidden');
    }

    try {
      const aiResponse = await generateSocialPost(basePrompt, AuthService.getAuthToken());
      console.log("Respuesta IA:", await aiResponse);
      this.generatedContent = {
        post_strategy: aiResponse.post_strategy,
        post_text: aiResponse.post_text,
        image_description: aiResponse.image_description,
        image_url: aiResponse.image_url
        // title: `Nuevo ${publicationData.platform.charAt(0).toUpperCase() + publicationData.platform.slice(1)} Post`,
        // content: `¡Descubre las increíbles ventajas de nuestros servicios!`,
        // platform: publicationData.platform,
        // tone: publicationData.tone
      };
      this.showGeneratedContent();
    } catch (error) {
      alert('Error al generar contenido: ' + error.message);
    } finally {
      if (generateBtn) {
        generateBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
      }
    }
  }

  showGeneratedContent() {
    this.currentStep = 'generated';
    this.render();
  }

  renderGeneratedStep() {12
    this.data.content = `
  <div class="publication-modal-generated">
                    <div class="modal-section generated-strategy">
                        <h3>Estrategia Generada</h3>
                        <div class="divider">
                            <h4 class="center">Datos Generale</h4>
                        </div>

                        <div class="form-group">
                            <label for="generatedTitle">Título</label>
                            <input type="text" id="generatedTitle"
                                value="${this.generatedContent.post_strategy.titulo_estrategia || ""}">
                        </div>
                        <div class="form-group">
                            <label for="generatedContent">Contenido</label>
                            <textarea id="generatedContent"
                                rows="6">${this.generatedContent.post_strategy.objetivo_campana || ""}</textarea>
                        </div>
                        <div class="divider">
                            <h4 class="center">Análisis público Objetivo</h4>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="generatedDate">Perfil Demográfico</label>
                                <textarea id="generatedDate" rows="4"
                                    required="">${this.generatedContent.post_strategy.analisis_publico_objetivo.perfil_demografico || ""}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="generatedDate">Comportamiento en Redes Sociales</label>
                                <textarea id="generatedDate" rows="4"
                                    required="">${this.generatedContent.post_strategy.analisis_publico_objetivo.intereses || ""}</textarea>
                            </div>
                        </div>

                        <div class="divider">
                            <h4 class="center">concepto creativo publicacion</h4>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="generatedDate">Tipo de contenido</label>
                                <textarea id="generatedDate" rows="4"
                                    required="">${this.generatedContent.post_strategy.concepto_creativo_publicacion.tipo_contenido || ""}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="generatedDate">Estilo visual</label>
                                <textarea id="generatedDate" rows="4"
                                    required="">${this.generatedContent.post_strategy.concepto_creativo_publicacion.mensaje_principal || ""}</textarea>
                            </div>

                        </div>

                        <div class="divider">
                            <h4 class="center">Copys de publicación</h4>
                        </div>

                        <div id="copys-container" class="form-row">
                        </div>
                        <div class="divider">
                            <h4 class="center">Hashtags Sugeridos</h4>
                        </div>
                        <div class="form-group">
                            <label for="generatedHashtags">Hashtags</label>
                            <div id="hashtags-container" class="tags-input-container">
                                <input id="hashtagPublicationInput" type="text"
                                    placeholder="Escribe un hashtag y presiona Enter">
                            </div>
                        </div>

                        <div class="divider">
                            <h4 class="center">Sugerencias de Segmentación</h4>
                        </div>
                        <div class="form-group">
                            <label for="generatedLocation">plataforma</label>
                            <input type="text" id="generatedLocation"
                                value="${this.generatedContent.post_strategy.sugerencias_segmentacion.plataforma || ""}"
                                required="">
                        </div>
                        <div class="form-group">
                            <label for="generatedAudience">Datos Demográficos</label>
                            <textarea id="generatedAudience" rows="4"
                                required="">${this.generatedContent.post_strategy.sugerencias_segmentacion.datos_demograficos || ""}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="generatedInterests">Intereses y Comportamientos</label>
                            <textarea id="generatedInterests" rows="4"
                                required="">${this.generatedContent.post_strategy.sugerencias_segmentacion.intereses_y_comportamientos || ""}</textarea>
                        </div>
                        <div class="divider">
                            <h4 class="center">KPI's Sugeridos</h4>
                        </div>
                        <div id="kpis-container">
                        </div>

                        <div class="form-group">

                            <div class="form-actions">
                                <button type="button" class="btn btn-ghost" id="regenerateContent">Regenerar</button>
                                <button type="button" class="btn btn-primary" id="saveGeneratedContent">generar
                                    publicidad en meta</button>
                            </div>

                        </div>

                    </div>
                    <div class="modal-section generated-content">
                        <h4>Contenido Generado</h4>
  
                            <div class="form-group">
                                <h4 for="generatedTitle">Texto de Publicación</h4>
                                <label for="generatedTitle" type="text" id="generatedText">${this.generatedContent.post_text.text}</label>
                            </div>
                            <div class="form-group">
                                <label for="generatedContent">Medios</label>
                                <img src="${this.generatedContent.image_url}" alt="">
                            </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-ghost" id="regenerateContent">Regenerar</button>
                            <button type="button" class="btn btn-primary" id="saveGeneratedContent">Programar</button>
                        </div>
                    </div>
                </div>
  `;
    super.render();
    const regenerateBtn = this.getElement('#regenerateContent');
    const saveBtn = this.getElement('#saveGeneratedContent');
    const closeBtns = this.container.querySelectorAll('.btn-ghost, .modal-header button');
    const HashtagInput = document.getElementById("hashtagPublicationInput");
    const copysContainer = this.getElement('#copys-container');
    const kpisContainer = this.getElement('#kpis-container');
    this.generatedContent.post_strategy.copys_publicacion.forEach(copy => {
      copysContainer.innerHTML += `
        <div class="form-group copy-group">
            <label>Enfoque: <strong>${copy.enfoque}</strong></label>
            <textarea rows="4">${copy.texto}</textarea>
        </div>
    `;
    });
    this.generatedContent.post_strategy.hashtags.forEach(tag => {
      console.log("Tag:", tag);
      
      this.addHashTag(tag);
    });
    this.generatedContent.post_strategy.kpis.forEach(kpi => {
      kpisContainer.innerHTML += `
        <div class="form-group kpi-group">
            <label>KPI: <strong>${kpi}</strong></label>
        </div>
    `;
    });
    HashtagInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && HashtagInput.value.trim() !== "") {
        e.preventDefault();
        this.addHashTag(HashtagInput.value.trim());
        HashtagInput.value = "";
      }
    });
    if (regenerateBtn) regenerateBtn.addEventListener('click', () => {
      this.close();
      setTimeout(() => {
        this.currentStep = 'ai';
        this.render();
      }, 100);
    });
    if (saveBtn) saveBtn.addEventListener('click', () => { this.saveGeneratedPublication(); });
    closeBtns.forEach(btn => {
      if (btn.id === 'closeViewModal' || btn.id === 'closeSheetModal') {
        btn.onclick = () => this.close();
      }
    });
    
  }

  addHashTag(text){
    const hashtagsContainer = document.getElementById("hashtags-container");
    const hashtagInput = document.getElementById("hashtagPublicationInput");
    // if ( this.generatedContent.post_strategy.hashtags.includes(text)) return; // evitar duplicados
     this.generatedContent.post_strategy.hashtags.push(text);
    const tag = document.createElement("span");
    tag.classList.add("tag");
    tag.innerHTML = `${text} <span class="remove-tag">&times;</span>`;
    tag.querySelector(".remove-tag").addEventListener("click", () => {
      this.removeHashtagTag(text, tag);
    });
    hashtagsContainer.insertBefore(tag, hashtagInput);
  }
  removeHashtagTag(text, tagElement) {
    const index = this.publication.tags.indexOf(text);
    if (index > -1) {
      this.publication.tags.splice(index, 1);
    }
    tagElement.remove();
  }

  saveGeneratedPublication() {
    const publication = {
      title: this.getElement('#generatedTitle').value,
      content: this.getElement('#generatedContent').value,
      platform: this.generatedContent.platform,
      date: this.getElement('#generatedDate').value,
      time: this.getElement('#generatedTime').value,
      type: 'post',
      status: 'scheduled',
      generatedByAI: true
    };

    this.onSave(publication);
    this.close();
  }

  saveManualPublication() {
    console.log("Guardando publicación manual");
    const formData = new FormData(this.getElement('#manualForm'));
    const mediaFiles = this.getElement('#pubMedia').files;

    const publication = {
      id: this.publication.id,
      title: this.getElement('#pubTitle').value,
      platform: this.getElement('#pubPlatform').value,
      date: this.getElement('#pubDate').value,
      time: this.getElement('#pubTime').value,
      content: this.getElement('#pubContent').value,
      type: this.getElement('#pubType').value,
      tags: this.getElement('#pubTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: 'scheduled',
      media: mediaFiles.length > 0 ? Array.from(mediaFiles) : []
    };

    this.onSave(publication);
    this.close();
  }

  handleMediaFiles(files) {
    const preview = this.getElement('#mediaPreview');
    if (!preview) return;

    preview.innerHTML = '';

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.innerHTML = `
          <img src="${e.target.result}" alt="${file.name}">
          <button type="button" class="remove-media">×</button>
        `;
        preview.appendChild(mediaItem);
      };
      reader.readAsDataURL(file);
    });
  }
}


