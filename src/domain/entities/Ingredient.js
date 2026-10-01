export class Ingredient {
  constructor({ id, name, unitOfMeasure }) {
    this.id = id;
    this.name = name;
    this.unitOfMeasure = unitOfMeasure; // Ej: 'gr', 'ml', 'unidad'
  }
}
