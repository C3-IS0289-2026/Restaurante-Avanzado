export class TableItem {
  constructor({ id, capacity, status }) {
    this.id = id;
    this.capacity = capacity;
    this.status = status; // Ej: 'libre', 'ocupada'
    this.element = document.createElement('div');
  }

  render() {
    this.element.className = `table-item status-${this.status}`;
    this.element.innerHTML = `
      <span class="table-id">Mesa ${this.id}</span>
      <span class="table-capacity">Capacidad: ${this.capacity}</span>
    `;
    return this.element;
  }
}
