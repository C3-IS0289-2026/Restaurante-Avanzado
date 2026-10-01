export class DishForm {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'dish-form';
  }

  render() {
    this.element.innerHTML = `
      <h2>Crear/Editar Platillo</h2>
      <form id="dishForm">
        <label>Nombre:</label>
        <input type="text" name="name" required>
        
        <label>Precio:</label>
        <input type="number" name="price" required>
        
        <label>Descripción:</label>
        <textarea name="description"></textarea>
        
        <label>Categoría:</label>
        <select name="category">
          <option>Parrilla</option>
          <option>Bebidas</option>
          <option>Postres</option>
        </select>
        
        <button type="submit">Guardar Platillo</button>
      </form>
    `;
    return this.element;
  }
}
