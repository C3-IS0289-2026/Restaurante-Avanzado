import { Entity } from './Entity.js';
import { ValidationError, BusinessRuleError } from '../exceptions/DomainErrors.js';
import { Cantidad } from '../value-objects/Cantidad.js';
import { Money } from '../value-objects/Money.js';

/**
 * Entidad de Dominio: InventoryItem (Ítem de Inventario con control de stock y umbral de alerta)
 */
export class InventoryItem extends Entity {
  /**
   * @param {Object} params
   * @param {number|string} [params.id=null]
   * @param {string} params.name
   * @param {number} [params.quantity=0]
   * @param {string} params.unit
   * @param {number} [params.minStock=0]
   * @param {number} [params.cost=0]
   */
  constructor({ id = null, name, quantity = 0, unit, minStock = 0, cost = 0 } = {}) {
    super(id);

    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new ValidationError('El nombre del ítem de inventario es obligatorio');
    }
    if (!unit || typeof unit !== 'string' || unit.trim() === '') {
      throw new ValidationError('La unidad de medida es obligatoria');
    }

    this._name = name.trim();
    this._unit = unit.trim();
    this._quantityVO = new Cantidad(quantity, { allowZero: true, fieldName: 'quantity' });
    this._minStockVO = new Cantidad(minStock, { allowZero: true, fieldName: 'minStock' });
    this._costVO = new Money(cost);
  }

  get name() {
    return this._name;
  }

  set name(val) {
    if (!val || typeof val !== 'string' || val.trim() === '') {
      throw new ValidationError('El nombre del ítem de inventario es obligatorio');
    }
    this._name = val.trim();
  }

  get unit() {
    return this._unit;
  }

  set unit(val) {
    if (!val || typeof val !== 'string' || val.trim() === '') {
      throw new ValidationError('La unidad de medida es obligatoria');
    }
    this._unit = val.trim();
  }

  get quantity() {
    return this._quantityVO.value;
  }

  set quantity(val) {
    this._quantityVO = new Cantidad(val, { allowZero: true, fieldName: 'quantity' });
  }

  get minStock() {
    return this._minStockVO.value;
  }

  set minStock(val) {
    this._minStockVO = new Cantidad(val, { allowZero: true, fieldName: 'minStock' });
  }

  get cost() {
    return this._costVO.amount;
  }

  set cost(val) {
    this._costVO = new Money(val);
  }

  /**
   * Determina si el stock actual está en o por debajo del mínimo configurado (HU-011.1)
   * @returns {boolean}
   */
  isLowStock() {
    return this.quantity <= this.minStock;
  }

  /**
   * Verifica si hay suficiente stock disponible para cubrir una cantidad requerida
   * @param {number} requiredAmount
   * @returns {boolean}
   */
  hasSufficientStock(requiredAmount) {
    const req = new Cantidad(requiredAmount, { allowZero: false, fieldName: 'requiredAmount' });
    return this.quantity >= req.value;
  }

  /**
   * Incrementa el stock disponible (ej. por ingreso de mercancía)
   * @param {number} amount
   * @returns {number} Nuevo stock
   */
  restock(amount) {
    const delta = new Cantidad(amount, { allowZero: false, fieldName: 'amount' });
    this._quantityVO = this._quantityVO.sumar(delta);
    return this.quantity;
  }

  /**
   * Descuenta del stock disponible validando que no quede negativo
   * @param {number} amount
   * @returns {number} Nuevo stock
   */
  consume(amount) {
    const delta = new Cantidad(amount, { allowZero: false, fieldName: 'amount' });
    if (this.quantity < delta.value) {
      throw new BusinessRuleError(
        `Stock insuficiente para "${this.name}". Disponible: ${this.quantity} ${this.unit}, Requerido: ${delta.value} ${this.unit}`
      );
    }
    this._quantityVO = new Cantidad(this.quantity - delta.value, { allowZero: true, fieldName: 'quantity' });
    return this.quantity;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      unit: this.unit,
      minStock: this.minStock,
      cost: this.cost,
      lowStock: this.isLowStock()
    };
  }
}

export default InventoryItem;
