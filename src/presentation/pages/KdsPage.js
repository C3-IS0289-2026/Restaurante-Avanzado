import { BaseComponent } from '../components/BaseComponent.js';

export class KdsPage extends BaseComponent {
  constructor() {
    super('div', 'kds-page');
  }

  template() {
    return `
      <header>
        <h1>Pantalla de Cocina (KDS)</h1>
      </header>
      <div id="kdsBoardContainer">
        <!-- KdsBoard renderizará aquí -->
      </div>
    `;
  }
}
