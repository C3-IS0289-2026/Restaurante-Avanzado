import { BaseComponent } from './BaseComponent.js';

export class TableItem extends BaseComponent {
  constructor({ id, capacity, status } = {}) {
    super('div', `table-item status-${status}`);
    this.id = id;
    this.capacity = capacity;
    this.status = status; // Ej: 'libre', 'ocupada'
  }

  template() {
    this.className = `table-item status-${this.status}`;
    return `
      <span class="table-id">Mesa ${this.id}</span>
      <span class="table-capacity">Capacidad: ${this.capacity}</span>
    `;
  }
}
