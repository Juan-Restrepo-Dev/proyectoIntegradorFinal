import { BaseComponent } from './BaseComponent.js';

export class Modal extends BaseComponent {
  constructor(container, options = {}) {
    super(container, options);
    this.isOpen = false;
    this.onClose = options.onClose || (() => {});
    this.onConfirm = options.onConfirm || (() => {});
  }

  render() {
    let html = `
      <div class="modal-overlay ${this.isOpen ? 'active' : ''}" id="modalOverlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">${this.data.title || 'Modal'}</h3>
            <button class="modal-close" id="modalClose">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body" id="modalBody">
            ${this.data.content || ''}
          </div>
          ${this.data.showFooter !== false ? `
            <div class="modal-footer">
              <button class="btn btn-ghost" id="modalCancel">Cancelar</button>
              <button class="btn btn-primary" id="modalConfirm">${this.data.confirmText || 'Confirmar'}</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    console.log(this.container);
    
    this.container.insertAdjacentHTML('beforeend', html);
  }

  afterRender() {
    this.addEventListeners();
  }

  addEventListeners() {
    console.log("estos listeners");
 
    const overlay = this.getElement('#modalOverlay');
    const closeBtn = this.getElement('#modalClose');
    const cancelBtn = this.getElement('#modalCancel');
    const confirmBtn = this.getElement('#modalConfirm');

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        this.onConfirm();
        this.close();
      });
    }

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.render();
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.onClose();
    document.body.style.overflow = '';
    this.destroy();
  }
  destroy() {
    const overlay = this.getElement('#modalOverlay');
    if (overlay) {
      overlay.remove();
    }
  }

  setContent(content) {
    this.data.content = content;
    if (this.isOpen) {
      const modalBody = this.getElement('#modalBody');
      if (modalBody) {
        modalBody.innerHTML = content;
      }
    }
  }
}
