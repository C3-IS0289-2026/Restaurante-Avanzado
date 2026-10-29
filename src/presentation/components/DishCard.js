import { BaseComponent } from './BaseComponent.js';

export class DishCard extends BaseComponent {
  constructor({ id, name, price, description } = {}) {
    super('div', 'dish-card');
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }

  template() {
    return `
      <h3>${this.name}</h3>
      <p class="desc">${this.description}</p>
      <p class="price">$${this.price}</p>
      <button class="btn-add">Agregar a Orden</button>
    `;
  }
}
