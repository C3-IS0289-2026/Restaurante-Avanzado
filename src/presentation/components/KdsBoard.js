import { BaseComponent } from './BaseComponent.js';

export class KdsBoard extends BaseComponent {
  constructor() {
    super('div', 'kds-board');
  }

  template() {
    return `
      <div class="kds-column" id="col-recibidos">
        <h2>Recibidos</h2>
        <div class="kds-column-content"></div>
      </div>
      <div class="kds-column" id="col-preparacion">
        <h2>En Preparación</h2>
        <div class="kds-column-content"></div>
      </div>
      <div class="kds-column" id="col-listos">
        <h2>Listos</h2>
        <div class="kds-column-content"></div>
      </div>
    `;
  }
}
