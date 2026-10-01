export class InventoryForm {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'inventory-form';
  }

  render() {
    this.element.innerHTML = `
      <h2>Gestionar Ingrediente</h2>
      <form id="invForm">
        <label>Nombre:</label>
        <input type="text" name="name" required>
        
        <label>Unidad de Medida:</label>
        <input type="text" name="unit" required>
        
        <label>Stock Mínimo de Alerta:</label>
        <input type="number" name="minStock" min="0" required>
        
        <button type="submit">Guardar</button>
      </form>
    `;
    return this.element;
  }
}
