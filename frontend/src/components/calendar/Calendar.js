// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { BaseComponent } from '../ui/BaseComponent.js';
import { PublicationModal } from './PublicationModal.js';
import { SuggestedTimes } from './SuggestedTimes.js';
import { MediaGallery } from './MediaGallery.js';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Calendar as FullCalendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export class Calendar extends BaseComponent {
  constructor(container, options = {}) {
    super(container, options);
    this.publications = [];
    this.selectedDate = null;
    this.selectedTime = null;
    this.modal = null;
    this.suggestedTimes = null;
    this.mediaGallery = null;
    this.calendar = null;

    this.init();
  }

  init() {
    this.loadPublications();
    this.render();
    this.setupComponents();
    this.addEventListeners();
    this.loadFullCalendar();
    this.setupCalendar();
  }

  render() {
    this.container.innerHTML = `
      <div class="calendar-container">
        <div class="calendar-header">
          <div class="calendar-title">
            <h2>Calendario de Publicaciones</h2>
            <p>Programa y gestiona tus publicaciones en redes sociales</p>
          </div>
          
          <div class="calendar-actions">
            <button id="newPostBtn" class="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nueva Publicación
            </button>
          </div>
        </div>

        <div class="calendar-layout">
          <div class="calendar-main">
            <div id="calendar"></div>
          </div>
          
          <div class="calendar-sidebar">
            <div class="sidebar-section">
              <h3>Horarios Sugeridos</h3>
              <div id="suggestedTimes"></div>
            </div>
            
            <div class="sidebar-section">
              <h3>Galería de Medios</h3>
              <div id="mediaGallery"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  loadFullCalendar() {
    this.plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, bootstrap5Plugin];
  }

  setupCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    this.calendar = new FullCalendar(calendarEl, {
      plugins: this.plugins,
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      locale: 'es',
      height: 'auto',
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      droppable: true,
      editable: true,
      businessHours: {
        dow: [1, 2, 3, 4, 5],
        start: '09:00',
        end: '18:00'
      },

      events: this.publications.map(pub => ({
        id: pub.id,
        title: pub.title,
        start: `${pub.date}T${pub.time}`,
        end: `${pub.date}T${pub.time}`,
        backgroundColor: this.getPlatformColor(pub.platform),
        borderColor: this.getPlatformColor(pub.platform),
        textColor: '#434343ff',
        extendedProps: {
          platform: pub.platform,
          content: pub.content,
          status: pub.status
        }
      })),
      select: (arg) => this.handleDateSelect(arg),
      eventClick: (arg) => this.handleEventClick(arg),
      eventDrop: (arg) => this.handleEventDrop(arg),
      eventResize: (arg) => this.handleEventResize(arg)
    });

    this.calendar.render();
  }

  setupComponents() {
    // Componente de horarios sugeridos
    const suggestedTimesContainer = document.getElementById('suggestedTimes');
    if (suggestedTimesContainer) {
      this.suggestedTimes = new SuggestedTimes(suggestedTimesContainer, {
        onTimeSelect: (time) => {
          this.selectedTime = time;
          this.openPublicationModal();
        }
      });
      this.suggestedTimes.render();
      this.suggestedTimes.afterRender();
    }

    // Componente de galería de medios
    const mediaGalleryContainer = document.getElementById('mediaGallery');
    if (mediaGalleryContainer) {
      this.mediaGallery = new MediaGallery(mediaGalleryContainer, {
        onMediaSelect: (media) => { this.selectedMedia = media; }
      });
      this.mediaGallery.render();
      this.mediaGallery.afterRender();
    }
  }

  addEventListeners() {
    const newPostBtn = this.getElement('#newPostBtn');
    if (newPostBtn) newPostBtn.addEventListener('click', () => this.openPublicationModal());
  }

  handleDateSelect(selectInfo) {
    this.selectedDate = selectInfo.startStr;
    this.openPublicationModal();
  }

  handleEventClick(clickInfo) {
    const event = clickInfo.event;
    const publication = this.publications.find(pub => pub.id === parseInt(event.id));
    if (publication) this.openPublicationModal(publication);
  }

  handleEventDrop(dropInfo) {
    const event = dropInfo.event;
    const publication = this.publications.find(pub => pub.id === parseInt(event.id));
    if (publication) {
      publication.date = event.startStr.split('T')[0];
      publication.time = event.startStr.split('T')[1];
      this.savePublications();
      this.updateCalendarEvents();
    }
  }

  handleEventResize(resizeInfo) {
    const event = resizeInfo.event;
    const publication = this.publications.find(pub => pub.id === parseInt(event.id));
    if (publication) {
      publication.date = event.startStr.split('T')[0];
      publication.time = event.startStr.split('T')[1];
      this.savePublications();
      this.updateCalendarEvents();
    }
  }

  openPublicationModal(publication = null) {
    const parent = document.getElementById('contentArea') || document.body;
    this.modal = new PublicationModal(parent, {
      mode: publication ? 'edit' : 'manual',
      publication,
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      onSave: (pub) => { this.savePublication(pub); },
      onDelete: (id) => this.deletePublication(id)
    });
    this.modal.open();
  }

  savePublication(publication) {
    if (publication.id) {
      const index = this.publications.findIndex(pub => pub.id === publication.id);
      if (index !== -1) this.publications[index] = publication;
    } else {
      publication.id = Date.now();
      publication.createdAt = new Date().toISOString();
      this.publications.push(publication);
    }
    this.savePublications();
    this.updateCalendarEvents();
    if (this.suggestedTimes) this.suggestedTimes.updateData();
  }

  deletePublication(id) {
    this.publications = this.publications.filter(pub => pub.id !== id);
    this.savePublications();
    this.updateCalendarEvents();
  }

  updateCalendarEvents() {
    if (this.calendar) {
      this.calendar.removeAllEvents();
      this.calendar.addEventSource(this.publications.map(pub => ({
        id: pub.id,
        title: pub.title,
        start: `${pub.date}T${pub.time}`,
        end: `${pub.date}T${pub.time}`,
        backgroundColor: this.getPlatformColor(pub.platform),
        borderColor: this.getPlatformColor(pub.platform),
        textColor: '#00fffbff',
        extendedProps: {
          platform: pub.platform,
          content: pub.content,
          status: pub.status
        }
      })));
    }
  }

  getPlatformColor(platform) {
    const colors = {
      instagram: '#E4405F',
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      linkedin: '#0A66C2',
      tiktok: '#000000'
    };
    return colors[platform] || '#6B7280';
  }

  loadPublications() {
    const saved = localStorage.getItem('calendar_publications');
    this.publications = saved ? JSON.parse(saved) : [];
  }

  savePublications() {
    localStorage.setItem('calendar_publications', JSON.stringify(this.publications));
  }

  destroy() {
    if (this.calendar) this.calendar.destroy();
    if (this.modal) this.modal.destroy();
    if (this.suggestedTimes) this.suggestedTimes.destroy();
    if (this.mediaGallery) this.mediaGallery.destroy();
    super.destroy();
  }
}
