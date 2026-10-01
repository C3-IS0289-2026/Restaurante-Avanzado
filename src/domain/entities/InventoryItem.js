export class InventoryItem {
  constructor({ id, name, quantity, unit, minStock, cost }) {
    this.id = id;
    this.name = name;
    this.quantity = quantity; // Stock actual
    this.unit = unit;
    this.minStock = minStock; // HU-011.1
    this.cost = cost;
  }

  isLowStock() {
    return this.quantity <= this.minStock;
  }
}
