import { BaseComponent } from './BaseComponent.js';

export class TableOpenModal extends BaseComponent {
  constructor() {
    super('div', 'modal table-open-modal');
  }

  template() {
    return `
      <div class="modal-content">
        <h2>Abrir Mesa</h2>
        <form id="openTableForm">
          <label for="peopleCount">Número de personas:</label>
          <input type="number" id="peopleCount" name="peopleCount" min="1" required>
          
          <button type="submit">Confirmar y Abrir</button>
          <button type="button" class="cancel-btn">Cancelar</button>
        </form>
      </div>
    `;
  }
}
