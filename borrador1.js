// import { AuthService } from "../../services/auth/authService.js";
// import { storageService } from "../../services/firebase/storageService.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
// import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs, runTransaction } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// export default {
//   template: `
//     <style>
//       :root {
//         --primary-color: #4A90E2;
//         --secondary-color: #50E3C2;
//         --background-color: #F4F7F9;
//         --card-background: #FFFFFF;
//         --text-color: #333333;
//         --placeholder-color: #B0B0B0;
//         --border-color: #E0E0E0;
//         --shadow-color: rgba(0, 0, 0, 0.05);
//       }

//       body {
//         font-family: 'Inter', sans-serif;
//         background-color: var(--background-color);
//         color: var(--text-color);
//         margin: 0;
//         padding: 20px;
//       }

//       .entities-layout {
//         display: flex;
//         flex-direction: column;
//         height: 100vh;
//         width: 100vw;
//         box-sizing: border-box;
//       }

//       .entities-content {
//         display: flex;
//         flex-direction: column;
//         padding: 20px;
//         background-color: var(--card-background);
//         border-radius: 12px;
//         box-shadow: 0 4px 12px var(--shadow-color);
//         flex-grow: 1;
//         overflow: hidden;
//       }

//       /* Estilos para las pestañas de las entidades */
//       .entity-tabs {
//         margin-bottom: 20px;
//       }

//       .tabs-header {
//         display: flex;
//         align-items: center;
//         gap: 10px;
//       }

//       .tabs-list {
//         display: flex;
//         flex-wrap: wrap;
//         gap: 8px;
//         flex-grow: 1;
//       }

//       .tab {
//         padding: 10px 15px;
//         background-color: #EFEFEF;
//         border: 1px solid var(--border-color);
//         border-radius: 8px;
//         cursor: pointer;
//         transition: all 0.2s ease;
//       }

//       .tab:hover {
//         background-color: #E0E0E0;
//       }

//       .tab.active {
//         background-color: var(--primary-color);
//         color: white;
//         border-color: var(--primary-color);
//       }

//       /* Estilos para la tabla Excel */
//       .excel-table-container {
//         flex-grow: 1;
//         overflow: auto;
//         border: 1px solid var(--border-color);
//         border-radius: 8px;
//       }

//       .excel-table {
//         width: 100%;
//         border-collapse: collapse;
//       }

//       .excel-table th, .excel-table td {
//         padding: 12px;
//         border: 1px solid var(--border-color);
//         white-space: nowrap;
//         overflow: hidden;
//         text-overflow: ellipsis;
//       }

//       .excel-table th {
//         background-color: #F8F8F8;
//         font-weight: 600;
//         text-align: left;
//         position: sticky;
//         top: 0;
//       }

//       .excel-table tbody tr:hover {
//         background-color: #F5F5F5;
//       }

//       .excel-table td.cell-input {
//         padding: 0;
//       }

//       .excel-table td input[type="text"] {
//         width: 100%;
//         height: 100%;
//         border: none;
//         padding: 12px;
//         box-sizing: border-box;
//         font-family: inherit;
//         background: transparent;
//       }

//       /* Estilos de botones */
//       .btn {
//         padding: 10px 15px;
//         border-radius: 8px;
//         font-weight: 600;
//         cursor: pointer;
//         transition: all 0.2s ease;
//         border: none;
//       }

//       .btn-primary {
//         background-color: var(--primary-color);
//         color: white;
//       }

//       .btn-primary:hover {
//         background-color: #3A7ACC;
//       }

//       .btn-secondary {
//         background-color: #EFEFEF;
//         color: var(--text-color);
//         border: 1px solid var(--border-color);
//       }

//       .btn-secondary:hover {
//         background-color: #E0E0E0;
//       }

//       .btn-ghost {
//         background: transparent;
//         color: var(--primary-color);
//         border: 1px solid transparent;
//       }

//       .btn-ghost:hover {
//         background-color: #F0F5FA;
//       }

//       .btn-danger {
//         background-color: #E35050;
//         color: white;
//       }

//       .btn-danger:hover {
//         background-color: #C24242;
//       }

//       /* Estilos de la barra de herramientas */
//       .entity-toolbar {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 20px;
//         flex-wrap: wrap;
//         gap: 10px;
//       }

//       .toolbar-left, .toolbar-right {
//         display: flex;
//         gap: 10px;
//         flex-wrap: wrap;
//       }

//       .search-input {
//         padding: 10px 15px;
//         border: 1px solid var(--border-color);
//         border-radius: 8px;
//         font-family: inherit;
//       }

//       .search-input::placeholder {
//         color: var(--placeholder-color);
//       }

//       /* Estilos del modal */
//       .modal {
//         display: none;
//         position: fixed;
//         z-index: 1000;
//         left: 0;
//         top: 0;
//         width: 100%;
//         height: 100%;
//         background-color: rgba(0, 0, 0, 0.5);
//         justify-content: center;
//         align-items: center;
//       }

//       .modal-content {
//         background-color: var(--card-background);
//         padding: 30px;
//         border-radius: 12px;
//         box-shadow: 0 8px 20px var(--shadow-color);
//         width: 90%;
//         max-width: 800px;
//       }

//       .modal-header {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 20px;
//       }

//       .modal-title {
//         font-size: 1.5rem;
//         font-weight: 700;
//       }

//       .close-btn {
//         font-size: 1.5rem;
//         font-weight: 700;
//         cursor: pointer;
//         color: var(--placeholder-color);
//       }

//       .close-btn:hover {
//         color: var(--text-color);
//       }

//       /* Grid dinámico para el formulario del modal */
//       .modal-form-grid {
//         display: grid;
//         grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//         gap: 20px;
//         height: 70vh;
//         padding: 10px;
//         overflow-y: auto;
//       }

//       .form-field {
//         display: flex;
//         flex-direction: column;
//         gap: 8px;
//       }

//       .form-field label {
//         font-weight: 600;
//       }

//       .form-field input, .form-field textarea {
//         padding: 10px;
//         border: 1px solid var(--border-color);
//         border-radius: 8px;
//         font-family: inherit;
//       }

//       .form-actions {
//         display: flex;
//         justify-content: flex-end;
//         gap: 10px;
//         margin-top: 20px;
//       }
//     </style>

//     <div class="entities-layout">
//       <div class="entities-content">
//         <!-- Entity Tabs -->
//         <div class="entity-tabs">
//           <div class="tabs-header">
//             <div class="tabs-list" id="tabsList"></div>
//             <button id="addTabBtn" class="btn btn-primary">➕ Nueva Hoja</button>
//           </div>
//         </div>

//         <!-- Entity Content -->
//         <div class="entity-content">
//           <div class="entity-toolbar">
//             <div class="toolbar-left">
//               <button id="addRowBtn" class="btn btn-secondary">➕ Agregar Fila</button>
//               <button id="addColumnBtn" class="btn btn-secondary">➕ Agregar Columna</button>
//             </div>
//             <div class="toolbar-right">
//               <input type="text" id="searchInput" placeholder="Buscar..." class="search-input">
//               <button id="exportBtn" class="btn btn-ghost">⬇ Exportar</button>
//               <button id="importBtn" class="btn btn-ghost">⬆ Importar</button>
//               <input type="file" id="importFile" accept=".csv" style="display:none">
//             </div>
//           </div>

//           <!-- Excel-like Table -->
//           <div class="excel-table-container">
//             <table class="excel-table" id="excelTable">
//               <thead>
//                 <tr id="headerRow"></tr>
//               </thead>
//               <tbody id="tableBody"></tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       <!-- Modal para nueva hoja -->
//       <div id="newSheetModal" class="modal">
//         <div class="modal-content">
//           <div class="modal-header">
//             <h2 class="modal-title">Configurar Nueva Hoja</h2>
//             <span class="close-btn" onclick="this.closest('.modal').style.display='none';">&times;</span>
//           </div>
//           <div class="modal-body">
//             <div class="form-field">
//               <label for="sheetNameInput">Nombre de la Hoja:</label>
//               <input type="text" id="sheetNameInput">
//             </div>
//             <div class="form-field">
//               <label for="isPublicCheckbox">Pública (compartida con otros usuarios):</label>
//               <input type="checkbox" id="isPublicCheckbox">
//             </div>
//           </div>
//           <div class="form-actions">
//             <button id="createSheetBtn" class="btn btn-primary">Crear</button>
//           </div>
//         </div>
//       </div>
//       <!-- Modal de Edición de Entidad -->
//       <div id="entityModal" class="modal">
//         <div class="modal-content">
//           <div class="modal-header">
//             <h2 class="modal-title" id="entityModalTitle">Editar Entidad</h2>
//             <span class="close-btn" onclick="this.closest('.modal').style.display='none';">&times;</span>
//           </div>
//           <div class="modal-form-grid" id="entityFormGrid">
//             <!-- Los campos del formulario se generarán dinámicamente aquí -->
//           </div>
//           <div class="form-actions">
//             <button id="saveEntityBtn" class="btn btn-primary">Guardar</button>
//             <button id="deleteEntityBtn" class="btn btn-danger" style="display:none;">Eliminar</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   data() {
//     return {
//       db: null,
//       auth: null,
//       appId: null,
//       currentSheet: null,
//       data: [],
//       headers: [],
//       isPublic: false,
//       subscription: null,
//       searchQuery: '',
//       userId: null,
//     };
//   },
//   async mounted() {
//     // Inicialización de Firebase
//     const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
//     if (Object.keys(firebaseConfig).length) {
//       const app = initializeApp(firebaseConfig);
//       this.db = getFirestore(app);
//       this.auth = getAuth(app);
//       this.appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

//       // Autenticación anónima o con token de Canvas
//       if (typeof __initial_auth_token !== 'undefined') {
//         await signInWithCustomToken(this.auth, __initial_auth_token);
//       } else {
//         await signInAnonymously(this.auth);
//       }

//       onAuthStateChanged(this.auth, (user) => {
//         if (user) {
//           this.userId = user.uid;
//           this.setupEventListeners();
//           this.loadInitialData();
//         } else {
//           console.error("No se pudo autenticar al usuario.");
//         }
//       });
//     } else {
//       console.error("Configuración de Firebase no encontrada.");
//     }
//   },
//   methods: {
//     // Lógica para manejar la subida de archivos CSV
//     async _handleCsvImport(file) {
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const text = e.target.result;
//           const rows = text.split('\\n').filter(row => row.trim() !== ''); // Limpiar filas vacías
//           if (rows.length === 0) {
//             return reject('El archivo CSV está vacío.');
//           }
//           const headers = rows[0].split(',').map(header => header.trim());
//           const data = [];

//           for (let i = 1; i < rows.length; i++) {
//             const values = this._parseCsvLine(rows[i]);
//             const rowObject = {};
//             headers.forEach((header, index) => {
//               if (values[index] !== undefined) {
//                 // Maneja la notación de punto para objetos anidados y asigna el valor
//                 this._setValueByPath(rowObject, header, values[index]);
//               }
//             });
//             data.push(rowObject);
//           }
//           resolve({ headers, data });
//         };
//         reader.onerror = (error) => reject(error);
//         reader.readAsText(file);
//       });
//     },

//     // Parsea una línea de CSV, manejando comas dentro de comillas
//     _parseCsvLine(line) {
//       const result = [];
//       let inQuote = false;
//       let currentField = '';
//       for (let i = 0; i < line.length; i++) {
//         const char = line[i];
//         if (char === '"') {
//           inQuote = !inQuote;
//         } else if (char === ',' && !inQuote) {
//           result.push(this._inferAndCoerceType(currentField.trim()));
//           currentField = '';
//         } else {
//           currentField += char;
//         }
//       }
//       result.push(this._inferAndCoerceType(currentField.trim()));
//       return result;
//     },

//     // Infiere y convierte el tipo de dato de un valor
//     _inferAndCoerceType(value) {
//       if (value === 'true') return true;
//       if (value === 'false') return false;
//       if (!isNaN(value) && value.trim() !== '') return Number(value);
//       // Intenta parsear como JSON para objetos o listas
//       if ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}'))) {
//         try {
//           return JSON.parse(value);
//         } catch (e) {
//           // Si falla, se queda como string
//         }
//       }
//       return value;
//     },

//     // --- Métodos auxiliares para manejar objetos anidados ---
//     _getValueFromPath(obj, path) {
//       if (!path || typeof path !== 'string') return undefined;
//       return path.split('.').reduce((acc, part) => acc && acc[part], obj);
//     },

//     _setValueByPath(obj, path, value) {
//       const keys = path.split('.');
//       const lastKey = keys.pop();
//       const target = keys.reduce((acc, key) => {
//         acc[key] = typeof acc[key] === 'object' && acc[key] !== null ? acc[key] : {};
//         return acc[key];
//       }, obj);
//       target[lastKey] = value;
//     },

//     // Lógica para el manejo de eventos de la UI
//     setupEventListeners() {
//       const addTabBtn = document.getElementById('addTabBtn');
//       const newSheetModal = document.getElementById('newSheetModal');
//       const sheetNameInput = document.getElementById('sheetNameInput');
//       const isPublicCheckbox = document.getElementById('isPublicCheckbox');
//       const createSheetBtn = document.getElementById('createSheetBtn');
//       const importBtn = document.getElementById('importBtn');
//       const importFile = document.getElementById('importFile');
//       const self = this;

//       addTabBtn.addEventListener('click', () => {
//         newSheetModal.style.display = 'flex';
//       });

//       createSheetBtn.addEventListener('click', async () => {
//         const sheetName = sheetNameInput.value.trim();
//         const isPublic = isPublicCheckbox.checked;

//         if (sheetName) {
//           self.createSheet(sheetName, isPublic);
//           newSheetModal.style.display = 'none';
//           sheetNameInput.value = '';
//           isPublicCheckbox.checked = false;
//         }
//       });

//       // Lógica de importación
//       importBtn.addEventListener('click', () => {
//         importFile.click();
//       });

//       importFile.addEventListener('change', async (event) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         try {
//           const { headers, data } = await this._handleCsvImport(file);
//           this.data = data;
//           this.headers = headers;
//           this.renderTable();
//           console.log('Datos importados:', this.data);
//           // Opcional: guardar datos importados en Firestore
//         } catch (error) {
//           console.error('Error al importar el archivo CSV:', error);
//           alert('Error al importar el archivo: ' + error);
//         }
//       });
//     },

//     // Lógica para renderizar la tabla y el modal de edición
//     renderTable() {
//       const tableBody = document.getElementById('tableBody');
//       const headerRow = document.getElementById('headerRow');
//       tableBody.innerHTML = '';
//       headerRow.innerHTML = '';

//       // Renderizar encabezados
//       this.headers.forEach(header => {
//         const th = document.createElement('th');
//         th.textContent = header;
//         headerRow.appendChild(th);
//       });

//       // Renderizar filas
//       this.data.forEach((row, rowIndex) => {
//         const tr = document.createElement('tr');
//         tr.addEventListener('click', () => this.openEntityModal(row, rowIndex));
//         this.headers.forEach(header => {
//           const td = document.createElement('td');
//           // Utiliza la función auxiliar para obtener el valor del objeto anidado
//           const value = this._getValueFromPath(row, header);
//           td.textContent = typeof value === 'object' ? JSON.stringify(value) : value; // Muestra el valor
//           tr.appendChild(td);
//         });
//         tableBody.appendChild(tr);
//       });
//     },

//     openEntityModal(entity, rowIndex) {
//       const modal = document.getElementById('entityModal');
//       const formGrid = document.getElementById('entityFormGrid');
//       formGrid.innerHTML = '';
      
//       this.headers.forEach(header => {
//         const fieldContainer = document.createElement('div');
//         fieldContainer.className = 'form-field';
        
//         const label = document.createElement('label');
//         label.textContent = header;
//         label.htmlFor = `field-${header}`;

//         const input = document.createElement('input');
//         input.type = 'text';
//         input.id = `field-${header}`;
//         // Obtener el valor de la entidad actual, manejando objetos anidados
//         const value = this._getValueFromPath(entity, header);
//         input.value = typeof value === 'object' ? JSON.stringify(value) : value; // Mostrar el valor del objeto como string

//         fieldContainer.appendChild(label);
//         fieldContainer.appendChild(input);
//         formGrid.appendChild(fieldContainer);
//       });

//       document.getElementById('saveEntityBtn').onclick = () => {
//         const newEntity = {};
//         this.headers.forEach(header => {
//           const input = document.getElementById(`field-${header}`);
//           // Utilizar la función auxiliar para asignar valores a los objetos anidados, infiriendo el tipo nuevamente
//           this._setValueByPath(newEntity, header, this._inferAndCoerceType(input.value));
//         });
//         this.saveEntity(newEntity, rowIndex);
//       };

//       modal.style.display = 'flex';
//     },

//     async saveEntity(newEntity, rowIndex) {
//       this.data[rowIndex] = newEntity;
//       this.renderTable();
//       document.getElementById('entityModal').style.display = 'none';
//       // Lógica para guardar en Firestore
//     },

//     // Métodos para Firestore
//     async createSheet(sheetName, isPublic) {
//       const collectionPath = isPublic ?
//         `artifacts/${this.appId}/public/data/${sheetName}` :
//         `artifacts/${this.appId}/users/${this.userId}/${sheetName}`;
      
//       const docRef = doc(this.db, collectionPath, 'placeholder');
//       await setDoc(docRef, { __placeholder: true });
      
//       this.currentSheet = sheetName;
//       this.isPublic = isPublic;
//       this.loadData();
//       this.renderTabs();
//     },

//     async loadInitialData() {
//       // Cargar la primera hoja disponible
//       const sheetsCol = collection(this.db, `artifacts/${this.appId}/users/${this.userId}`);
//       const sheetsSnapshot = await getDocs(sheetsCol);
//       if (!sheetsSnapshot.empty) {
//         const sheetName = sheetsSnapshot.docs[0].id;
//         this.currentSheet = sheetName;
//         this.isPublic = false;
//         this.loadData();
//       } else {
//         // Cargar hojas públicas si no hay privadas
//         const publicSheetsCol = collection(this.db, `artifacts/${this.appId}/public/data`);
//         const publicSheetsSnapshot = await getDocs(publicSheetsCol);
//         if (!publicSheetsSnapshot.empty) {
//           const sheetName = publicSheetsSnapshot.docs[0].id;
//           this.currentSheet = sheetName;
//           this.isPublic = true;
//           this.loadData();
//         }
//       }
//       this.renderTabs();
//     },

//     async loadData() {
//       if (this.subscription) {
//         this.subscription(); // Desuscribirse de la hoja anterior
//       }

//       const collectionPath = this.isPublic ?
//         `artifacts/${this.appId}/public/data/${this.currentSheet}` :
//         `artifacts/${this.appId}/users/${this.userId}/${this.currentSheet}`;

//       const colRef = collection(this.db, collectionPath);
//       this.subscription = onSnapshot(colRef, (snapshot) => {
//         this.data = snapshot.docs.filter(doc => !doc.data().__placeholder).map(doc => ({ ...doc.data(), id: doc.id }));
//         if (this.data.length > 0) {
//           this.headers = this.extractHeaders(this.data);
//         } else {
//           this.headers = [];
//         }
//         this.renderTable();
//       });
//     },

//     extractHeaders(data) {
//       const headersSet = new Set();
//       data.forEach(item => {
//         const flatObject = this.flattenObject(item);
//         Object.keys(flatObject).forEach(key => headersSet.add(key));
//       });
//       return Array.from(headersSet);
//     },

//     flattenObject(obj, parent = '', res = {}) {
//       for (const key in obj) {
//         if (Object.prototype.hasOwnProperty.call(obj, key)) {
//           const propName = parent ? `${parent}.${key}` : key;
//           if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
//             this.flattenObject(obj[key], propName, res);
//           } else {
//             res[propName] = obj[key];
//           }
//         }
//       }
//       return res;
//     },

//     renderTabs() {
//       const tabsList = document.getElementById('tabsList');
//       tabsList.innerHTML = '';
      
//       const privateTabs = ["Productos", "Pedidos", "Clientes"]; // Ejemplo de pestañas
//       privateTabs.forEach(name => {
//         const tab = document.createElement('div');
//         tab.className = 'tab';
//         tab.textContent = name;
//         if (this.currentSheet === name) {
//           tab.classList.add('active');
//         }
//         tab.addEventListener('click', () => {
//           this.currentSheet = name;
//           this.isPublic = false;
//           this.loadData();
//         });
//         tabsList.appendChild(tab);
//       });

//       // Puedes añadir lógica para cargar hojas públicas aquí si lo deseas
//     }
//   }
// };
