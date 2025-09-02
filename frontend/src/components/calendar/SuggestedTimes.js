import { BaseComponent } from '../ui/BaseComponent.js';

export class SuggestedTimes extends BaseComponent {
  constructor(container, options = {}) {
    super(container, options);
    this.onTimeSelect = options.onTimeSelect || (() => {});
    this.suggestedTimes = this.generateSuggestedTimes();
  }

  render() {
    this.container.innerHTML = `
      <div class="suggested-times">
        <div class="suggested-times-header">
          <div class="timezone-info">
            <span class="timezone-label">Zona horaria:</span>
            <span class="timezone-value">(GMT-5) Colombia</span>
          </div>
        </div>
        
        <div class="best-times-section">
          <h4>Mejores horarios para publicar</h4>
          <div class="best-times-grid">
            ${this.renderBestTimes()}
          </div>
        </div>
        
        <div class="engagement-heatmap">
          <h4>Prioridad de Interacción</h4>
          <div class="heatmap-container">
            ${this.renderHeatmap()}
          </div>
          <div class="heatmap-legend">
            <span class="legend-item">
              <span class="legend-color low"></span>
              <span>Baja</span>
            </span>
            <span class="legend-item">
              <span class="legend-color medium"></span>
              <span>Media</span>
            </span>
            <span class="legend-item">
              <span class="legend-color high"></span>
              <span>Alta</span>
            </span>
          </div>
        </div>
        
        <div class="quick-schedule">
          <h4>Programar Rápidamente</h4>
          <div class="quick-times">
            ${this.renderQuickTimes()}
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    this.addEventListeners();
  }

  addEventListeners() {
    const timeSlots = this.getAllElements('.time-slot');
    console.log("sugestes agregados");
    
    const quickTimes = this.getAllElements('.quick-time');

    timeSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        const time = slot.dataset.time;
        const day = slot.dataset.day;
        this.onTimeSelect({ time, day });
      });
    });

    quickTimes.forEach(quick => {
      quick.addEventListener('click', () => {
        const time = quick.dataset.time;
        this.onTimeSelect({ time, day: 'today' });
      });
    });
  }

  renderBestTimes() {
    return this.suggestedTimes.bestTimes.map((timeSlot, index) => `
      <div class="time-slot ${timeSlot.recommended ? 'recommended' : ''}" 
           data-time="${timeSlot.time}" 
           data-day="${timeSlot.day}">
        <div class="time-slot-header">
          <span class="day-name">${timeSlot.dayName}</span>
          ${timeSlot.recommended ? '<span class="star">★</span>' : ''}
        </div>
        <div class="time-range">${timeSlot.time}</div>
        <div class="engagement-score">
          <span class="score">${timeSlot.engagement}</span>
          <span class="unit">impresiones</span>
        </div>
      </div>
    `).join('');
  }

  renderHeatmap() {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const hours = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
    
    let heatmapHTML = '<div class="heatmap-grid">';
    
    // Header con horas
    heatmapHTML += '<div class="heatmap-header">';
    heatmapHTML += '<div class="heatmap-cell header"></div>';
    hours.forEach(hour => {
      heatmapHTML += `<div class="heatmap-cell header">${hour}</div>`;
    });
    heatmapHTML += '</div>';
    
    // Filas con días y datos
    days.forEach(day => {
      heatmapHTML += '<div class="heatmap-row">';
      heatmapHTML += `<div class="heatmap-cell day">${day}</div>`;
      
      hours.forEach(hour => {
        const engagement = this.getEngagementLevel(day, hour);
        heatmapHTML += `<div class="heatmap-cell ${engagement}" data-day="${day}" data-hour="${hour}"></div>`;
      });
      
      heatmapHTML += '</div>';
    });
    
    heatmapHTML += '</div>';
    return heatmapHTML;
  }

  renderQuickTimes() {
    const quickTimes = [
      { time: '9:00 AM', label: 'Mañana' },
      { time: '12:00 PM', label: 'Mediodía' },
      { time: '3:00 PM', label: 'Tarde' },
      { time: '6:00 PM', label: 'Noche' }
    ];

    return quickTimes.map(quick => `
      <button class="quick-time" data-time="${quick.time}">
        <span class="quick-time-label">${quick.label}</span>
        <span class="quick-time-value">${quick.time}</span>
      </button>
    `).join('');
  }

  getEngagementLevel(day, hour) {
    // Simular datos de engagement basados en patrones típicos
    const engagementData = {
      'Lun': { '6AM': 'low', '9AM': 'high', '12PM': 'high', '3PM': 'medium', '6PM': 'medium', '9PM': 'low' },
      'Mar': { '6AM': 'low', '9AM': 'high', '12PM': 'high', '3PM': 'high', '6PM': 'medium', '9PM': 'low' },
      'Mié': { '6AM': 'low', '9AM': 'high', '12PM': 'high', '3PM': 'high', '6PM': 'medium', '9PM': 'low' },
      'Jue': { '6AM': 'low', '9AM': 'medium', '12PM': 'high', '3PM': 'high', '6PM': 'medium', '9PM': 'low' },
      'Vie': { '6AM': 'low', '9AM': 'high', '12PM': 'high', '3PM': 'high', '6PM': 'high', '9PM': 'medium' },
      'Sáb': { '6AM': 'low', '9AM': 'medium', '12PM': 'medium', '3PM': 'medium', '6PM': 'high', '9PM': 'high' },
      'Dom': { '6AM': 'low', '9AM': 'low', '12PM': 'medium', '3PM': 'medium', '6PM': 'high', '9PM': 'high' }
    };

    return engagementData[day]?.[hour] || 'low';
  }

  generateSuggestedTimes() {
    return {
      bestTimes: [
        {
          day: 'monday',
          dayName: 'Lunes',
          time: '9:00 AM - 11:00 AM',
          engagement: '2,450',
          recommended: false
        },
        {
          day: 'tuesday',
          dayName: 'Martes',
          time: '11:00 AM - 1:00 PM',
          engagement: '2,800',
          recommended: true
        },
        {
          day: 'wednesday',
          dayName: 'Miércoles',
          time: '9:00 AM - 11:00 AM',
          engagement: '2,600',
          recommended: false
        },
        {
          day: 'thursday',
          dayName: 'Jueves',
          time: '12:00 PM - 2:00 PM',
          engagement: '2,300',
          recommended: false
        },
        {
          day: 'friday',
          dayName: 'Viernes',
          time: '5:00 PM - 7:00 PM',
          engagement: '2,900',
          recommended: true
        },
        {
          day: 'saturday',
          dayName: 'Sábado',
          time: '6:00 PM - 8:00 PM',
          engagement: '2,100',
          recommended: false
        }
      ]
    };
  }

  updateData() {
    // Actualizar datos basados en el rendimiento real
    this.suggestedTimes = this.generateSuggestedTimes();
    this.render();
  }

  getTimeSlotEngagement(day, time) {
    // Simular cálculo de engagement basado en datos históricos
    const baseEngagement = {
      'monday': 2400,
      'tuesday': 2800,
      'wednesday': 2600,
      'thursday': 2300,
      'friday': 2900,
      'saturday': 2100,
      'sunday': 1800
    };

    const timeMultiplier = {
      '9:00 AM - 11:00 AM': 1.0,
      '11:00 AM - 1:00 PM': 1.1,
      '12:00 PM - 2:00 PM': 1.05,
      '3:00 PM - 5:00 PM': 0.9,
      '5:00 PM - 7:00 PM': 1.15,
      '6:00 PM - 8:00 PM': 1.0
    };

    const base = baseEngagement[day] || 2000;
    const multiplier = timeMultiplier[time] || 1.0;
    
    return Math.round(base * multiplier);
  }
}
