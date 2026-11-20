import { BaseComponent } from './BaseComponent.js';

export class RecipeBuilder extends BaseComponent {
  constructor() {
    super('div', 'recipe-builder');
  }

  template() {
    return `
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
  }
}
