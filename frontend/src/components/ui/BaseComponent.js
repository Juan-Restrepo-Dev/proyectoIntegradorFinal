export class BaseComponent {
  constructor(container, data = {}) {
    this.container = container;
    this.data = data;
    this.elements = {};
  }

  render() {
    throw new Error('render() method must be implemented');
  }

  mount() {
    this.render();
    this.afterRender();
  }

  afterRender() {
    // Hook para lógica post-render
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  setData(newData) {
    this.data = { ...this.data, ...newData };
    this.render();
  }

  getElement(selector) {
    return this.container.querySelector(selector);
  }

  getAllElements(selector) {
    return this.container.querySelectorAll(selector);
  }

  addEventListeners() {
    // Hook para agregar event listeners
  }

  removeEventListeners() {
    // Hook para remover event listeners
  }
}
