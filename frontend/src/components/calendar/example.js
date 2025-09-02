/**
 * Ejemplo de uso de los componentes del calendario
 * Este archivo muestra cómo inicializar y usar los diferentes componentes
 */

import { Calendar } from './Calendar.js';
import { PublicationModal } from './PublicationModal.js';
import { SuggestedTimes } from './SuggestedTimes.js';
import { MediaGallery } from './MediaGallery.js';
import { Modal } from '../ui/Modal.js';

// Ejemplo 1: Inicializar el calendario completo
function initializeCalendar() {
  const calendarContainer = document.getElementById('calendarContainer');
  
  if (calendarContainer) {
    const calendar = new Calendar(calendarContainer, {
      onPublicationSave: (publication) => {
        console.log('Publicación guardada:', publication);
        showNotification('Publicación programada exitosamente', 'success');
      },
      onPublicationDelete: (id) => {
        console.log('Publicación eliminada:', id);
        showNotification('Publicación eliminada', 'info');
      }
    });
    
    return calendar;
  }
}

// Ejemplo 2: Usar el modal de publicaciones independientemente
function showPublicationModal() {
  const modal = new PublicationModal(document.body, {
    mode: 'manual',
    selectedDate: '2025-01-15',
    selectedTime: '14:30',
    onSave: (publication) => {
      console.log('Publicación creada:', publication);
      showNotification('Publicación creada exitosamente', 'success');
    },
    onDelete: (id) => {
      console.log('Publicación eliminada:', id);
      showNotification('Publicación eliminada', 'info');
    }
  });
  
  modal.open();
}

// Ejemplo 3: Usar horarios sugeridos independientemente
function initializeSuggestedTimes() {
  const container = document.getElementById('suggestedTimesContainer');
  
  if (container) {
    const suggestedTimes = new SuggestedTimes(container, {
      onTimeSelect: (timeData) => {
        console.log('Horario seleccionado:', timeData);
        // Aquí puedes abrir el modal de publicación con el horario seleccionado
        showPublicationModalWithTime(timeData);
      }
    });
    
    return suggestedTimes;
  }
}

// Ejemplo 4: Usar galería de medios independientemente
function initializeMediaGallery() {
  const container = document.getElementById('mediaGalleryContainer');
  
  if (container) {
    const mediaGallery = new MediaGallery(container, {
      onMediaSelect: (media) => {
        console.log('Media seleccionado:', media);
        // Aquí puedes usar el media seleccionado en una publicación
      }
    });
    
    return mediaGallery;
  }
}

// Ejemplo 5: Modal personalizado
function showCustomModal() {
  const modal = new Modal(document.body, {
    title: 'Confirmar Acción',
    content: `
      <div class="custom-modal-content">
        <p>¿Estás seguro de que quieres realizar esta acción?</p>
        <div class="warning-message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Esta acción no se puede deshacer</span>
        </div>
      </div>
    `,
    confirmText: 'Confirmar',
    onConfirm: () => {
      console.log('Acción confirmada');
      showNotification('Acción completada', 'success');
    }
  });
  
  modal.open();
}

// Ejemplo 6: Crear publicación con IA
function showAIModal() {
  const modal = new PublicationModal(document.body, {
    mode: 'ai',
    selectedDate: '2025-01-15',
    selectedTime: '14:30',
    onSave: (publication) => {
      console.log('Publicación con IA creada:', publication);
      showNotification('Contenido generado y programado', 'success');
    }
  });
  
  modal.open();
}

// Ejemplo 7: Editar publicación existente
function editPublication(publicationData) {
  const modal = new PublicationModal(document.body, {
    mode: 'edit',
    publication: publicationData,
    onSave: (updatedPublication) => {
      console.log('Publicación actualizada:', updatedPublication);
      showNotification('Publicación actualizada', 'success');
    },
    onDelete: (id) => {
      console.log('Publicación eliminada:', id);
      showNotification('Publicación eliminada', 'info');
    }
  });
  
  modal.open();
}

// Ejemplo 8: Mostrar publicación con horario predefinido
function showPublicationModalWithTime(timeData) {
  const modal = new PublicationModal(document.body, {
    mode: 'manual',
    selectedDate: timeData.day === 'today' ? new Date().toISOString().split('T')[0] : null,
    selectedTime: timeData.time,
    onSave: (publication) => {
      console.log('Publicación programada:', publication);
      showNotification('Publicación programada exitosamente', 'success');
    }
  });
  
  modal.open();
}

// Función utilitaria para mostrar notificaciones
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Ejemplo 9: Configuración avanzada del calendario
function initializeAdvancedCalendar() {
  const calendarContainer = document.getElementById('calendarContainer');
  
  if (calendarContainer) {
    const calendar = new Calendar(calendarContainer, {
      onPublicationSave: (publication) => {
        // Aquí puedes integrar con tu backend
        savePublicationToBackend(publication);
      },
      onPublicationDelete: (id) => {
        // Aquí puedes eliminar del backend
        deletePublicationFromBackend(id);
      },
      onTimeSelect: (timeData) => {
        // Personalizar comportamiento al seleccionar horario
        console.log('Horario seleccionado:', timeData);
      },
      onMediaSelect: (media) => {
        // Personalizar comportamiento al seleccionar media
        console.log('Media seleccionado:', media);
      }
    });
    
    return calendar;
  }
}

// Ejemplo 10: Integración con backend
async function savePublicationToBackend(publication) {
  try {
    const response = await fetch('/api/publications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publication)
    });
    
    if (response.ok) {
      showNotification('Publicación guardada en el servidor', 'success');
    } else {
      throw new Error('Error al guardar');
    }
  } catch (error) {
    console.error('Error saving publication:', error);
    showNotification('Error al guardar la publicación', 'error');
  }
}

async function deletePublicationFromBackend(id) {
  try {
    const response = await fetch(`/api/publications/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      showNotification('Publicación eliminada del servidor', 'success');
    } else {
      throw new Error('Error al eliminar');
    }
  } catch (error) {
    console.error('Error deleting publication:', error);
    showNotification('Error al eliminar la publicación', 'error');
  }
}

// Exportar funciones para uso global
window.CalendarExamples = {
  initializeCalendar,
  showPublicationModal,
  initializeSuggestedTimes,
  initializeMediaGallery,
  showCustomModal,
  showAIModal,
  editPublication,
  showPublicationModalWithTime,
  initializeAdvancedCalendar
};

// Ejemplo de uso en HTML:
/*
<button onclick="CalendarExamples.showPublicationModal()">
  Nueva Publicación
</button>

<button onclick="CalendarExamples.showAIModal()">
  Generar con IA
</button>

<button onclick="CalendarExamples.showCustomModal()">
  Modal Personalizado
</button>
*/
