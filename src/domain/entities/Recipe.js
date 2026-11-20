import { Entity } from './Entity.js';
import { ValidationError } from '../exceptions/DomainErrors.js';
import { Cantidad } from '../value-objects/Cantidad.js';

/**
 * Entidad / Agregado de Dominio: Recipe (Receta de un platillo)
 * Gestiona la colección de ingredientes requeridos para preparar un plato.
 */
export class Recipe extends Entity {
  /**
   * @param {Object} params
   * @param {number|string} [params.id=null]
   * @param {number|string} params.dishId
   * @param {Array<{ ingredientId: number|string, quantity: number, unit: string }>} [params.ingredients=[]]
   * @param {string} [params.instructions='']
   */
  constructor({ id = null, dishId, ingredients = [], instructions = '' } = {}) {
    super(id);

    if (!dishId) {
      throw new ValidationError('dishId es obligatorio para definir una Receta');
    }

    this.dishId = Number.isNaN(Number(dishId)) ? dishId : Number(dishId);
    this._ingredients = [];
    this.instructions = instructions ? String(instructions).trim() : '';

    if (Array.isArray(ingredients)) {
      for (const item of ingredients) {
        this.addIngredient(item.ingredientId, item.quantity, item.unit);
      }
    }
  }

  /**
   * Retorna una copia defensiva de los ingredientes de la receta (Encapsulamiento POO)
   * @returns {Array<{ ingredientId: number|string, quantity: number, unit: string }>}
   */
  get ingredients() {
    return this._ingredients.map(item => ({ ...item }));
  }

  /**
   * Agrega o actualiza un ingrediente en la receta validando sus invariantes
   * @param {number|string} ingredientId
   * @param {number} quantity
   * @param {string} unit
   */
  addIngredient(ingredientId, quantity, unit) {
    if (!ingredientId) {
      throw new ValidationError('ingredientId es obligatorio para agregar a la receta');
    }
    if (!unit || typeof unit !== 'string' || unit.trim() === '') {
      throw new ValidationError('La unidad de medida es obligatoria para el ingrediente de la receta');
    }

    const cantVO = new Cantidad(quantity, { allowZero: false, fieldName: 'quantity' });
    const normalizedId = Number.isNaN(Number(ingredientId)) ? ingredientId : Number(ingredientId);
    const cleanUnit = unit.trim();

    const existingIndex = this._ingredients.findIndex(i => i.ingredientId === normalizedId);
    if (existingIndex >= 0) {
      this._ingredients[existingIndex].quantity = cantVO.value;
      this._ingredients[existingIndex].unit = cleanUnit;
    } else {
      this._ingredients.push({
        ingredientId: normalizedId,
        quantity: cantVO.value,
        unit: cleanUnit
      });
    }
  }

  /**
   * Elimina un ingrediente de la receta
   * @param {number|string} ingredientId
   * @returns {boolean}
   */
  removeIngredient(ingredientId) {
    const normalizedId = Number.isNaN(Number(ingredientId)) ? ingredientId : Number(ingredientId);
    const initialLength = this._ingredients.length;
    this._ingredients = this._ingredients.filter(i => i.ingredientId !== normalizedId);
    return this._ingredients.length < initialLength;
  }

  /**
   * Calcula las cantidades totales requeridas para un número de porciones/platos
   * @param {number} [portions=1]
   * @returns {Array<{ ingredientId: number|string, requiredQuantity: number, unit: string }>}
   */
  calculateRequirementsForPortions(portions = 1) {
    const portionsVO = new Cantidad(portions, {
      allowZero: false,
      onlyInteger: true,
      fieldName: 'portions'
    });
    return this._ingredients.map(item => ({
      ingredientId: item.ingredientId,
      requiredQuantity: Number((item.quantity * portionsVO.value).toFixed(2)),
      unit: item.unit
    }));
  }

  /**
   * Valida que la receta tenga al menos un ingrediente configurado
   * @returns {boolean}
   */
  isValid() {
    return Boolean(this.dishId) && this._ingredients.length > 0;
  }

  toJSON() {
    return {
      id: this.id,
      dishId: this.dishId,
      ingredients: this.ingredients,
      instructions: this.instructions
    };
  }
}

export default Recipe;
