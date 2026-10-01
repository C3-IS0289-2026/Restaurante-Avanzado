export class OrderTakingPage {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'order-taking-page';
  }

  render() {
    this.container.innerHTML = `
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
    return this.container;
  }
}
