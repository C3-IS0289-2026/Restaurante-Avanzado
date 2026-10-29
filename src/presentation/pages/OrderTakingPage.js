import { BaseComponent } from '../components/BaseComponent.js';

export class OrderTakingPage extends BaseComponent {
  constructor() {
    super('div', 'order-taking-page');
  }

  template() {
    return `
      <div class="sidebar" id="categorySidebar">
        <!-- MenuCategoryList renderizará aquí -->
      </div>
      <div class="main-content">
        <h1>Toma de Pedidos</h1>
        <div class="dishes-grid" id="dishesGrid">
          <!-- DishCard(s) renderizarán aquí -->
        </div>
      </div>
    `;
  }
}
