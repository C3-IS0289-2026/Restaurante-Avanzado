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
      </div>
    `;
    return this.container;
  }
}
