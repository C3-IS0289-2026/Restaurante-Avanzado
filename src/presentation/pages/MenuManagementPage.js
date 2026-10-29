import { BaseComponent } from '../components/BaseComponent.js';

export class MenuManagementPage extends BaseComponent {
  constructor() {
    super('div', 'menu-management-page');
  }

  template() {
    return `
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
  }
}
