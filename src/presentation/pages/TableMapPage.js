export class TableMapPage {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'table-map-page';
  }

  render() {
    this.container.innerHTML = `
      <h1>Mapa de Mesas</h1>
      <div class="tables-grid" id="tablesGrid">
        <!-- Renderizar mesas aquí -->
      </div>
    `;
    return this.container;
  }
}
