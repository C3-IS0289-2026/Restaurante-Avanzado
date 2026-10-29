import { BaseComponent } from './BaseComponent.js';

export class MenuCategoryList extends BaseComponent {
  constructor({ categories } = {}) {
    super('ul', 'category-list');
    this.categories = categories || [];
  }

  template() {
    return this.categories.map(cat =>
      `<li class="category-item" data-id="${cat.id}">${cat.name}</li>`
    ).join('');
  }
}
