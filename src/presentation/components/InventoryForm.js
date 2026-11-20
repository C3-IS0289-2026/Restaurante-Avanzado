import { BaseComponent } from './BaseComponent.js';

export class InventoryForm extends BaseComponent {
  constructor() {
    super('div', 'inventory-form');
  }

  template() {
    return `
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
  }
}
