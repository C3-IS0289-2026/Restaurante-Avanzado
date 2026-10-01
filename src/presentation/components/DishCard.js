export class DishCard {
  constructor({ id, name, price, description }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.element = document.createElement('div');
  }

  render() {
    this.element.className = 'dish-card';
    this.element.innerHTML = `
      <h3>${this.name}</h3>
      <p class="desc">${this.description}</p>
      <p class="price">$${this.price}</p>
      <button class="btn-add">Agregar a Orden</button>
    `;
    return this.element;
  }
}
