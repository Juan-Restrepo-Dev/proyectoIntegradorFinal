import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getApp } from 'firebase/app';
import { FirebaseService } from './firebaseService.js';

// Obtener la instancia de Firebase ya inicializada
let app;
let storage;

try {
  app = getApp();
  console.log('Firebase app obtenida con getApp()');
} catch (error) {
  // Si no hay app inicializada, usar la del FirebaseService
  console.log('Usando Firebase app del FirebaseService');
  app = FirebaseService.app;
}

if (!app) {
  console.error('No se pudo obtener la instancia de Firebase');
  // En lugar de lanzar error, crear un mock
  console.warn('Creando mock de Firebase Storage');
  storage = null;
} else {
  storage = getStorage(app);
}

export class StorageService {
  constructor() {
    this.storage = storage;
    this.isMock = !storage;
  }

  /**
   * Subir un archivo a Firebase Storage
   * @param {File} file - Archivo a subir
   * @param {string} path - Ruta donde guardar el archivo
   * @param {Function} onProgress - Callback para el progreso
   * @returns {Promise<string>} URL del archivo subido
   */
  async uploadFile(file, path = 'media', onProgress = null) {
    try {
      if (this.isMock) {
        // Mock implementation
        console.warn('Usando mock de Firebase Storage');
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        return {
          url: URL.createObjectURL(file),
          path: `${path}/${fileName}`,
          name: fileName,
          size: file.size,
          type: file.type
        };
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(this.storage, `${path}/${fileName}`);
      
      // Subir archivo
      const snapshot = await uploadBytes(storageRef, file);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        name: fileName,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error al subir el archivo');
    }
  }

  /**
   * Subir múltiples archivos
   * @param {File[]} files - Array de archivos
   * @param {string} path - Ruta donde guardar los archivos
   * @param {Function} onProgress - Callback para el progreso
   * @returns {Promise<Array>} Array con las URLs de los archivos subidos
   */
  async uploadMultipleFiles(files, path = 'media', onProgress = null) {
    const uploadPromises = files.map((file, index) => {
      return this.uploadFile(file, path, (progress) => {
        if (onProgress) {
          onProgress((index + progress) / files.length * 100);
        }
      });
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Eliminar un archivo de Firebase Storage
   * @param {string} filePath - Ruta del archivo a eliminar
   * @returns {Promise<void>}
   */
  async deleteFile(filePath) {
    try {
      const fileRef = ref(this.storage, filePath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Error al eliminar el archivo');
    }
  }

  /**
   * Obtener la URL de descarga de un archivo
   * @param {string} filePath - Ruta del archivo
   * @returns {Promise<string>} URL de descarga
   */
  async getDownloadURL(filePath) {
    try {
      const fileRef = ref(this.storage, filePath);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error('Error al obtener la URL del archivo');
    }
  }

  /**
   * Listar archivos en una carpeta
   * @param {string} folderPath - Ruta de la carpeta
   * @returns {Promise<Array>} Array con información de los archivos
   */
  async listFiles(folderPath = 'media') {
    try {
      if (this.isMock) {
        // Mock implementation - return empty array
        console.warn('Usando mock de Firebase Storage - listFiles');
        return [];
      }

      const folderRef = ref(this.storage, folderPath);
      const result = await listAll(folderRef);
      
      const files = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            name: item.name,
            path: item.fullPath,
            url: url
          };
        })
      );

      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Error al listar los archivos');
    }
  }

  /**
   * Validar tipo de archivo
   * @param {File} file - Archivo a validar
   * @param {Array} allowedTypes - Tipos permitidos
   * @returns {boolean} True si el archivo es válido
   */
  validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']) {
    return allowedTypes.includes(file.type);
  }

  /**
   * Validar tamaño de archivo
   * @param {File} file - Archivo a validar
   * @param {number} maxSize - Tamaño máximo en bytes (por defecto 10MB)
   * @returns {boolean} True si el archivo es válido
   */
  validateFileSize(file, maxSize = 10 * 1024 * 1024) {
    return file.size <= maxSize;
  }

  /**
   * Generar nombre único para archivo
   * @param {string} originalName - Nombre original del archivo
   * @returns {string} Nombre único
   */
  generateUniqueFileName(originalName) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  }
}

// Instancia singleton
export const storageService = new StorageService();
