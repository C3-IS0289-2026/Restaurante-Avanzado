import { BaseComponent } from './BaseComponent.js';

export class DishList extends BaseComponent {
  constructor({ dishes } = {}) {
    super('div', 'dish-list');
    this.dishes = dishes || [];
  }

  template() {
    return `
      <div class="filters">
        <input type="text" placeholder="Buscar platillo...">
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Iterar this.dishes aquí -->
        </tbody>
      </table>
    `;
  }
}
