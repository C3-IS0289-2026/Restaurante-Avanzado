export class MenuCategoryList {
  constructor({ categories }) {
    this.categories = categories || [];
    this.element = document.createElement('ul');
    this.element.className = 'category-list';
  }

  render() {
    this.element.innerHTML = this.categories.map(cat => 
      `<li class="category-item" data-id="${cat.id}">${cat.name}</li>`
    ).join('');
    return this.element;
  }
}
