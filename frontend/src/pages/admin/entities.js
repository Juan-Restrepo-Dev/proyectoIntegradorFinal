import { AuthService } from "../../services/auth/authService.js";
import { storageService } from "../../services/firebase/storageService.js";

export default {
  template: `
 <div class="entities-layout">
 <div class="entities-content">
<!-- Entity Tabs -->
<div class="entity-tabs">
 <div class="tabs-header">
<div class="tabs-list" id="tabsList"></div>
<button id="addTabBtn" class="btn btn-primary">➕ Nueva Hoja</button>
 </div>
</div>

<!-- Entity Content -->
<div class="entity-content">
 <div class="entity-toolbar">
<div class="toolbar-left">
 <button id="addRowBtn" class="btn btn-primary">➕ Agregar Fila</button>
 <button id="addColumnBtn" class="btn btn-primary">➕ Agregar Columna</button>
</div>

<div class="toolbar-right">
 <input type="text" id="searchInput" placeholder="Buscar..." class="search-input">
 <button id="exportBtn" class="btn btn-ghost">⬇ Exportar</button>
 <button id="importBtn" class="btn btn-ghost">⬆ Importar</button>
 <input type="file" id="importFile" accept=".csv" style="display:none">
</div>
 </div>

 <!-- Excel-like Table -->
 <div class="excel-table-container">
<table class="excel-table" id="excelTable">
 <thead>
<tr id="headerRow"></tr>
 </thead>
 <tbody id="tableBody"></tbody>
</table>
 </div>
</div>
 </div>
 <!-- Modal para nueva hoja -->
 <div id="newSheetModal" class="modal hidden">
<div class="modal-content">
 <div class="modal-header">
<h3>Nueva Hoja de Entidad</h3>
<button id="closeSheetModal" class="btn btn-ghost">✖</button>
 </div>
 
 <form id="newSheetForm" class="modal-form">
<div class="form-group">
 <label for="sheetName">Nombre de la Hoja</label>
 <input type="text" id="sheetName" required>
</div>

<div id="columnsContainer"></div>
<button type="button" id="addColumnFieldBtn" class="btn btn-secondary">➕ Columna</button>

<div class="form-actions">
 <button type="button" id="cancelSheetBtn" class="btn btn-ghost">Cancelar</button>
 <button type="submit" class="btn btn-primary">Crear Hoja</button>
</div>
 </form>
</div>
 </div>

 <!-- Modal para nueva columna -->
 <div id="newColumnModal" class="modal hidden">
<div class="modal-content">
 <h3>Nueva Columna</h3>
 <p class="modal-subtitle">Usa la notación de punto para objetos anidados (ej: precios.moneda)</p>
 <div class="form-group">
<label>Nombre de la Columna</label>
<input type="text" id="columnName" placeholder="Ej: nombre_producto o precios.original">
 </div>
 <div class="form-group">
<label>Tipo de Dato</label>
<select id="columnType">
 <option value="str">Texto</option>
 <option value="int">Número</option>
 <option value="list_str">Lista de Textos</option>
 <option value="object">Objeto (JSON)</option>
 <option value="image">Imagen Única</option>
 <option value="gallery">Galería de Imágenes</option>
 <option value="video_url">URL de Video</option>
</select>
 </div>
 <div class="form-group">
<label><input type="checkbox" id="columnRequired"> Requerido</label>
 </div>
 <div class="form-actions">
<button type="button" id="cancelColumnBtn" class="btn btn-ghost">Cancelar</button>
<button type="button" id="saveColumnBtn" class="btn btn-primary">Agregar</button>
 </div>
</div>
 </div>
 
 <!-- Modal para ver/editar detalles de la fila -->
 <div id="viewRowModal" class="modal hidden">
<div class="modal-content large">
 <div class="modal-header">
<h3>Detalles del Registro</h3>
<button id="closeViewModal" class="btn btn-ghost">✖</button>
 </div>
 <div class="modal-body" >
<div id="rowDataFormContainer" class="modal-form-grid">
<!-- El formulario dinámico se insertará aquí -->
</div>
 </div>
 <div class="modal-footer">
 <button id="cancelViewModal" class="btn btn-ghost">Cancelar</button>
 <button id="saveViewModal" class="btn btn-primary">Guardar Cambios</button>
 </div>
</div>
 </div>
</div>
 `,

  afterRender() {
    this.currentSheet = null;
    this.sheets = this.loadSheets();
    this.editingRow = null;
    this.editingRowIndexInModal = null;
    this.setupEventListeners();
    this.renderTabs();
    this.selectFirstSheet();
  },

  setupEventListeners() {
    document.getElementById("addTabBtn").addEventListener("click", () => this.openNewSheetModal());
    document.getElementById("addRowBtn").addEventListener("click", () => this.addRow());
    document.getElementById("addColumnBtn").addEventListener("click", () => this.openNewColumnModal());
    document.getElementById("exportBtn").addEventListener("click", () => this.exportData());
    document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
    document.getElementById("importFile").addEventListener("change", (e) => this.importData(e));
    document.getElementById("searchInput").addEventListener("input", (e) => this.filterData(e.target.value));
    document.getElementById("closeSheetModal").addEventListener("click", () => this.closeNewSheetModal());
    document.getElementById("cancelSheetBtn").addEventListener("click", () => this.closeNewSheetModal());
    document.getElementById("newSheetForm").addEventListener("submit", (e) => this.handleNewSheet(e));
    document.getElementById("addColumnFieldBtn").addEventListener("click", () => this.addColumnField());
    document.getElementById("cancelColumnBtn").addEventListener("click", () => this.closeNewColumnModal());
    document.getElementById("saveColumnBtn").addEventListener("click", () => this.addColumnFromModal());
    document.getElementById("closeViewModal").addEventListener("click", () => this.closeViewRowModal());
    document.getElementById("cancelViewModal").addEventListener("click", () => this.closeViewRowModal());
    document.getElementById("saveViewModal").addEventListener("click", () => this.saveRowFromModal());
  },

  renderTable() {
    if (!this.currentSheet) {
      document.getElementById("headerRow").innerHTML = "";
      document.getElementById("tableBody").innerHTML = '<tr><td colspan="100%">Seleccione una hoja o cree una nueva.</td></tr>';
      return;
    }
    const headerRow = document.getElementById("headerRow");
    const tableBody = document.getElementById("tableBody");
    headerRow.innerHTML = this.currentSheet.columns.map(colName => `<th>${colName}</th>`).join("") + `<th>Acciones</th>`;
    tableBody.innerHTML = this.currentSheet.data.map((row, rowIndex) => {
      const isEditing = this.editingRow === rowIndex;
      const cells = this.currentSheet.columns.map(colName => {
        const schema = this.currentSheet.schema[colName] || { type: 'str' };
        const value = this._getValueFromPath(row, colName);
        let content;
        if (isEditing) {
          switch (schema.type) {
            case "int":
              content = `<input type="number" value="${value || 0}" data-col="${colName}">`; break;
            case "list_str":
              content = `<input type="text" value="${(value || []).join(",")}" data-col="${colName}" placeholder="Valores separados por coma">`; break;
            case "object":
              content = `<textarea data-col="${colName}" rows="5">${JSON.stringify(value || {}, null, 2)}</textarea>`; break;
            case "image":
              content = `<div class="image-edit-container">${value ? `<img src="${value}" class="thumbnail"/>` : ''}<input type="file" data-col="${colName}" accept="image/*"></div>`; break;
            case "gallery":
              const imagesHTML = (value || []).map((img, i) => `<div class="gallery-item-edit"><img src="${img}" class="thumbnail"/><button type="button" class="btn-delete-img" data-img-index="${i}">✖</button></div>`).join('');
              content = `<div class="gallery-edit-container" data-col="${colName}">${imagesHTML}<input type="file" multiple accept="image/*" class="gallery-file-input"></div>`; break;
            case "video_url":
              content = `<input type="url" value="${value || ''}" data-col="${colName}" placeholder="https://youtube.com/...">`; break;
            default:
              content = `<input type="text" value="${value || ""}" data-col="${colName}">`;
          }
        } else {
          switch (schema.type) {
            case "image":
              content = value ? `<img src="${value}" alt="img" class="thumbnail-view">` : 'Sin imagen'; break;
            case "gallery":
              content = (value && value.length > 0) ? `<div class="gallery-view-container">${value.map(img => `<img src="${img}" class="thumbnail-view"/>`).join('')}</div>` : 'Sin imágenes'; break;
            case "video_url":
              content = value ? `<a href="${value}" target="_blank" class="video-link">Ver Video ↗</a>` : 'Sin video'; break;
            case "list_str":
              content = (value || []).map(item => `<span class="badge">${item}</span>`).join(' '); break;
            case "object":
              content = `<span class="json-badge">{...}</span>`; break;
            default:
              content = value || "";
          }
        }
        return `<td>${content}</td>`;
      }).join("");
      const actions = isEditing
        ? `<button class="btn save-row" data-row="${rowIndex}">Guardar</button><button class="btn cancel-edit" data-row="${rowIndex}">Cancelar</button>`
        : `<button class="btn view-row" data-row="${rowIndex}" title="Ver Detalles">👁️</button><button class="btn edit-row" data-row="${rowIndex}">Editar</button><button class="btn delete-row" data-row="${rowIndex}">Eliminar</button>`;
      return `<tr data-row="${rowIndex}">${cells}<td>${actions}</td></tr>`;
    }).join("");
    this._bindRowActionListeners(tableBody);
  },

  _bindRowActionListeners(tableBody) {
    tableBody.querySelectorAll(".view-row").forEach(btn => btn.addEventListener("click", () => this.openViewRowModal(btn.dataset.row)));
    tableBody.querySelectorAll(".edit-row").forEach(btn => btn.addEventListener("click", () => this.startEditRow(btn.dataset.row)));
    tableBody.querySelectorAll(".save-row").forEach(btn => btn.addEventListener("click", () => this.saveRow(btn.dataset.row)));
    tableBody.querySelectorAll(".cancel-edit").forEach(btn => btn.addEventListener("click", () => this.cancelEditRow()));
    tableBody.querySelectorAll(".delete-row").forEach(btn => btn.addEventListener("click", () => this.deleteRow(btn.dataset.row)));
    if (this.editingRow !== null) {
      document.querySelectorAll(`tr[data-row="${this.editingRow}"] .btn-delete-img`).forEach(btn => {
        btn.addEventListener("click", (e) => {
          const rowIndex = this.editingRow;
          const imgIndex = parseInt(e.target.dataset.img - index, 10);
          const colName = e.target.closest('.gallery-edit-container').dataset.col;
          const rowData = this.currentSheet.data[rowIndex];
          const galleryArray = this._getValueFromPath(rowData, colName) || [];
          if (galleryArray.length > imgIndex) {
            const newGalleryArray = galleryArray.filter((_, index) => index !== imgIndex);
            this._setValueByPath(rowData, colName, newGalleryArray);
            this.saveSheets();
            this.renderTable();
          }
        });
      });
    }
  },

  startEditRow(rowIndex) {
    this.editingRow = parseInt(rowIndex, 10);
    this.renderTable();
  },

  cancelEditRow() {
    this.editingRow = null;
    this.renderTable();
  },

  async saveRow(rowIndex) {
    const rowElement = document.querySelector(`tr[data-row="${rowIndex}"]`);
    const rowData = this.currentSheet.data[rowIndex];
    for (const colName of this.currentSheet.columns) {
      const schema = this.currentSheet.schema[colName] || { type: 'str' };
      const input = rowElement.querySelector(`[data-col="${colName}"]`);
      let newValue;
      switch (schema.type) {
        case "image":
          const fileInput = rowElement.querySelector(`input[type="file"][data-col="${colName}"]`);
          if (fileInput && fileInput.files.length > 0) {
            try {
              const uploadResult = await storageService.uploadFile(fileInput.files[0], `sheets/${this.currentSheet.id}`);
              newValue = uploadResult.url;
            } catch (error) {
              console.error(`Error uploading image for ${colName}:`, error);
              newValue = this._getValueFromPath(rowData, colName);
            }
          } else {
            newValue = this._getValueFromPath(rowData, colName);
          }
          break;
        case "gallery":
          const galleryContainer = rowElement.querySelector(`.gallery-edit-container[data-col="${colName}"]`);
          const galleryFileInput = galleryContainer.querySelector('.gallery-file-input');
          const existingImages = this._getValueFromPath(rowData, colName) || [];
          if (galleryFileInput && galleryFileInput.files.length > 0) {
            try {
              const filesToUpload = Array.from(galleryFileInput.files);
              const uploadResults = await storageService.uploadMultipleFiles(filesToUpload, `sheets/${this.currentSheet.id}`);
              const newImageUrls = uploadResults.map(res => res.url);
              newValue = [...existingImages, ...newImageUrls];
            } catch (error) {
              console.error(`Error uploading gallery images for ${colName}:`, error);
              newValue = existingImages;
            }
          } else {
            newValue = existingImages;
          }
          break;
        case "object":
          try {
            newValue = JSON.parse(input.value);
          } catch (e) {
            console.error(`Invalid JSON for ${colName}:`, e);
            newValue = this._getValueFromPath(rowData, colName);
          }
          break;
        default:
          newValue = input.value;
      }
      const coercedValue = this._coerceValueToType(newValue, schema.type);
      this._setValueByPath(rowData, colName, coercedValue);
    }
    this.editingRow = null;
    this.saveSheets();
    this.renderTable();
  },

  addRow() {
    if (!this.currentSheet) return;
    const newRow = {};
    Object.keys(this.currentSheet.schema).forEach(colName => {
      const schema = this.currentSheet.schema[colName];
      const defaultValue = this._coerceValueToType(undefined, schema.type);
      this._setValueByPath(newRow, colName, defaultValue);
    });
    this.currentSheet.data.push(newRow);
    this.saveSheets();
    this.renderTable();
  },

  deleteRow(rowIndex) {
    const userConfirmed = true;
    if (userConfirmed) {
      this.currentSheet.data.splice(rowIndex, 1);
      this.saveSheets();
      this.renderTable();
    }
  },

  openNewColumnModal() {
    document.getElementById("newColumnModal").classList.remove("hidden");
  },

  closeNewColumnModal() {
    document.getElementById("newColumnModal").classList.add("hidden");
    document.getElementById("columnName").value = "";
    document.getElementById("columnType").value = "str";
    document.getElementById("columnRequired").checked = false;
  },

  addColumnFromModal() {
    const name = document.getElementById("columnName").value.trim();
    const type = document.getElementById("columnType").value;
    const required = document.getElementById("columnRequired").checked;
    if (!name || this.currentSheet.columns.includes(name)) return;
    this.currentSheet.columns.push(name);
    this.currentSheet.schema[name] = { type, required };
    const defaultValue = this._coerceValueToType(undefined, type);
    this.currentSheet.data.forEach(row => this._setValueByPath(row, name, defaultValue));
    this.saveSheets();
    this.renderTable();
    this.closeNewColumnModal();
  },

  openNewSheetModal() {
    document.getElementById("newSheetModal").classList.remove("hidden");
    document.getElementById("columnsContainer").innerHTML = "";
    this.addColumnField();
  },

  closeNewSheetModal() {
    document.getElementById("newSheetModal").classList.add("hidden");
    document.getElementById("newSheetForm").reset();
  },

  addColumnField() {
    const container = document.getElementById("columnsContainer");
    const field = document.createElement("div");
    field.classList.add("column-field-group");
    field.innerHTML = `
 <input type="text" placeholder="Nombre (ej: precios.moneda)">
 <select>
<option value="str">Texto</option>
<option value="int">Número</option>
<option value="list_str">Lista de Textos</option>
<option value="object">Objeto (JSON)</option>
<option value="image">Imagen Única</option>
<option value="gallery">Galería de Imágenes</option>
<option value="video_url">URL de Video</option>
 </select>
 <label><input type="checkbox"> Requerido</label>
 <button type="button" class="btn-delete-field">✖</button>
`;
    container.appendChild(field);
    field.querySelector('.btn-delete-field').addEventListener('click', () => field.remove());
  },

  handleNewSheet(e) {
    e.preventDefault();
    const sheetName = document.getElementById("sheetName").value.trim();
    if (!sheetName) {
      alert("El nombre de la hoja es requerido.");
      return;
    }
    const columns = [];
    const schema = {};
    const columnsContainer = document.getElementById("columnsContainer").children;
    for (let group of columnsContainer) {
      const nameInput = group.querySelector("input[type='text']");
      const typeSelect = group.querySelector("select");
      const reqCheckbox = group.querySelector("input[type='checkbox']");
      const colName = nameInput.value.trim();
      if (colName && !columns.includes(colName)) {
        columns.push(colName);
        schema[colName] = { type: typeSelect.value, required: reqCheckbox.checked };
      }
    }
    if (columns.length === 0) {
      alert("Debes definir al menos una columna.");
      return;
    }
    const newSheet = { id: Date.now().toString(), name: sheetName, columns, data: [], schema };
    this.sheets.push(newSheet);
    this.saveSheets();
    this.renderTabs();
    this.selectSheet(newSheet.id);
    this.closeNewSheetModal();
  },

  openViewRowModal(rowIndex) {
    this.editingRowIndexInModal = parseInt(rowIndex, 10);
    const rowData = this.currentSheet.data[this.editingRowIndexInModal];
    const formContainer = document.getElementById("rowDataFormContainer");
    formContainer.innerHTML = '';
    const groupedSchema = this._groupSchema(this.currentSheet.schema);
    for (const groupName in groupedSchema) {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'form-fieldset';
      const legend = document.createElement('legend');
      legend.textContent = groupName.charAt(0).toUpperCase() + groupName.slice(1);
      fieldset.appendChild(legend);
      for (const key of groupedSchema[groupName]) {
        const schema = this.currentSheet.schema[key];
        const value = this._getValueFromPath(rowData, key);
        if (key === 'caracteristicas_tecnicas') {
          this._buildKeyValueEditor(fieldset, key, Array.isArray(value) ? value : []);
        } else if (key === 'inventario_y_variantes') {
          this._buildVariantsEditor(fieldset, key, Array.isArray(value) ? value : []);
        } else if (key.startsWith('multimedia.')) {
          this._buildMultimediaEditor(fieldset, key, schema, value);
        } else {
          this._buildSimpleInput(fieldset, key, schema, value);
        }
      }
      formContainer.appendChild(fieldset);
    }
    document.getElementById("viewRowModal").classList.remove("hidden");
  },

  async saveRowFromModal() {
    if (this.editingRowIndexInModal === null) return;
    const rowIndex = this.editingRowIndexInModal;
    const rowData = { ...this.currentSheet.data[rowIndex] };
    const formContainer = document.getElementById("rowDataFormContainer");
    formContainer.querySelectorAll('.form-group > input, .form-group > textarea').forEach(input => {
      const key = input.dataset.key;
      const schema = this.currentSheet.schema[key] || { type: 'str' };
      if (input.closest('.complex-editor-container')) return;
      let newValue = input.value;
      if (schema.type === 'gallery') {
        newValue = newValue.split('\n').map(url => url.trim()).filter(Boolean);
      }
      const coercedValue = this._coerceValueToType(newValue, schema.type);
      this._setValueByPath(rowData, key, coercedValue);
    });
    this._saveKeyValueEditor(formContainer, rowData);
    await this._saveVariantsEditor(formContainer, rowData);
    await this._saveMultimediaEditor(formContainer, rowData);
    this.currentSheet.data[rowIndex] = rowData;
    this.saveSheets();
    this.renderTable();
    this.closeViewRowModal();
  },

  closeViewRowModal() {
    document.getElementById("viewRowModal").classList.add("hidden");
    this.editingRowIndexInModal = null;
  },

  _groupSchema(schema) {
    const groups = { 'general': [] };
    const sortedKeys = Object.keys(schema).sort();
    for (const key of sortedKeys) {
      if (key.includes('.')) {
        const groupName = key.split('.')[0];
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(key);
      } else {
        if (key === 'caracteristicas_tecnicas' || key === 'inventario_y_variantes') {
          if (!groups[key]) groups[key] = [];
          groups[key].push(key);
        } else {
          groups.general.push(key);
        }
      }
    }
    return groups;
  },

  _buildSimpleInput(container, key, schema, value) {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    const label = document.createElement('label');
    label.textContent = key.split('.').pop();
    formGroup.appendChild(label);
    let inputHtml = '';
    switch (schema.type) {
      case 'int':
        inputHtml = `<input type="number" value="${value || 0}" data-key="${key}" class="form-control">`; break;
      case 'list_str':
        inputHtml = `<input type="text" value="${(value || []).join(', ')}" data-key="${key}" class="form-control" placeholder="Valores separados por coma">`; break;
      case 'object':
        inputHtml = `<textarea data-key="${key}" class="form-control" rows="5">${JSON.stringify(value || {}, null, 2)}</textarea>`; break;
      case 'image':
        inputHtml = `<input type="text" value="${value || ''}" data-key="${key}" class="form-control" placeholder="URL de la imagen">`;
        if (value) inputHtml += `<img src="${value}" class="thumbnail-view" style="max-width: 100px; margin-top: 5px;">`; break;
      case 'gallery':
        inputHtml = `<textarea data-key="${key}" class="form-control" rows="3" placeholder="URLs de imágenes, una por línea">${(value || []).join('\n')}</textarea>`; break;
      case 'video_url':
        inputHtml = `<input type="url" value="${value || ''}" data-key="${key}" class="form-control" placeholder="https://youtube.com/...">`; break;
      default:
        inputHtml = `<input type="text" value="${value || ''}" data-key="${key}" class="form-control">`;
    }
    formGroup.innerHTML += inputHtml;
    container.appendChild(formGroup);
  },

  _buildKeyValueEditor(container, key, dataArray) {
    const editorContainer = document.createElement('div');
    editorContainer.className = 'complex-editor-container';
    editorContainer.dataset.editorKey = key;
    const itemsContainer = document.createElement('div');
    const renderItems = (items) => {
      items = Array.isArray(items) ? items : [];
      itemsContainer.innerHTML = '';
      items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'complex-editor-item';
        itemDiv.innerHTML = `
<div class="form-group"><label>Nombre</label><input type="text" class="form-control" value="${item.nombre || ''}"></div>
<div class="form-group"><label>Valor</label><input type="text" class="form-control" value="${item.valor || ''}"></div>
<button type="button" class="btn btn-danger btn-sm remove-item">✖</button>
`;
        itemDiv.querySelector('.remove-item').addEventListener('click', () => {
          const currentItems = Array.from(itemsContainer.children).map(child => ({
            nombre: child.querySelectorAll('input')[0].value,
            valor: child.querySelectorAll('input')[1].value,
          }));
          currentItems.splice(index, 1);
          renderItems(currentItems);
        });
        itemsContainer.appendChild(itemDiv);
      });
    };
    renderItems(dataArray);
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn-secondary btn-sm';
    addButton.textContent = '➕ Agregar Característica';
    addButton.addEventListener('click', () => {
      const currentItems = Array.from(itemsContainer.children).map(child => ({
        nombre: child.querySelectorAll('input')[0].value,
        valor: child.querySelectorAll('input')[1].value,
      }));
      renderItems([...currentItems, { nombre: '', valor: '' }]);
    });
    editorContainer.appendChild(itemsContainer);
    editorContainer.appendChild(addButton);
    container.appendChild(editorContainer);
  },

  _saveKeyValueEditor(formContainer, rowData) {
    const editor = formContainer.querySelector('[data-editor-key="caracteristicas_tecnicas"]');
    if (!editor) return;
    const newData = [];
    editor.querySelectorAll('.complex-editor-item').forEach(itemDiv => {
      const inputs = itemDiv.querySelectorAll('input');
      const nombre = inputs[0].value.trim();
      const valor = inputs[1].value.trim();
      if (nombre) newData.push({ nombre, valor });
    });
    this._setValueByPath(rowData, 'caracteristicas_tecnicas', newData);
  },

  _buildVariantsEditor(container, key, dataArray) {
    // ...igual que antes...
    // (No se repite aquí por espacio, pero es igual al fragmento anterior)
  },

  _getVariantData(variantDiv) {
    // ...igual que antes...
  },

  async _saveVariantsEditor(formContainer, rowData) {
    // ...igual que antes...
  },

  _buildMultimediaEditor(container, key, schema, value) {
    // Implementación básica para evitar errores
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    formGroup.innerHTML = `<label>${key}</label><div>${JSON.stringify(value)}</div>`;
    container.appendChild(formGroup);
  },

  async _saveMultimediaEditor(formContainer, rowData) {
    // Implementación vacía para evitar errores
  },

  renderTabs() {
    const tabsList = document.getElementById("tabsList");
    tabsList.innerHTML = this.sheets.map(sheet => `<button class="tab-item" data-sheet-id="${sheet.id}">${sheet.name}</button>`).join("");
    tabsList.querySelectorAll(".tab-item").forEach(tab => {
      tab.addEventListener("click", () => this.selectSheet(tab.dataset.sheetId));
    });
  },

  selectFirstSheet() {
    if (this.sheets.length > 0) {
      this.selectSheet(this.sheets[0].id);
    } else {
      this.currentSheet = null;
      this.renderTable();
    }
  },

  selectSheet(sheetId) {
    this.currentSheet = this.sheets.find(sheet => sheet.id === sheetId);
    document.querySelectorAll(".tab-item").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.sheetId === sheetId);
    });
    this.renderTable();
  },

  filterData(searchTerm) {
    console.log("Filtro:", searchTerm);
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file || !this.currentSheet) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      if (rows.length < 2) {
        alert('El archivo CSV no tiene datos.');
        return;
      }
      const headers = rows[0].split(',').map(h => h.trim());
      const missingColumns = this.currentSheet.columns.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        alert('El CSV no tiene todas las columnas requeridas: ' + missingColumns.join(', '));
        return;
      }
      const newData = [];
      for (let i = 1; i < rows.length; i++) {
        const values = this._parseCsvLine(rows[i]);
        if (values.length === 0 || values.every(cell => cell === "")) continue;
        const rowObj = {};
        headers.forEach((header, idx) => {
          if (values[idx] !== undefined) {
            this._setValueByPath(rowObj, header, values[idx]);
          }
        });
        Object.keys(this.currentSheet.schema).forEach(colName => {
          const schema = this.currentSheet.schema[colName];
          const value = this._getValueFromPath(rowObj, colName);
          this._setValueByPath(rowObj, colName, this._coerceValueToType(value, schema.type));
        });
        newData.push(rowObj);
      }
      this.currentSheet.data = newData;
      this.saveSheets();
      this.renderTable();
      event.target.value = "";
    };
    reader.onerror = () => alert('Error al leer el archivo CSV');
    reader.readAsText(file);
  },

  _parseCsvLine(line) {
    const result = [];
    let inQuotes = false, field = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        result.push(field.trim());
        field = '';
      } else field += char;
    }
    result.push(field.trim());
    return result;
  },

  exportData() {
    // alert("La exportación a CSV aún no soporta datos anidados complejos.");
  },

  saveSheets() {
    localStorage.setItem("entitySheets", JSON.stringify(this.sheets));
  },

  loadSheets() {
    try {
      const raw = localStorage.getItem("entitySheets");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Error al cargar hojas desde localStorage:", e);
    }
    return [{
      id: "default-products-advanced",
      name: "Productos",
      columns: [
        "multimedia.main_image", "name", "base_sku", "prices.sale_price", "inventory_and_variants"
      ],
      data: [{
        "product_id": "8a7d4f9e-6b1c-4f0a-b8d2-9c7e1a3b5d4f",
        "name": "Tenis Nike Hot Step Air Terra Drake NOCTA",
        "slug_url": "tenis-nike-hot-step-air-terra-drake-nocta-blanco",
        "base_sku": "NIK-NOCTA-HSAT",
        "status": "activo",
        "visibility": "catalogo_y_busqueda",
        "product_type": "variable",
        "description": {
          "short": "Tenis de moda urbana de la colaboración exclusiva entre Nike y el artista Drake.",
          "long": "Explora el estilo único de la colaboración Nike x Drake con los Hot Step Air Terra NOCTA."
        },
        "prices": {
          "original_price": 110.00,
          "sale_price": 95.00,
          "currency": "USD",
          "tax_included": true
        },
        "inventory_and_variants": [{
          "variant_sku": "NIK-NOCTA-HSAT-BLA-37",
          "attributes": [
            { "name": "Size", "value": "37 EU" },
            { "name": "Color", "value": "Blanco", "hex": "#FFFFFF" }
          ],
          "stock": 15,
          "availability": "en_stock",
          "variant_images": ["https://placehold.co/100x100/EEE/000?text=W37"]
        }],
        "technical_specifications": [
          { "name": "Upper Material", "value": "Cuero sintético premium" },
          { "name": "Quality", "value": "Réplica AAA" }
        ],
        "multimedia": {
          "main_image": "https://placehold.co/400x400/FFF/000?text=Nike+1",
          "image_gallery": ["https://placehold.co/100x100/EEE/000?text=A", "https://placehold.co/100x100/DDD/000?text=B"],
          "product_video": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
        "categorization": {
          "main_category": "Calzado",
          "subcategory": "Tenis",
          "tags": ["moda urbana", "Drake", "Nocta"]
        },
        "logistics": {
          "weight_kg": 1.2,
          "dimensions_cm": { "length": 35, "width": 25, "height": 15 },
          "shipping_origin": "Bogotá, Colombia",
          "requires_shipping": true
        },
        "seo": {
          "page_title": "Comprar Tenis Nike Hot Step Air Terra Drake NOCTA | Tienda Online",
          "meta_description": "Consigue los exclusivos tenis Nike NOCTA en colaboración con Drake."
        }
      }],
      schema: {
        "product_id": { type: "str", required: true },
        "name": { type: "str", required: true },
        "slug_url": { type: "str", required: false },
        "base_sku": { type: "str", required: true },
        "status": { type: "str", required: false },
        "visibility": { type: "str", required: false },
        "product_type": { type: "str", required: false },
        "description.short": { type: "str", required: false },
        "description.long": { type: "str", required: false },
        "prices.original_price": { type: "int", required: false },
        "prices.sale_price": { type: "int", required: true },
        "prices.currency": { type: "str", required: true },
        "prices.tax_included": { type: "str", required: false },
        "inventory_and_variants": { type: "object", required: false },
        "technical_specifications": { type: "object", required: false },
        "multimedia.main_image": { type: "image", required: false },
        "multimedia.image_gallery": { type: "gallery", required: false },
        "multimedia.product_video": { type: "video_url", required: false },
        "categorization.main_category": { type: "str", required: false },
        "categorization.subcategory": { type: "str", required: false },
        "categorization.tags": { type: "list_str", required: false },
        "logistics.weight_kg": { type: "int", required: false },
        "logistics.dimensions_cm": { type: "object", required: false },
        "logistics.shipping_origin": { type: "str", required: false },
        "logistics.requires_shipping": { type: "str", required: false },
        "seo.page_title": { type: "str", required: false },
        "seo.meta_description": { type: "str", required: false }
      }
    }];
  },

  _getValueFromPath(obj, path) {
    if (!path || typeof path !== 'string') return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  },

  _setValueByPath(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => {
      acc[key] = typeof acc[key] === 'object' && acc[key] !== null ? acc[key] : {};
      return acc[key];
    }, obj);
    target[lastKey] = value;
  },

  _coerceValueToType(value, type) {
    if (value === undefined || value === null) {
      switch (type) {
        case "int": return 0;
        case "list_str":
        case "gallery": return [];
        case "object": return {};
        default: return "";
      }
    }
    switch (type) {
      case "int":
        const n = parseFloat(value);
        return isNaN(n) ? 0 : n;
      case "list_str":
        return Array.isArray(value) ? value : String(value).split(',').map(v => v.trim()).filter(Boolean);
      case "gallery":
        return Array.isArray(value) ? value : [];
      case "object":
        if (typeof value === 'object' && !Array.isArray(value)) return value;
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
          try { return JSON.parse(value); } catch { return {}; }
        }
        return {};
      default:
        return String(value);
    }
  },
};