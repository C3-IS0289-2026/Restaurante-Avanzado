export class Recipe {
  constructor({ dishId, ingredients, instructions }) {
    this.dishId = dishId;
    this.ingredients = ingredients || []; // Array de { ingredientId, quantity, unit }
    this.instructions = instructions || '';
  }

  addIngredient(ingredientId, quantity, unit) {
    this.ingredients.push({ ingredientId, quantity, unit });
  }

  // Lógica de dominio para validar la receta...
}
