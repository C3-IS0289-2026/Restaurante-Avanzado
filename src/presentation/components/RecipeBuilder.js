export class RecipeBuilder {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'recipe-builder';
  }

  render() {
    this.element.innerHTML = `
      <h3>Construir Receta</h3>
      <div class="ingredient-search">
        <input type="text" placeholder="Buscar ingrediente...">
        <input type="number" placeholder="Cantidad">
        <select>
          <option value="gr">Gramos</option>
          <option value="ml">Mililitros</option>
          <option value="unidad">Unidades</option>
        </select>
        <button class="btn-add-ingredient">Añadir</button>
      </div>
      <ul class="recipe-ingredients-list">
        <!-- Ingredientes añadidos renderizarán aquí -->
      </ul>
    `;
    return this.element;
  }
}
