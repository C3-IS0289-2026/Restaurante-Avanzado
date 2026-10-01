export class DishList {
  constructor({ dishes }) {
    this.dishes = dishes || [];
    this.element = document.createElement('div');
  }

  render() {
    this.element.className = 'dish-list';
    
    // Tabla básica
    this.element.innerHTML = `
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
    return this.element;
  }
}
