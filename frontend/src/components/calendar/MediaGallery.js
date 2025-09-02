import { BaseComponent } from '../ui/BaseComponent.js';
import { storageService } from '../../services/firebase/storageService.js';

export class MediaGallery extends BaseComponent {
  constructor(container, options = {}) {
    super(container, options);
    this.onMediaSelect = options.onMediaSelect || (() => {});
    this.mediaItems = [];
    this.selectedMedia = null;
    this.currentFilter = 'all';
    
    this.loadMediaItems();
  }

  render() {
    this.container.innerHTML = `
      <div class="media-gallery">
        <div class="gallery-header">
          <div class="gallery-controls">
            <button class="btn btn-sm btn-primary" id="uploadMediaBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Subir Media
            </button>
          </div>
          
          <div class="gallery-filters">
            <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
              Todos
            </button>
            <button class="filter-btn ${this.currentFilter === 'images' ? 'active' : ''}" data-filter="images">
              Imágenes
            </button>
            <button class="filter-btn ${this.currentFilter === 'videos' ? 'active' : ''}" data-filter="videos">
              Videos
            </button>
          </div>
        </div>
        
        <div class="gallery-search">
          <input type="text" id="mediaSearch" placeholder="Buscar en la galería..." class="search-input">
        </div>
        
        <div class="gallery-grid" id="mediaGrid">
          ${this.renderMediaItems()}
        </div>
        
        <div class="gallery-empty" id="emptyState" style="display: ${this.mediaItems.length === 0 ? 'block' : 'none'}">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
          </div>
          <h4>No hay medios disponibles</h4>
          <p>Sube imágenes y videos para usar en tus publicaciones</p>
          <button class="btn btn-primary" id="uploadFirstMedia">Subir Primer Media</button>
        </div>
      </div>
      
      <!-- Modal de subida de medios -->
      <div id="uploadModal" class="modal-overlay hidden">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Subir Media</h3>
            <button class="modal-close" id="closeUploadModal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form id="uploadForm" class="upload-form">
              <div class="upload-area" id="uploadDropZone">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <p>Arrastra archivos aquí o haz clic para seleccionar</p>
                <input type="file" id="fileInput" accept="image/*,video/*" multiple hidden>
              </div>
              
              <div class="upload-preview" id="uploadPreview"></div>
              
              <div class="upload-progress" id="uploadProgress" style="display: none;">
                <div class="progress-bar">
                  <div class="progress-fill" id="progressFill"></div>
                </div>
                <span class="progress-text" id="progressText">0%</span>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" id="cancelUpload">Cancelar</button>
            <button type="button" class="btn btn-primary" id="startUpload" disabled>Subir</button>
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    this.addEventListeners();
  }

  addEventListeners() {
    // Botones de filtro
    const filterBtns = this.getAllElements('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        this.updateFilterButtons();
        this.filterMediaItems();
      });
    });

    // Búsqueda
    const searchInput = this.getElement('#mediaSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchMediaItems(e.target.value);
      });
    }

    // Botones de subida
    const uploadBtn = this.getElement('#uploadMediaBtn');
    const uploadFirstBtn = this.getElement('#uploadFirstMedia');
    const closeUploadBtn = this.getElement('#closeUploadModal');
    const cancelUploadBtn = this.getElement('#cancelUpload');
    const startUploadBtn = this.getElement('#startUpload');

    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => this.openUploadModal());
    }

    if (uploadFirstBtn) {
      uploadFirstBtn.addEventListener('click', () => this.openUploadModal());
    }

    if (closeUploadBtn) {
      closeUploadBtn.addEventListener('click', () => this.closeUploadModal());
    }

    if (cancelUploadBtn) {
      cancelUploadBtn.addEventListener('click', () => this.closeUploadModal());
    }

    if (startUploadBtn) {
      startUploadBtn.addEventListener('click', () => this.uploadFiles());
    }

    // Drag and drop para subida
    this.setupDragAndDrop();
    
    // Event listeners para selección y eliminación de media
    this.setupMediaEventListeners();
  }

  setupDragAndDrop() {
    const dropZone = this.getElement('#uploadDropZone');
    const fileInput = this.getElement('#fileInput');

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());
      
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
      
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
      });
      
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        this.handleFileSelection(files);
      });

      fileInput.addEventListener('change', (e) => {
        this.handleFileSelection(e.target.files);
      });
    }
  }

  setupMediaEventListeners() {
    // Event delegation para media items
    const mediaGrid = this.getElement('#mediaGrid');
    if (mediaGrid) {
      mediaGrid.addEventListener('click', (e) => {
        const selectBtn = e.target.closest('.select-media');
        const deleteBtn = e.target.closest('.delete-media');
        const mediaItem = e.target.closest('.media-item');
        
        if (selectBtn) {
          const mediaId = parseInt(selectBtn.dataset.id);
          this.selectMedia(mediaId);
        } else if (deleteBtn) {
          const mediaId = parseInt(deleteBtn.dataset.id);
          this.deleteMedia(mediaId);
        } else if (mediaItem) {
          const mediaId = parseInt(mediaItem.dataset.id);
          this.selectMedia(mediaId);
        }
      });
    }
  }

  handleFileSelection(files) {
    const preview = this.getElement('#uploadPreview');
    const startBtn = this.getElement('#startUpload');
    
    if (!preview || !startBtn) return;

    preview.innerHTML = '';
    this.selectedFiles = Array.from(files);

    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
          <div class="preview-media">
            ${file.type.startsWith('image/') 
              ? `<img src="${e.target.result}" alt="${file.name}">`
              : `<video src="${e.target.result}" controls></video>`
            }
          </div>
          <div class="preview-info">
            <span class="file-name">${file.name}</span>
            <span class="file-size">${this.formatFileSize(file.size)}</span>
          </div>
        `;
        preview.appendChild(previewItem);
      };
      reader.readAsDataURL(file);
    });

    startBtn.disabled = false;
  }

  async uploadFiles() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) return;

    const progressBar = this.getElement('#uploadProgress');
    const progressFill = this.getElement('#progressFill');
    const progressText = this.getElement('#progressText');
    const startBtn = this.getElement('#startUpload');

    if (progressBar && progressFill && progressText && startBtn) {
      progressBar.style.display = 'block';
      startBtn.disabled = true;
    }

    try {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        const progress = ((i + 1) / this.selectedFiles.length) * 100;
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${Math.round(progress)}%`;

        // Simular subida a Firebase Storage
        const result = await this.uploadToFirebase(file);
        
        // Agregar a la galería
        const mediaItem = {
          id: Date.now() + i,
          name: file.name,
          url: result.url,
          path: result.path,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          size: file.size,
          uploadedAt: new Date().toISOString()
        };

        this.mediaItems.unshift(mediaItem);
      }

      this.saveMediaItems();
      this.render();
      this.closeUploadModal();
      
      // Mostrar notificación de éxito
      this.showNotification('Media subido exitosamente', 'success');
      
    } catch (error) {
      console.error('Error uploading files:', error);
      this.showNotification('Error al subir el media', 'error');
    } finally {
      if (progressBar) progressBar.style.display = 'none';
      if (startBtn) startBtn.disabled = false;
    }
  }

  async uploadToFirebase(file) {
    try {
      // Validar archivo
      if (!storageService.validateFileType(file)) {
        throw new Error('Tipo de archivo no permitido');
      }
      
      if (!storageService.validateFileSize(file)) {
        throw new Error('El archivo es demasiado grande (máximo 10MB)');
      }
      
      // Subir a Firebase Storage
      const result = await storageService.uploadFile(file, 'media');
      return result;
    } catch (error) {
      console.error('Error uploading to Firebase:', error);
      throw error;
    }
  }

  renderMediaItems() {
    const filteredItems = this.getFilteredItems();
    
    if (filteredItems.length === 0) {
      return '<div class="no-results">No se encontraron resultados</div>';
    }

    return filteredItems.map(item => `
      <div class="media-item ${this.selectedMedia?.id === item.id ? 'selected' : ''}" 
           data-id="${item.id}" 
           data-type="${item.type}">
        <div class="media-preview">
          ${item.type === 'image' 
            ? `<img src="${item.url}" alt="${item.name}">`
            : `<video src="${item.url}" muted></video>`
          }
          <div class="media-overlay">
            <button class="select-media" data-id="${item.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </button>
            <button class="delete-media" data-id="${item.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="media-info">
          <span class="media-name">${item.name}</span>
          <span class="media-size">${this.formatFileSize(item.size)}</span>
        </div>
      </div>
    `).join('');
  }

  getFilteredItems() {
    let items = this.mediaItems;

    // Aplicar filtro por tipo
    if (this.currentFilter !== 'all') {
      items = items.filter(item => item.type === this.currentFilter.slice(0, -1)); // 'images' -> 'image'
    }

    // Aplicar búsqueda
    const searchTerm = this.getElement('#mediaSearch')?.value.toLowerCase();
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
      );
    }

    return items;
  }

  filterMediaItems() {
    const grid = this.getElement('#mediaGrid');
    if (grid) {
      grid.innerHTML = this.renderMediaItems();
    }
  }

  searchMediaItems(query) {
    this.filterMediaItems();
  }

  updateFilterButtons() {
    const filterBtns = this.getAllElements('.filter-btn');
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
    });
  }

  openUploadModal() {
    const modal = this.getElement('#uploadModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeUploadModal() {
    const modal = this.getElement('#uploadModal');
    if (modal) {
      modal.classList.add('hidden');
      // Limpiar formulario
      const form = this.getElement('#uploadForm');
      if (form) form.reset();
      const preview = this.getElement('#uploadPreview');
      if (preview) preview.innerHTML = '';
      this.selectedFiles = [];
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  loadMediaItems() {
    const saved = localStorage.getItem('media_gallery');
    this.mediaItems = saved ? JSON.parse(saved) : [];
  }

  saveMediaItems() {
    localStorage.setItem('media_gallery', JSON.stringify(this.mediaItems));
  }

  showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  selectMedia(mediaId) {
    const media = this.mediaItems.find(item => item.id === mediaId);
    if (media) {
      this.selectedMedia = media;
      this.onMediaSelect(media);
      this.render();
    }
  }

  deleteMedia(mediaId) {
    if (confirm('¿Estás seguro de que quieres eliminar este media?')) {
      this.mediaItems = this.mediaItems.filter(item => item.id !== mediaId);
      this.saveMediaItems();
      this.render();
    }
  }
}
