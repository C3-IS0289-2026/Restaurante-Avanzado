import { BaseComponent } from '../components/BaseComponent.js';

export class TableMapPage extends BaseComponent {
  constructor() {
    super('div', 'table-map-page');
  }

  template() {
    return `
      <h1>Mapa de Mesas</h1>
      <div class="tables-grid" id="tablesGrid">
        <!-- Renderizar mesas aquí -->
      </div>
    `;
  }
}
