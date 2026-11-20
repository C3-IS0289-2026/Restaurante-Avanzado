import { ValidationError } from '../exceptions/DomainErrors.js';

/**
 * Value Object: Money
 * Objeto de valor inmutable que encapsula montos monetarios, redondeo a 2 decimales y cálculos de impuestos.
 */
export class Money {
  /**
   * @param {number|string|Money} amount
   * @param {string} [currency='COP']
   */
  constructor(amount = 0, currency = 'COP') {
    const raw = amount instanceof Money ? amount.amount : Number(amount);

    if (Number.isNaN(raw) || !Number.isFinite(raw) || raw < 0) {
      throw new ValidationError('El monto monetario debe ser un número mayor o igual a 0');
    }

    this._amount = Number(raw.toFixed(2));
    this._currency = String(currency || 'COP').toUpperCase();
    Object.freeze(this);
  }

  /**
   * @returns {number}
   */
  get amount() {
    return this._amount;
  }

  /**
   * @returns {string}
   */
  get currency() {
    return this._currency;
  }

  /**
   * Suma otro monto y retorna una nueva instancia de Money
   * @param {Money|number} other
   * @returns {Money}
   */
  add(other) {
    const val = other instanceof Money ? other.amount : Number(other);
    return new Money(this._amount + val, this._currency);
  }

  /**
   * Multiplica el monto por una cantidad y retorna una nueva instancia de Money
   * @param {number} factor
   * @returns {Money}
   */
  multiply(factor) {
    return new Money(this._amount * Number(factor), this._currency);
  }

  /**
   * Calcula el impuesto dado un porcentaje (ej. 0.08 para 8%)
   * @param {number} rate
   * @returns {Money}
   */
  calculateTax(rate = 0.08) {
    return new Money(this._amount * Number(rate), this._currency);
  }

  equals(other) {
    if (other instanceof Money) {
      return this._amount === other.amount && this._currency === other.currency;
    }
    return this._amount === Number(other);
  }

  valueOf() {
    return this._amount;
  }

  toJSON() {
    return this._amount;
  }
}

export default Money;
