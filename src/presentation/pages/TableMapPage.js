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
         <div class="contenedor">
    <figure>
      <div class="cuadro"></div>
      <figcaption></figcaption>
    </figure>
    <div class="mapa">

      <div class="mesas">1</div>
      <div class="mesas">2</div>
      <div class="mesas">3</div>
      <div class="mesas">4</div>
      <div class="mesas">5</div>
      <div class="mesas">6</div>
      <div class="mesas">7</div>
      <div class="mesas">8</div>
      <div class="mesasVacia">9</div>
      <div class="mesasOcupada">10</div>
      <div class="mesas">11</div>
      <div class="mesas">12</div>
      <div class="mesas">13</div>
      <div class="mesas">14</div>
      <div class="mesas">15</div>

    </div>
  </div>
      </div>
    `;
  }
}
