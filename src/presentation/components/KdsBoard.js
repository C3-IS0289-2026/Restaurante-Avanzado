import { BaseComponent } from './BaseComponent.js';
import { KdsTicket } from './KdsTicket.js';

/**
 * Tablero del KDS con tres columnas por estado (HU-005.1)
 * Recibe las comandas ya separadas por el backend.
 */
export class KdsBoard extends BaseComponent {
  constructor({ recibidos = [], preparacion = [], listos = [] } = {}) {
    super('div', 'kds-board');
    this.columnas = [
      { id: 'col-recibidos', titulo: 'Recibidos', clase: 'kds-column--recibidos', comandas: recibidos },
      { id: 'col-preparacion', titulo: 'En Preparación', clase: 'kds-column--preparacion', comandas: preparacion },
      { id: 'col-listos', titulo: 'Listos', clase: 'kds-column--listos', comandas: listos }
    ];
  }

  template() {
    return this.columnas.map(col => `
      <div class="kds-column ${col.clase}" id="${col.id}">
        <h2>${col.titulo} <span class="kds-contador">${col.comandas.length}</span></h2>
        <div class="kds-column-content">
          ${col.comandas.length
            ? col.comandas.map(comanda => new KdsTicket(comanda).template()).join('')
            : '<p class="kds-vacio">Sin pedidos</p>'}
        </div>
      </div>
    `).join('');
  }
}

export default KdsBoard;
