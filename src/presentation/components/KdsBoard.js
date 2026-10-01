export class KdsBoard {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'kds-board';
  }

  render() {
    this.element.innerHTML = `
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
    return this.element;
  }
}
