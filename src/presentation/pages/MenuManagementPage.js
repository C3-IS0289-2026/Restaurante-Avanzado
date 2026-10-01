export class MenuManagementPage {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'menu-management-page';
  }

  render() {
    this.container.innerHTML = `
      <h1>Gestión de Menú</h1>
      <div class="management-layout">
        <div class="list-section" id="dishListContainer">
          <!-- DishList renderizará aquí -->
        </div>
        <div class="form-section" id="dishFormContainer">
          <!-- DishForm renderizará aquí -->
        </div>
      </div>
    `;
    return this.container;
  }
}
