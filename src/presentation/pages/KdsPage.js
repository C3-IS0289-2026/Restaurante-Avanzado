export class KdsPage {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'kds-page';
  }

  render() {
    this.container.innerHTML = `
      <header>
        <h1>Pantalla de Cocina (KDS)</h1>
      </header>
      <div id="kdsBoardContainer">
        <!-- KdsBoard renderizará aquí -->
      </div>
    `;
    return this.container;
  }
}
