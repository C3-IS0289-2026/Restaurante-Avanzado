export class TableOpenModal {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'modal table-open-modal';
  }

  render() {
    this.element.innerHTML = `
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
    return this.element;
  }
}
